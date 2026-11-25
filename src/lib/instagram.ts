// Publicação no Instagram pela API oficial da Meta (Graph API).
// O token é de "usuário do sistema" do portfólio da Isa e não expira.
// Docs: https://developers.facebook.com/docs/instagram-platform/content-publishing

const GRAPH = 'https://graph.facebook.com/v23.0'

export type PostMedia = { type: 'image' | 'video'; url: string }
export type PostFormat = 'reel' | 'carrossel' | 'foto' | 'story'

function credentials() {
  const userId = process.env.INSTAGRAM_USER_ID
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!userId || !token) throw new Error('INSTAGRAM_USER_ID ou INSTAGRAM_ACCESS_TOKEN não configurados')
  return { userId, token }
}

async function graph<T>(path: string, params: Record<string, string | undefined>, method: 'GET' | 'POST' = 'GET'): Promise<T> {
  const { token } = credentials()
  const body = new URLSearchParams({ access_token: token })
  for (const [k, v] of Object.entries(params)) if (v !== undefined) body.set(k, v)
  const res =
    method === 'POST'
      ? await fetch(`${GRAPH}/${path}`, { method: 'POST', body, cache: 'no-store' })
      : await fetch(`${GRAPH}/${path}?${body}`, { cache: 'no-store' })
  const json = await res.json()
  if (!res.ok || json.error) {
    const e = json.error ?? {}
    // A mensagem para o usuário costuma ser a mais clara
    throw new Error(e.error_user_msg || e.message || `Erro ${res.status} na API do Instagram`)
  }
  return json as T
}

// Fotos do Sanity saem em JPEG (o Instagram não aceita outros formatos) e até 1440 px
export const instagramImageUrl = (sanityUrl: string) => `${sanityUrl}?fm=jpg&q=90&w=1440&fit=max`

const mediaParams = (m: PostMedia) =>
  m.type === 'image' ? { image_url: m.url } : { video_url: m.url }

/** Marcações e convite de colaboração de um post */
export type PostPeople = { tags?: string[]; collab?: boolean }

/** "@Fulana " -> "fulana" */
export const cleanUsername = (u: string) => u.trim().replace(/^@/, '').toLowerCase()

/**
 * Marcações no formato da API. Em foto, a Meta exige um ponto (x, y de 0 a 1):
 * as marcas ficam espalhadas na parte de baixo da imagem. Em story é opcional e em
 * vídeo não existe, então vai só o nome.
 */
function userTags(tags: string[] | undefined, kind: 'foto' | 'sem-ponto') {
  const names = (tags ?? []).map(cleanUsername).filter(Boolean)
  if (names.length === 0) return undefined
  return JSON.stringify(
    names.map((username, i) =>
      kind === 'foto' ? { username, x: Number(((i + 1) / (names.length + 1)).toFixed(2)), y: 0.85 } : { username }
    )
  )
}

/** Colaboradores: até 3, só em foto, reel e carrossel */
function collaborators(people?: PostPeople) {
  if (!people?.collab) return undefined
  const names = (people.tags ?? []).map(cleanUsername).filter(Boolean).slice(0, 3)
  return names.length ? JSON.stringify(names) : undefined
}

/**
 * Cria o "contêiner" do post no Instagram (ainda não publica).
 * Vídeos são processados pela Meta em segundo plano; o publicador confere depois.
 */
export async function createContainer(
  format: PostFormat,
  media: PostMedia[],
  caption: string,
  coverUrl?: string,
  people?: PostPeople
) {
  const { userId } = credentials()
  if (media.length === 0) throw new Error('Post sem foto ou vídeo')

  if (format === 'story') {
    const m = media[0]
    const { id } = await graph<{ id: string }>(
      `${userId}/media`,
      { media_type: 'STORIES', ...mediaParams(m), user_tags: userTags(people?.tags, 'sem-ponto') },
      'POST'
    )
    return id
  }

  if (format === 'reel') {
    const video = media.find((m) => m.type === 'video')
    if (!video) throw new Error('Reel precisa de um vídeo')
    const { id } = await graph<{ id: string }>(
      `${userId}/media`,
      {
        media_type: 'REELS',
        video_url: video.url,
        caption,
        cover_url: coverUrl,
        share_to_feed: 'true',
        user_tags: userTags(people?.tags, 'sem-ponto'),
        collaborators: collaborators(people),
      },
      'POST'
    )
    return id
  }

  if (format === 'carrossel' && media.length > 1) {
    // Carrossel é feito em etapas e devolve os itens (ver createCarouselItems)
    throw new Error('Use createCarouselItems para carrossel')
  }

  // Foto única (ou carrossel com um item só)
  const m = media[0]
  if (m.type === 'video') {
    // Vídeo único no feed hoje é sempre reel
    const { id } = await graph<{ id: string }>(
      `${userId}/media`,
      {
        media_type: 'REELS',
        video_url: m.url,
        caption,
        share_to_feed: 'true',
        user_tags: userTags(people?.tags, 'sem-ponto'),
        collaborators: collaborators(people),
      },
      'POST'
    )
    return id
  }
  const { id } = await graph<{ id: string }>(
    `${userId}/media`,
    { image_url: m.url, caption, user_tags: userTags(people?.tags, 'foto'), collaborators: collaborators(people) },
    'POST'
  )
  return id
}

export type ContainerStatus = 'FINISHED' | 'IN_PROGRESS' | 'ERROR' | 'EXPIRED' | 'PUBLISHED'

export async function containerStatus(containerId: string) {
  const r = await graph<{ status_code: ContainerStatus; status?: string }>(containerId, { fields: 'status_code,status' })
  return r
}

/**
 * Carrossel, etapa 1: envia cada foto ou vídeo como item. Não espera nada:
 * vídeos são processados pela Meta em segundo plano.
 */
export async function createCarouselItems(media: PostMedia[], people?: PostPeople) {
  const { userId } = credentials()
  if (media.length < 2) throw new Error('Carrossel precisa de pelo menos 2 itens')
  if (media.length > 10) throw new Error('Carrossel aceita no máximo 10 itens')
  const items: string[] = []
  for (const [i, m] of media.entries()) {
    // Marcação só no primeiro item, para não repetir em todas as fotos
    const tags = i === 0 ? userTags(people?.tags, m.type === 'image' ? 'foto' : 'sem-ponto') : undefined
    const { id } = await graph<{ id: string }>(
      `${userId}/media`,
      { is_carousel_item: 'true', ...(m.type === 'video' ? { media_type: 'VIDEO' } : {}), ...mediaParams(m), user_tags: tags },
      'POST'
    )
    items.push(id)
  }
  return items
}

/**
 * Carrossel, etapa 2: confere os itens uma vez, sem esperar.
 * Todos prontos: cria o contêiner do carrossel e devolve o id.
 * Algum ainda processando: devolve 'processando' para tentar na próxima chamada.
 */
export async function finishCarousel(
  items: string[],
  caption: string,
  people?: PostPeople
): Promise<{ containerId: string } | 'processando'> {
  const { userId } = credentials()
  const statuses = await Promise.all(items.map((id) => containerStatus(id)))
  const bad = statuses.find((s) => s.status_code === 'ERROR' || s.status_code === 'EXPIRED')
  if (bad) throw new Error(`Um item do carrossel foi recusado pelo Instagram: ${bad.status ?? bad.status_code}`)
  if (statuses.some((s) => s.status_code !== 'FINISHED')) return 'processando'
  const { id } = await graph<{ id: string }>(
    `${userId}/media`,
    { media_type: 'CAROUSEL', children: items.join(','), caption, collaborators: collaborators(people) },
    'POST'
  )
  return { containerId: id }
}

/** Publica um contêiner pronto e devolve o id e o link do post */
export async function publishContainer(containerId: string) {
  const { userId } = credentials()
  const { id } = await graph<{ id: string }>(`${userId}/media_publish`, { creation_id: containerId }, 'POST')
  let permalink: string | undefined
  try {
    permalink = (await graph<{ permalink?: string }>(id, { fields: 'permalink' })).permalink
  } catch {
    // Stories às vezes não devolvem link; não é erro
  }
  return { mediaId: id, permalink }
}

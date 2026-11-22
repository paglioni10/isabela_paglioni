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

/**
 * Cria o "contêiner" do post no Instagram (ainda não publica).
 * Vídeos são processados pela Meta em segundo plano; o publicador confere depois.
 */
export async function createContainer(format: PostFormat, media: PostMedia[], caption: string, coverUrl?: string) {
  const { userId } = credentials()
  if (media.length === 0) throw new Error('Post sem foto ou vídeo')

  if (format === 'story') {
    const m = media[0]
    const { id } = await graph<{ id: string }>(
      `${userId}/media`,
      { media_type: 'STORIES', ...mediaParams(m) },
      'POST'
    )
    return id
  }

  if (format === 'reel') {
    const video = media.find((m) => m.type === 'video')
    if (!video) throw new Error('Reel precisa de um vídeo')
    const { id } = await graph<{ id: string }>(
      `${userId}/media`,
      { media_type: 'REELS', video_url: video.url, caption, cover_url: coverUrl, share_to_feed: 'true' },
      'POST'
    )
    return id
  }

  if (format === 'carrossel' && media.length > 1) {
    if (media.length > 10) throw new Error('Carrossel aceita no máximo 10 itens')
    const children: string[] = []
    for (const m of media) {
      const { id } = await graph<{ id: string }>(
        `${userId}/media`,
        { is_carousel_item: 'true', ...(m.type === 'video' ? { media_type: 'VIDEO' } : {}), ...mediaParams(m) },
        'POST'
      )
      children.push(id)
    }
    // Vídeos dentro do carrossel precisam terminar de processar antes do contêiner principal
    for (const child of children) await waitFinished(child, 50_000)
    const { id } = await graph<{ id: string }>(
      `${userId}/media`,
      { media_type: 'CAROUSEL', children: children.join(','), caption },
      'POST'
    )
    return id
  }

  // Foto única (ou carrossel com um item só)
  const m = media[0]
  if (m.type === 'video') {
    // Vídeo único no feed hoje é sempre reel
    const { id } = await graph<{ id: string }>(
      `${userId}/media`,
      { media_type: 'REELS', video_url: m.url, caption, share_to_feed: 'true' },
      'POST'
    )
    return id
  }
  const { id } = await graph<{ id: string }>(`${userId}/media`, { image_url: m.url, caption }, 'POST')
  return id
}

export type ContainerStatus = 'FINISHED' | 'IN_PROGRESS' | 'ERROR' | 'EXPIRED' | 'PUBLISHED'

export async function containerStatus(containerId: string) {
  const r = await graph<{ status_code: ContainerStatus; status?: string }>(containerId, { fields: 'status_code,status' })
  return r
}

async function waitFinished(containerId: string, timeoutMs: number) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const { status_code, status } = await containerStatus(containerId)
    if (status_code === 'FINISHED') return
    if (status_code === 'ERROR' || status_code === 'EXPIRED') throw new Error(`Mídia recusada pelo Instagram: ${status ?? status_code}`)
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error('O Instagram demorou demais para processar um vídeo do carrossel')
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

'use client'

import { useCallback, useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { Badge, Box, Button, Card, Container, Flex, Heading, Spinner, Stack, Text, TextArea, useToast } from '@sanity/ui'
import { POST_FORMATS } from '../schemaTypes/instagramPost'

type Media = { _key: string; _type: 'image' | 'file'; url?: string; mime?: string }
type Post = {
  _id: string
  format?: string
  scheduledAt?: string
  caption?: string
  reason?: string
  media?: Media[]
  hasDraft?: boolean
}
type Upcoming = { _id: string; format?: string; scheduledAt?: string; caption?: string }

const PENDING = `*[_type == "instagramPost" && status == "aguardando" && !(_id in path("drafts.**"))] | order(scheduledAt asc){
  _id, format, scheduledAt, caption, reason,
  media[]{ _key, _type, "url": asset->url, "mime": asset->mimeType },
  "hasDraft": defined(*[_id == "drafts." + ^._id][0]._id)
}`
const UPCOMING = `*[_type == "instagramPost" && status == "aprovado" && !(_id in path("drafts.**"))] | order(scheduledAt asc)[0...10]{ _id, format, scheduledAt, caption }`

const formatTitle = (v?: string) => POST_FORMATS.find((f) => f.value === v)?.title ?? 'Post'
const when = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'sem data definida'
const firstLine = (text?: string) => (text ? text.split('\n')[0] : 'Post sem legenda')

export function ApprovalTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [pending, setPending] = useState<Post[] | null>(null)
  const [upcoming, setUpcoming] = useState<Upcoming[]>([])

  const load = useCallback(async () => {
    const [p, u] = await Promise.all([client.fetch<Post[]>(PENDING), client.fetch<Upcoming[]>(UPCOMING)])
    setPending(p)
    setUpcoming(u)
  }, [client])

  useEffect(() => {
    load()
    // Atualiza sozinho quando a equipe adiciona ou muda um post
    const sub = client
      .listen('*[_type == "instagramPost"]', {}, { visibility: 'query' })
      .subscribe(() => load())
    return () => sub.unsubscribe()
  }, [client, load])

  return (
    <Card height="fill" overflow="auto" tone="default">
      <Container width={1} paddingX={3} paddingY={4}>
        <Stack space={5}>
          <Stack space={3}>
            <Heading as="h1" size={3}>
              Posts para aprovar
            </Heading>
            <Text muted size={2}>
              Confira cada post. Aprovou, ele sai sozinho no dia e hora marcados.
            </Text>
          </Stack>

          {pending === null ? (
            <Flex justify="center" padding={5}>
              <Spinner muted />
            </Flex>
          ) : pending.length === 0 ? (
            <Card padding={5} radius={4} tone="positive" border>
              <Stack space={3}>
                <Text size={3} weight="semibold" align="center">
                  Tudo em dia!
                </Text>
                <Text size={2} align="center" muted>
                  Nenhum post esperando você.
                </Text>
              </Stack>
            </Card>
          ) : (
            pending.map((post) => <PostCard key={post._id} post={post} onDone={load} />)
          )}

          {upcoming.length > 0 && (
            <Stack space={3}>
              <Heading as="h2" size={1}>
                Próximos agendados
              </Heading>
              {upcoming.map((u) => (
                <Card key={u._id} padding={3} radius={3} border>
                  <Stack space={2}>
                    <Text size={1} muted>
                      {when(u.scheduledAt)} · {formatTitle(u.format)}
                    </Text>
                    <Text size={2} textOverflow="ellipsis">
                      {firstLine(u.caption)}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Card>
  )
}

function PostCard({ post, onDone }: { post: Post; onDone: () => void }) {
  const client = useClient({ apiVersion: '2024-01-01' })
  const toast = useToast()
  const [caption, setCaption] = useState(post.caption ?? '')
  const [editing, setEditing] = useState(false)
  const [asking, setAsking] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState(false)

  // Grava no post publicado e, se a equipe deixou um rascunho aberto, nele também
  const save = async (set: Record<string, unknown>, unset: string[] = []) => {
    const tx = client.transaction().patch(post._id, (p) => p.set(set).unset(unset))
    if (post.hasDraft) tx.patch(`drafts.${post._id}`, (p) => p.set(set).unset(unset))
    await tx.commit()
  }

  const run = async (action: () => Promise<void>, ok: string) => {
    setBusy(true)
    try {
      await action()
      toast.push({ status: 'success', title: ok })
      onDone()
    } catch (err) {
      toast.push({ status: 'error', title: 'Não deu certo', description: String((err as Error).message ?? err) })
    } finally {
      setBusy(false)
    }
  }

  const changed = caption !== (post.caption ?? '')

  return (
    <Card radius={4} shadow={1} overflow="hidden">
      <Stack>
        <MediaStrip media={post.media ?? []} />

        <Stack space={4} padding={4}>
          <Flex gap={2} wrap="wrap" align="center">
            <Badge tone="primary" fontSize={1} padding={2}>
              {formatTitle(post.format)}
            </Badge>
            <Text size={1} muted>
              {when(post.scheduledAt)}
            </Text>
          </Flex>

          {editing ? (
            <TextArea
              value={caption}
              onChange={(e) => setCaption(e.currentTarget.value)}
              rows={12}
              fontSize={2}
              padding={3}
              autoFocus
            />
          ) : (
            <Text size={2} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {caption || 'Post sem legenda'}
            </Text>
          )}

          <Flex gap={2}>
            {editing ? (
              <>
                <Button
                  mode="ghost"
                  text="Cancelar"
                  onClick={() => {
                    setCaption(post.caption ?? '')
                    setEditing(false)
                  }}
                />
                <Button
                  tone="primary"
                  text="Salvar legenda"
                  disabled={!changed || busy}
                  onClick={() =>
                    run(async () => {
                      await save({ caption })
                      setEditing(false)
                    }, 'Legenda salva')
                  }
                />
              </>
            ) : (
              <Button mode="bleed" tone="primary" text="Editar legenda" onClick={() => setEditing(true)} />
            )}
          </Flex>

          {post.reason && (
            <Card padding={3} radius={3} tone="transparent" border>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Por que este post
                </Text>
                <Text size={1} muted style={{ whiteSpace: 'pre-wrap' }}>
                  {post.reason}
                </Text>
              </Stack>
            </Card>
          )}

          {asking && (
            <Stack space={2}>
              <Text size={1} weight="semibold">
                O que você quer mudar?
              </Text>
              <TextArea
                value={feedback}
                onChange={(e) => setFeedback(e.currentTarget.value)}
                rows={4}
                fontSize={2}
                padding={3}
                placeholder="Ex.: troca a segunda foto, prefiro a do closet aberto"
                autoFocus
              />
            </Stack>
          )}

          <Flex gap={3}>
            {asking ? (
              <>
                <Box flex={1}>
                  <Button width="fill" mode="ghost" padding={4} fontSize={2} text="Voltar" onClick={() => setAsking(false)} />
                </Box>
                <Box flex={1}>
                  <Button
                    width="fill"
                    tone="caution"
                    padding={4}
                    fontSize={2}
                    text="Enviar pedido"
                    disabled={!feedback.trim() || busy}
                    onClick={() =>
                      run(
                        () => save({ status: 'ajuste', feedback: feedback.trim(), ...(changed ? { caption } : {}) }),
                        'Pedido enviado para a equipe'
                      )
                    }
                  />
                </Box>
              </>
            ) : (
              <>
                <Box flex={1}>
                  <Button
                    width="fill"
                    mode="ghost"
                    padding={4}
                    fontSize={2}
                    text="Pedir ajuste"
                    disabled={busy || editing}
                    onClick={() => setAsking(true)}
                  />
                </Box>
                <Box flex={1}>
                  <Button
                    width="fill"
                    tone="positive"
                    padding={4}
                    fontSize={2}
                    text="Aprovar"
                    disabled={busy || editing}
                    onClick={() =>
                      run(
                        () => save({ status: 'aprovado', approvedAt: new Date().toISOString() }, ['feedback']),
                        'Aprovado! Vai sair no horário marcado.'
                      )
                    }
                  />
                </Box>
              </>
            )}
          </Flex>
        </Stack>
      </Stack>
    </Card>
  )
}

// Fotos e vídeos lado a lado, deslizando como no Instagram
function MediaStrip({ media }: { media: Media[] }) {
  const [index, setIndex] = useState(0)
  if (media.length === 0) {
    return (
      <Card padding={5} tone="caution">
        <Text align="center" size={1}>
          Post sem foto ou vídeo
        </Text>
      </Card>
    )
  }
  return (
    <Box style={{ position: 'relative', background: '#111' }}>
      <div
        onScroll={(e) => {
          const el = e.currentTarget
          setIndex(Math.round(el.scrollLeft / el.clientWidth))
        }}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
        }}
      >
        {media.map((m) => (
          <div
            key={m._key}
            style={{ flex: '0 0 100%', scrollSnapAlign: 'center', aspectRatio: '4 / 5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {m._type === 'image' && m.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${m.url}?w=1080&fit=max&auto=format`}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : m.url ? (
              <video
                src={m.url}
                controls
                playsInline
                preload="metadata"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : null}
          </div>
        ))}
      </div>
      {media.length > 1 && (
        <Box style={{ position: 'absolute', top: 12, right: 12 }}>
          <Badge mode="outline" fontSize={1} padding={2} style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
            {index + 1}/{media.length}
          </Badge>
        </Box>
      )}
    </Box>
  )
}

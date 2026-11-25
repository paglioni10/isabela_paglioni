'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'
import { Box, Button, Card, Container, Flex, Heading, Spinner, Stack, Text } from '@sanity/ui'

// Tela "Métricas": visitas e cliques no WhatsApp contados pelo próprio site,
// sem cookie (ver /api/metricas). Números agregados por dia.

type Dia = {
  dia: string
  visitas?: number
  cliques?: number
  visitasPorOrigem?: Record<string, number>
  cliquesPorOrigem?: Record<string, number>
  cliquesPorLocal?: Record<string, number>
}

const ORIGENS: Record<string, string> = {
  instagram: 'Instagram',
  google: 'Google',
  direto: 'Acesso direto',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  bing: 'Bing',
  ia: 'ChatGPT e outras IAs',
  outro_site: 'Outros sites',
}
const LOCAIS: Record<string, string> = {
  topo: 'Topo da página inicial',
  mudanca: 'Seção de mudança',
  contato_telefone: 'Contato (telefone)',
  contato_botao: 'Contato (botão)',
  flutuante: 'Botão flutuante',
  pagina_mudanca: 'Página de mudança',
  pagina_mudanca_final: 'Página de mudança (fim)',
  pagina_organizacao_residencial: 'Página residencial',
  pagina_organizacao_residencial_final: 'Página residencial (fim)',
  pagina_organizacao_baby: 'Página do bebê',
  pagina_organizacao_baby_final: 'Página do bebê (fim)',
}
const PERIODOS = [7, 30, 90]

const hojeMenos = (dias: number) => {
  const d = new Date(Date.now() - dias * 86_400_000)
  return d.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}
const somar = (dias: Dia[], campo: 'visitasPorOrigem' | 'cliquesPorOrigem' | 'cliquesPorLocal') => {
  const total: Record<string, number> = {}
  for (const d of dias) for (const [k, v] of Object.entries(d[campo] ?? {})) total[k] = (total[k] ?? 0) + v
  return Object.entries(total).sort((a, b) => b[1] - a[1])
}
const pct = (a: number, b: number) => (b > 0 ? `${((a / b) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%` : '–')

export function MetricsTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [periodo, setPeriodo] = useState(30)
  const [dias, setDias] = useState<Dia[] | null>(null)

  useEffect(() => {
    setDias(null)
    client
      .fetch<Dia[]>(`*[_type == "metricaDia" && dia >= $desde] | order(dia asc)`, { desde: hojeMenos(periodo - 1) })
      .then(setDias)
      .catch(() => setDias([]))
  }, [client, periodo])

  const r = useMemo(() => {
    if (!dias) return null
    const visitas = dias.reduce((s, d) => s + (d.visitas ?? 0), 0)
    const cliques = dias.reduce((s, d) => s + (d.cliques ?? 0), 0)
    const visitasOrigem = Object.fromEntries(somar(dias, 'visitasPorOrigem'))
    return {
      visitas,
      cliques,
      porOrigem: somar(dias, 'cliquesPorOrigem'),
      visitasOrigem,
      porLocal: somar(dias, 'cliquesPorLocal'),
      maxDia: Math.max(1, ...dias.map((d) => d.visitas ?? 0)),
    }
  }, [dias])

  return (
    <Card height="fill" overflow="auto" tone="default">
      <Container width={1} paddingX={3} paddingY={4}>
        <Stack space={5}>
          <Stack space={3}>
            <Heading as="h1" size={3}>
              Métricas do site
            </Heading>
            <Text muted size={2}>
              Visitas e cliques no WhatsApp, contados pelo próprio site, sem cookies. Uma visita = uma aba aberta.
            </Text>
          </Stack>

          <Flex gap={2}>
            {PERIODOS.map((p) => (
              <Button key={p} mode={p === periodo ? 'default' : 'ghost'} tone="primary" text={`${p} dias`} onClick={() => setPeriodo(p)} />
            ))}
          </Flex>

          {!r ? (
            <Flex justify="center" padding={5}>
              <Spinner muted />
            </Flex>
          ) : r.visitas === 0 && r.cliques === 0 ? (
            <Card padding={4} radius={3} border>
              <Text size={2} muted>
                Ainda não há números neste período. A contagem começou em 24/11/2026 e aparece aqui a partir da primeira visita.
              </Text>
            </Card>
          ) : (
            <>
              <Flex gap={3} wrap="wrap">
                <Numero titulo="Visitas" valor={r.visitas} />
                <Numero titulo="Cliques no WhatsApp" valor={r.cliques} />
                <Numero titulo="Visitas que clicaram" valor={pct(r.cliques, r.visitas)} />
              </Flex>

              <Stack space={3}>
                <Heading as="h2" size={1}>
                  Visitas por dia
                </Heading>
                <Flex align="flex-end" gap={1} style={{ height: 96 }}>
                  {dias!.map((d) => (
                    <Box
                      key={d.dia}
                      title={`${d.dia.split('-').reverse().slice(0, 2).join('/')}: ${d.visitas ?? 0} visitas, ${d.cliques ?? 0} cliques`}
                      flex={1}
                      style={{
                        height: `${Math.max(2, ((d.visitas ?? 0) / r.maxDia) * 96)}px`,
                        background: (d.cliques ?? 0) > 0 ? '#DB2777' : '#F9A8D4',
                        borderRadius: 2,
                        minWidth: 3,
                      }}
                    />
                  ))}
                </Flex>
                <Text size={0} muted>
                  Rosa forte: dias com clique no WhatsApp.
                </Text>
              </Stack>

              <Tabela
                titulo="De onde vieram"
                colunas={['Origem', 'Visitas', 'Cliques']}
                linhas={Object.keys({ ...r.visitasOrigem, ...Object.fromEntries(r.porOrigem) })
                  .sort((a, b) => (r.visitasOrigem[b] ?? 0) - (r.visitasOrigem[a] ?? 0))
                  .map((k) => [ORIGENS[k] ?? k, r.visitasOrigem[k] ?? 0, Object.fromEntries(r.porOrigem)[k] ?? 0])}
              />
              <Tabela
                titulo="Qual botão foi clicado"
                colunas={['Botão', 'Cliques']}
                linhas={r.porLocal.map(([k, v]) => [LOCAIS[k] ?? k, v])}
              />
            </>
          )}

          <Text size={1} muted>
            Para saber quem veio do Instagram, o link da bio deve ser www.isapaglioni.com.br/?origem=instagram. O app do Instagram nem
            sempre informa de onde a pessoa veio.
          </Text>
        </Stack>
      </Container>
    </Card>
  )
}

function Numero({ titulo, valor }: { titulo: string; valor: number | string }) {
  return (
    <Card padding={4} radius={3} border style={{ flex: '1 1 140px' }}>
      <Stack space={3}>
        <Text size={1} muted>
          {titulo}
        </Text>
        <Text size={4} weight="semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {typeof valor === 'number' ? valor.toLocaleString('pt-BR') : valor}
        </Text>
      </Stack>
    </Card>
  )
}

function Tabela({ titulo, colunas, linhas }: { titulo: string; colunas: string[]; linhas: (string | number)[][] }) {
  return (
    <Stack space={3}>
      <Heading as="h2" size={1}>
        {titulo}
      </Heading>
      {linhas.length === 0 ? (
        <Text size={1} muted>
          Nada ainda.
        </Text>
      ) : (
        <Card radius={3} border>
          {[colunas, ...linhas].map((linha, i) => (
            <Flex key={i} padding={3} gap={3} style={{ borderTop: i ? '1px solid var(--card-border-color)' : undefined }}>
              {linha.map((c, j) => (
                <Box key={j} flex={j === 0 ? 2 : 1}>
                  <Text size={1} weight={i === 0 ? 'semibold' : 'regular'} align={j === 0 ? 'left' : 'right'} muted={i === 0}>
                    {typeof c === 'number' ? c.toLocaleString('pt-BR') : c}
                  </Text>
                </Box>
              ))}
            </Flex>
          ))}
        </Card>
      )}
    </Stack>
  )
}

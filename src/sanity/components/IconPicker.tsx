'use client'

import { useState } from 'react'
import { set, unset, type StringInputProps } from 'sanity'
import { Box, Card, Flex, Grid, Stack, Text, TextInput } from '@sanity/ui'
import * as LucideIcons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

// Ícones sugeridos, com nomes em português para facilitar a busca
export const ICON_OPTIONS: { name: string; label: string }[] = [
  { name: 'Home', label: 'Casa' },
  { name: 'Sofa', label: 'Sala' },
  { name: 'BedDouble', label: 'Quarto' },
  { name: 'Bath', label: 'Banheiro' },
  { name: 'CookingPot', label: 'Cozinha' },
  { name: 'Utensils', label: 'Talheres' },
  { name: 'Refrigerator', label: 'Geladeira' },
  { name: 'Shirt', label: 'Closet / Roupas' },
  { name: 'WashingMachine', label: 'Lavanderia' },
  { name: 'Baby', label: 'Bebê' },
  { name: 'Wine', label: 'Recém-casados' },
  { name: 'Gift', label: 'Presente' },
  { name: 'Briefcase', label: 'Escritório' },
  { name: 'Laptop', label: 'Notebook' },
  { name: 'Video', label: 'Online / Vídeo' },
  { name: 'Truck', label: 'Mudança' },
  { name: 'PackageOpen', label: 'Caixa aberta' },
  { name: 'Package', label: 'Caixa' },
  { name: 'Boxes', label: 'Caixas' },
  { name: 'Archive', label: 'Arquivo' },
  { name: 'Luggage', label: 'Mala / Viagem' },
  { name: 'Brain', label: 'Inclusiva / Mente' },
  { name: 'Accessibility', label: 'Acessibilidade' },
  { name: 'Puzzle', label: 'Quebra-cabeça' },
  { name: 'Users', label: 'Família' },
  { name: 'HandHeart', label: 'Cuidado' },
  { name: 'Handshake', label: 'Parceria' },
  { name: 'Heart', label: 'Coração' },
  { name: 'Sparkles', label: 'Brilho' },
  { name: 'Star', label: 'Estrela' },
  { name: 'Crown', label: 'Coroa' },
  { name: 'Gem', label: 'Joia' },
  { name: 'Flower2', label: 'Flor' },
  { name: 'Leaf', label: 'Folha' },
  { name: 'Recycle', label: 'Desapego' },
  { name: 'Tag', label: 'Etiqueta' },
  { name: 'Layers', label: 'Camadas' },
  { name: 'ShoppingBag', label: 'Compras' },
  { name: 'ClipboardList', label: 'Checklist' },
  { name: 'Calendar', label: 'Agenda' },
  { name: 'Clock', label: 'Tempo' },
  { name: 'Lightbulb', label: 'Ideia' },
  { name: 'GraduationCap', label: 'Curso' },
  { name: 'Book', label: 'Livro' },
  { name: 'PawPrint', label: 'Pet' },
  { name: 'Camera', label: 'Foto' },
  { name: 'MessageCircle', label: 'Conversa' },
  { name: 'Smile', label: 'Sorriso' },
]

export function getIcon(name?: string) {
  if (!name) return undefined
  return (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[name]
}

export function IconPicker(props: StringInputProps) {
  const { value, onChange } = props
  const [search, setSearch] = useState('')

  const term = search.trim().toLowerCase()
  const options = ICON_OPTIONS.filter(
    (o) => !term || o.label.toLowerCase().includes(term) || o.name.toLowerCase().includes(term)
  )

  const Selected = getIcon(value)
  const selectedLabel = ICON_OPTIONS.find((o) => o.name === value)?.label ?? value

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} tone={value ? 'positive' : 'transparent'} border>
        <Flex align="center" gap={3}>
          <Box>{Selected ? <Selected size={28} /> : <LucideIcons.Sparkles size={28} opacity={0.4} />}</Box>
          <Text size={1}>
            {value ? <>Ícone escolhido: <strong>{selectedLabel}</strong></> : 'Nenhum ícone escolhido (o site usará ✨ brilho)'}
          </Text>
          {value && (
            <Box style={{ marginLeft: 'auto' }}>
              <Text size={1}>
                <a href="#" onClick={(e) => { e.preventDefault(); onChange(unset()) }}>Remover</a>
              </Text>
            </Box>
          )}
        </Flex>
      </Card>

      <TextInput
        placeholder="Buscar ícone (ex: cozinha, bebê, mudança...)"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <Grid columns={[3, 4, 6]} gap={2}>
        {options.map((o) => {
          const Icon = getIcon(o.name)
          if (!Icon) return null
          const active = o.name === value
          return (
            <Card
              key={o.name}
              as="button"
              type="button"
              padding={3}
              radius={2}
              border
              tone={active ? 'primary' : 'default'}
              selected={active}
              onClick={() => onChange(set(o.name))}
              style={{ cursor: 'pointer', textAlign: 'center' }}
              title={o.label}
            >
              <Stack space={2}>
                <Flex justify="center"><Icon size={24} /></Flex>
                <Text size={0} muted textOverflow="ellipsis">{o.label}</Text>
              </Stack>
            </Card>
          )
        })}
      </Grid>
      {options.length === 0 && <Text size={1} muted>Nenhum ícone encontrado com “{search}”.</Text>}
    </Stack>
  )
}

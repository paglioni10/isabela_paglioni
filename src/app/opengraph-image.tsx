import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

// Prévia exibida quando o link do site é compartilhado (WhatsApp, Instagram, Facebook)
export const alt = 'Isa Paglioni, personal organizer especialista em mudanças em Palhoça e Grande Florianópolis'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), 'public', 'foto_isa.jpg'))
  const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#FFF5F7' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 64px',
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 700, color: '#111827' }}>Isa Paglioni</div>
          <div style={{ fontSize: 20, letterSpacing: 6, color: '#DB2777', fontWeight: 700, marginTop: 6 }}>
            PERSONAL ORGANIZER
          </div>
          <div style={{ fontSize: 60, fontWeight: 700, color: '#111827', lineHeight: 1.1, marginTop: 40 }}>
            Mudança sem caos e casa organizada.
          </div>
          <div style={{ fontSize: 28, color: '#4B5563', marginTop: 28 }}>
            Palhoça e Grande Florianópolis
          </div>
        </div>
        {/* Foto 1080x1920 escalada para 420 de largura (747 de altura); a moldura corta
            a parte de baixo, onde a foto original tem um resto de legenda */}
        <div style={{ width: 420, height: 630, display: 'flex', overflow: 'hidden' }}>
          <img src={photoSrc} width={420} height={747} alt="" />
        </div>
      </div>
    ),
    size
  )
}

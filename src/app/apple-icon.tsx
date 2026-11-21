import { ImageResponse } from 'next/og'

// Ícone usado quando alguém salva o site na tela inicial do celular
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#DB2777',
          color: '#fff',
          fontSize: 92,
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
        }}
      >
        IP
      </div>
    ),
    size
  )
}

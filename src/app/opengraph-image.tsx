import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const alt = 'CA Vidraçaria e Esquadrias de Alumínio'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const logoData = readFileSync(join(process.cwd(), 'public', 'assets', 'logo.png'))
  const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1c1c1c 60%, #0d0d0d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          gap: '36px',
          padding: '60px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoBase64}
          width={280}
          height={140}
          alt="CA Vidraçaria logo"
          style={{ objectFit: 'contain' }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              color: '#ffffff',
              fontSize: '54px',
              fontWeight: '700',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            CA Vidraçaria
          </div>
          <div
            style={{
              color: '#aaaaaa',
              fontSize: '30px',
              textAlign: 'center',
            }}
          >
            Esquadrias de Alumínio
          </div>
          <div
            style={{
              color: '#666666',
              fontSize: '22px',
              textAlign: 'center',
              marginTop: '6px',
            }}
          >
            www.cavidracaria.com.br
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

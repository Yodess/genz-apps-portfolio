import { ImageResponse } from 'next/og'

export const alt = 'GenZ Apps — Applications Web & PWA sur mesure'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* Logo K */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 22,
            background: '#6C3FE8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <span style={{ color: 'white', fontSize: 54, fontWeight: 700 }}>K</span>
        </div>

        {/* Title */}
        <div
          style={{
            color: 'white',
            fontSize: 52,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          GenZ Apps
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#a5b4fc',
            fontSize: 26,
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Applications Web & PWA sur mesure
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            color: '#64748b',
            fontSize: 18,
          }}
        >
          www.genz-apps.com
        </div>
      </div>
    ),
    { ...size }
  )
}

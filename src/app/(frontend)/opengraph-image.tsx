import { ImageResponse } from 'next/og'

export const alt = 'ARMAGEDON - Zespół muzyczny na wesele'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0f0f23 0%, #0a0a0a 40%, #1a1510 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative top line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent 10%, #c9a84c 50%, transparent 90%)',
          }}
        />

        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
          }}
        />

        {/* Music note decorations */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 12,
            opacity: 0.4,
          }}
        >
          <span style={{ fontSize: 28, color: '#c9a84c' }}>&#9835;</span>
          <div
            style={{
              width: 60,
              height: 1,
              background: '#c9a84c',
            }}
          />
          <span style={{ fontSize: 28, color: '#c9a84c' }}>&#9833;</span>
          <div
            style={{
              width: 60,
              height: 1,
              background: '#c9a84c',
            }}
          />
          <span style={{ fontSize: 28, color: '#c9a84c' }}>&#9835;</span>
        </div>

        {/* Main title */}
        <span
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: '#c9a84c',
            fontFamily: 'serif',
            letterSpacing: 8,
            lineHeight: 1,
          }}
        >
          ARMAGEDON
        </span>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 80,
              height: 1,
              background: 'linear-gradient(90deg, transparent, #c9a84c)',
            }}
          />
          <span style={{ fontSize: 18, color: '#c9a84c', opacity: 0.6 }}>&#9830;</span>
          <div
            style={{
              width: 80,
              height: 1,
              background: 'linear-gradient(90deg, #c9a84c, transparent)',
            }}
          />
        </div>

        {/* Subtitle */}
        <span
          style={{
            fontSize: 32,
            color: '#f5f5f5',
            fontFamily: 'sans-serif',
            fontWeight: 300,
            letterSpacing: 4,
          }}
        >
          ZESPOL MUZYCZNY NA WESELE
        </span>

        {/* Contact info */}
        <span
          style={{
            fontSize: 20,
            color: '#a3a3a3',
            fontFamily: 'sans-serif',
            marginTop: 32,
            letterSpacing: 2,
          }}
        >
          505 566 007
        </span>

        {/* Bottom decorative line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent 10%, #c9a84c 50%, transparent 90%)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}

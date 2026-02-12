import { ImageResponse } from 'next/og'

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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 50%, #12100a 100%)',
          borderRadius: 40,
        }}
      >
        <span
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: '#c9a84c',
            fontFamily: 'serif',
            lineHeight: 1,
            marginBottom: -4,
          }}
        >
          A
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#c9a84c',
            fontFamily: 'sans-serif',
            letterSpacing: 6,
            opacity: 0.7,
          }}
        >
          BAND
        </span>
      </div>
    ),
    { ...size },
  )
}

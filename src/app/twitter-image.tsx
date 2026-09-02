import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Natanael Alexander — Creative Digital Architect';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', fontSize: 180, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '20px' }}>
          NA
        </div>
        <div style={{ display: 'flex', fontSize: 35, fontWeight: 400, color: '#A0A0A0', letterSpacing: '0.2em' }}>
          CREATIVE DIGITAL ARCHITECT
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

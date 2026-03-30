'use client'
import { PROTOCOLS } from '@/lib/protocols'

const RISK_COLORS: Record<string, string> = {
  low: '#00e676',
  medium: '#ffb300',
  high: '#ff5252',
}

export default function ProtocolsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>PROTOCOLS</h1>
          <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>Mantle DeFi Protocol Explorer</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#030f07', border: '1px solid #1a6b45', borderRadius: '20px', padding: '8px 16px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '12px', fontWeight: '600' }}>6 PROTOCOLS</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px' }}>
        <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '24px' }}>ALL INTEGRATED PROTOCOLS</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {Object.entries(PROTOCOLS).map(([key, protocol]) => (
            <div key={key} style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '15px', fontWeight: '700' }}>{protocol.name}</p>
                  <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '3px', letterSpacing: '1px' }}>{protocol.type}</p>
                </div>
                <span style={{ color: RISK_COLORS[protocol.risk], fontSize: '12px', fontWeight: '600', fontFamily: 'JetBrains Mono, monospace', background: '#020c06', border: `1px solid ${RISK_COLORS[protocol.risk]}40`, padding: '4px 12px', borderRadius: '20px' }}>
                  {protocol.risk}
                </span>
              </div>

              <p style={{ color: '#4db87a', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>{protocol.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#020c06', border: '1px solid #0d2e18', borderRadius: '10px', padding: '14px' }}>
                  <p style={{ color: '#1a6b45', fontSize: '10px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>APY RANGE</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '16px', fontWeight: '700' }}>{protocol.apy.min}–{protocol.apy.max}%</p>
                </div>
                <div style={{ background: '#020c06', border: '1px solid #0d2e18', borderRadius: '10px', padding: '14px' }}>
                  <p style={{ color: '#1a6b45', fontSize: '10px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>TVL</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '16px', fontWeight: '700' }}>{protocol.tvl}</p>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: '#1a6b45', fontSize: '10px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '10px' }}>HOW TO USE</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {protocol.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '12px', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>{i + 1}.</span>
                      <p style={{ color: '#4db87a', fontSize: '13px', lineHeight: '1.5' }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#1a6b45', fontSize: '10px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '10px' }}>RISK FACTORS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {protocol.riskFactors.map((r, i) => (
                    <span key={i} style={{ color: '#ff8a80', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', background: '#1a0a0a', border: '1px solid #3d101040', padding: '4px 10px', borderRadius: '20px' }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <a href={protocol.mantle_link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '700', color: '#00e676', textDecoration: 'underline', textUnderlineOffset: '3px', letterSpacing: '1px' }}>
                OPEN {protocol.name.toUpperCase()} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

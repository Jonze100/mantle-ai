'use client'
import { useStrategy } from '@/context/StrategyContext'
import { useRouter } from 'next/navigation'
import { PROTOCOLS } from '@/lib/protocols'
import Link from 'next/link'

const RISK_COLORS: Record<string, string> = {
  low: '#00e676',
  medium: '#ffb300',
  high: '#ff5252',
}

export default function StrategyPage() {
  const { strategy, input, setStrategy } = useStrategy()
  const router = useRouter()

  if (!strategy) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18' }}>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>STRATEGY</h1>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2d7a4f', fontSize: '14px' }}>NO STRATEGY GENERATED YET</p>
          <Link href="/dashboard" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none' }}>
            GO TO DASHBOARD →
          </Link>
        </div>
      </div>
    )
  }

  const apyMin = strategy.estimatedAPY?.min ?? 0
  const apyMax = strategy.estimatedAPY?.max ?? 0
  const strategies = strategy.strategies ?? []
  const executionPath = strategy.executionPath ?? []
  const risks = strategy.risks ?? []
  const analysts = strategy.analysts ?? ['Conservative Analyst', 'Yield Maximizer', 'Risk Manager']

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>STRATEGY</h1>
          <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>AI-synthesized from 3 expert analyst perspectives</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#030f07', border: '1px solid #1a6b45', borderRadius: '20px', padding: '8px 16px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '12px', fontWeight: '600' }}>MANTLE MAINNET</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Analyst badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ color: '#1a6b45', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '1px' }}>SYNTHESIZED FROM:</span>
          {analysts.map((a) => (
            <span key={a} style={{ background: '#030f07', border: '1px solid #0d2e18', borderRadius: '20px', padding: '4px 12px', color: '#4db87a', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
              {a}
            </span>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: 'linear-gradient(135deg, #0a3d1f, #030f07)', border: '1px solid #1a6b45', borderRadius: '16px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '12px' }}>AI STRATEGY SUMMARY</p>
              <p style={{ color: '#e8f5ee', fontSize: '15px', lineHeight: '1.7', marginBottom: '12px' }}>{strategy.summary}</p>
              {strategy.analystConsensus && (
                <p style={{ color: '#4db87a', fontSize: '13px', fontStyle: 'italic', marginBottom: '8px' }}>
                  Analyst consensus: {strategy.analystConsensus}
                </p>
              )}
              <p style={{ color: '#2d7a4f', fontSize: '13px', fontStyle: 'italic' }}>{strategy.mantleAdvantage}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>EST. APY</p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '36px', fontWeight: '700', background: 'linear-gradient(135deg, #00c853, #1de9b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {apyMin}–{apyMax}%
              </p>
              <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '4px' }}>
                {input.amount ? `$${input.amount} USDC` : ''} · {input.risk} risk
              </p>
            </div>
          </div>
        </div>

        {/* Strategy comparison */}
        {strategies.length > 0 && (
          <div>
            <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px' }}>STRATEGY COMPARISON</p>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${strategies.length}, 1fr)`, gap: '16px' }}>
              {strategies.map((s, i) => (
                <div key={i} style={{ background: i === 1 ? 'linear-gradient(135deg, #0a3d1f, #030f07)' : 'linear-gradient(135deg, #030f07, #020c06)', border: i === 1 ? '1px solid #1a6b45' : '1px solid #0d2e18', borderRadius: '16px', padding: '24px' }}>
                  {i === 1 && (
                    <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', marginBottom: '12px', fontFamily: 'JetBrains Mono, monospace' }}>
                      RECOMMENDED
                    </span>
                  )}
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '6px' }}>{s.tier}</p>
                  <p style={{ color: '#e8f5ee', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>{s.protocol}</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '28px', fontWeight: '700', color: '#00e676', marginBottom: '4px' }}>{s.expectedAPY}%</p>
                  <p style={{ color: '#2d7a4f', fontSize: '12px', marginBottom: '8px' }}>expected APY</p>
                  <p style={{ color: '#2d7a4f', fontSize: '12px', marginBottom: '10px' }}>Allocation: {s.allocation}</p>
                  <span style={{ color: RISK_COLORS[s.risk] ?? '#ffb300', fontSize: '12px', fontWeight: '600', fontFamily: 'JetBrains Mono, monospace', background: '#020c06', border: `1px solid ${RISK_COLORS[s.risk] ?? '#ffb300'}40`, padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px' }}>
                    {s.risk} risk
                  </span>
                  <p style={{ color: '#4db87a', fontSize: '13px', lineHeight: '1.5' }}>{s.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APY breakdown + risks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px' }}>PROTOCOL APY BREAKDOWN</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {strategies.map((s, i) => {
                const protocol = Object.values(PROTOCOLS).find((p) => p.name === s.protocol)
                return (
                  <div key={i} style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '14px', fontWeight: '700' }}>{s.protocol}</p>
                      {protocol && <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>TVL: {protocol.tvl}</p>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '20px', fontWeight: '700' }}>{s.expectedAPY}%</p>
                      <span style={{ color: RISK_COLORS[s.risk] ?? '#ffb300', fontSize: '11px', fontWeight: '600' }}>{s.risk}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {risks.length > 0 && (
            <div>
              <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px' }}>RISK BREAKDOWN</p>
              <div style={{ background: 'linear-gradient(135deg, #1a0a0a, #0f0606)', border: '1px solid #3d1010', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {risks.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#ff5252', fontSize: '14px', flexShrink: 0 }}>▲</span>
                    <p style={{ color: '#ff8a80', fontSize: '13px', lineHeight: '1.5' }}>{r}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '16px' }}>
          <Link href="/execute" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', letterSpacing: '1px' }}>
            VIEW EXECUTION PATH →
          </Link>
          <button
            onClick={() => { setStrategy(null); router.push('/dashboard') }}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#2d7a4f', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            ← GENERATE NEW STRATEGY
          </button>
        </div>
      </div>
    </div>
  )
}

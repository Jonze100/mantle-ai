'use client'
import { useStrategy } from '@/context/StrategyContext'
import { useStrategyHistory } from '@/hooks/useStrategyHistory'
import { PROTOCOLS } from '@/lib/protocols'
import PortfolioSimulator from '@/components/PortfolioSimulator'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function ExecutePage() {
  const { strategy, input } = useStrategy()
  const { history, saveStrategy } = useStrategyHistory()
  const savedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!strategy || !input.amount) return
    const key = `${input.amount}-${input.risk}-${strategy.summary?.slice(0, 30)}`
    if (savedRef.current === key) return
    savedRef.current = key
    saveStrategy(input, strategy)
  }, [strategy, input])

  if (!strategy) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18' }}>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>EXECUTE</h1>
          <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>Step-by-step execution path</p>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2d7a4f', fontSize: '14px' }}>NO STRATEGY TO EXECUTE YET</p>
          <Link href="/dashboard" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none' }}>
            BUILD A STRATEGY →
          </Link>
        </div>
      </div>
    )
  }

  const strategies = Array.isArray(strategy.strategies) ? strategy.strategies : []
  const executionPath = Array.isArray(strategy.executionPath) ? strategy.executionPath : []
  const risks = Array.isArray(strategy.risks) ? strategy.risks : []
  const recommended = strategies.find((s) => s.tier === 'Balanced') ?? strategies[1] ?? strategies[0]
  const recommendedAPY = recommended?.expectedAPY ?? strategy.estimatedAPY?.max ?? 10

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>EXECUTE</h1>
          <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>Step-by-step execution path</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#030f07', border: '1px solid #1a6b45', borderRadius: '20px', padding: '8px 16px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '12px', fontWeight: '600' }}>MANTLE MAINNET</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Mantle advantage */}
        <div style={{ background: 'linear-gradient(135deg, #0a3d1f, #030f07)', border: '1px solid #1a6b45', borderRadius: '16px', padding: '20px 24px' }}>
          <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>MANTLE ADVANTAGE</p>
          <p style={{ color: '#4db87a', fontSize: '14px', lineHeight: '1.6' }}>{strategy.mantleAdvantage}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Steps */}
          <div>
            <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '20px' }}>EXECUTION STEPS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {executionPath.map((step) => {
                const protocol = Object.values(PROTOCOLS).find((p) => p.name === step.protocol)
                return (
                  <div key={step.step} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #0a3d1f, #0d2e18)', border: '1px solid #1a6b45', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '15px', fontWeight: '700' }}>{step.step}</span>
                    </div>
                    <div style={{ flex: 1, background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '16px 20px' }}>
                      <p style={{ color: '#e8f5ee', fontSize: '14px', lineHeight: '1.6', marginBottom: '10px' }}>{step.action}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '12px', fontWeight: '600' }}>{step.protocol}</span>
                        <span style={{ color: '#2d7a4f', fontSize: '12px' }}>· {step.gasNote}</span>
                        {protocol?.mantle_link && (
                          <a href={protocol.mantle_link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4db87a', fontSize: '12px', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                            OPEN →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Simulator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <PortfolioSimulator amount={input.amount} apy={recommendedAPY} />
          </div>
        </div>

        {/* Risk breakdown */}
        {risks.length > 0 && (
          <div>
            <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px' }}>RISK FACTORS</p>
            <div style={{ background: 'linear-gradient(135deg, #1a0a0a, #0f0606)', border: '1px solid #3d1010', borderRadius: '16px', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {risks.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#ff5252', fontSize: '14px', flexShrink: 0 }}>▲</span>
                  <p style={{ color: '#ff8a80', fontSize: '13px', lineHeight: '1.5' }}>{r}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategy history */}
        {history.length > 0 && (
          <div>
            <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px' }}>STRATEGY HISTORY</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((entry) => (
                <div key={entry.id} style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4db87a', fontSize: '12px', marginBottom: '4px' }}>{entry.timestamp}</p>
                    <p style={{ color: '#e8f5ee', fontSize: '13px' }}>${entry.input.amount} USDC · {entry.input.risk} risk</p>
                    <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>{entry.strategy.summary?.slice(0, 80)}...</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '18px', fontWeight: '700' }}>
                      {entry.strategy.estimatedAPY?.min ?? 0}–{entry.strategy.estimatedAPY?.max ?? 0}%
                    </p>
                    <p style={{ color: '#1a6b45', fontSize: '11px' }}>est. APY</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '24px', paddingBottom: '16px' }}>
          <Link href="/strategy" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#2d7a4f', textDecoration: 'underline', textUnderlineOffset: '4px' }}>← BACK TO STRATEGY</Link>
          <Link href="/protocols" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#2d7a4f', textDecoration: 'underline', textUnderlineOffset: '4px' }}>VIEW ALL PROTOCOLS →</Link>
        </div>
      </div>
    </div>
  )
}

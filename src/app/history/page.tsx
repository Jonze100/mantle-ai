'use client'
import { useStrategyHistory } from '@/hooks/useStrategyHistory'
import { useStrategy } from '@/context/StrategyContext'
import { useRouter } from 'next/navigation'

const RISK_COLORS: Record<string, string> = {
  low: '#00e676',
  medium: '#ffb300',
  high: '#ff5252',
}

export default function HistoryPage() {
  const { history, clearHistory } = useStrategyHistory()
  const { setStrategy, setInput } = useStrategy()
  const router = useRouter()

  function restore(entry: typeof history[0]) {
    setInput(entry.input)
    setStrategy(entry.strategy)
    router.push('/strategy')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>HISTORY</h1>
          <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>Your past generated strategies</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '600', background: 'transparent', border: '1px solid #3d1010', borderRadius: '8px', color: '#ff5252', padding: '8px 16px', cursor: 'pointer', letterSpacing: '1px' }}
            >
              CLEAR ALL
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#030f07', border: '1px solid #1a6b45', borderRadius: '20px', padding: '8px 16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '12px', fontWeight: '600' }}>
              {history.length} SAVED
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px' }}>
        {history.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #0a3d1f, #0d2e18)', border: '1px solid #1a6b45', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              ◈
            </div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2d7a4f', fontSize: '14px', letterSpacing: '1px' }}>NO STRATEGIES SAVED YET</p>
            <p style={{ color: '#1a6b45', fontSize: '13px', textAlign: 'center', maxWidth: '360px', lineHeight: '1.6' }}>
              Generate a strategy from the Dashboard and it will automatically appear here. You can restore any past strategy with one click.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '8px' }}>
              SAVED STRATEGIES — click RESTORE to reload any strategy
            </p>
            {history.map((entry, idx) => (
              <div
                key={entry.id}
                style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '24px', position: 'relative' }}
              >
                {/* Latest badge */}
                {idx === 0 && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                    <span style={{ background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', fontFamily: 'JetBrains Mono, monospace' }}>
                      LATEST
                    </span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
                  <div>
                    {/* Timestamp + meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#1a6b45', fontSize: '11px' }}>{entry.timestamp}</span>
                      <span style={{ color: RISK_COLORS[entry.input.risk] ?? '#ffb300', fontSize: '11px', fontWeight: '600', fontFamily: 'JetBrains Mono, monospace', background: '#020c06', border: `1px solid ${RISK_COLORS[entry.input.risk] ?? '#ffb300'}40`, padding: '2px 8px', borderRadius: '20px' }}>
                        {entry.input.risk} risk
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2d7a4f', fontSize: '11px' }}>
                        ${entry.input.amount} USDC
                      </span>
                    </div>

                    {/* Summary */}
                    <p style={{ color: '#e8f5ee', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>
                      {entry.strategy.summary}
                    </p>

                    {/* Goal */}
                    <p style={{ color: '#2d7a4f', fontSize: '12px', fontStyle: 'italic', marginBottom: '16px' }}>
                      Goal: {entry.input.goal}
                    </p>

                    {/* Protocol pills */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(entry.strategy.strategies ?? []).map((s, i) => (
                        <span key={i} style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4db87a', fontSize: '11px', background: '#030f07', border: '1px solid #0d2e18', padding: '4px 10px', borderRadius: '20px' }}>
                          {s.protocol} · {s.expectedAPY}%
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* APY + restore */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#1a6b45', fontSize: '10px', letterSpacing: '2px', marginBottom: '6px' }}>EST. APY</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '28px', fontWeight: '700', background: 'linear-gradient(135deg, #00c853, #1de9b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
                      {entry.strategy.estimatedAPY?.min ?? 0}–{entry.strategy.estimatedAPY?.max ?? 0}%
                    </p>
                    <button
                      onClick={() => restore(entry)}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '700', background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', letterSpacing: '1px', whiteSpace: 'nowrap' }}
                    >
                      RESTORE →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

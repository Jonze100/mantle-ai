'use client'
import { useAccount, useBalance } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useStrategy } from '@/context/StrategyContext'
import { useStrategyHistory } from '@/hooks/useStrategyHistory'
import { PROTOCOLS, RISK_PROTOCOLS, RiskLevel } from '@/lib/protocols'
import { ConnectKitButton } from 'connectkit'
import { formatUnits } from 'viem'
import { useState } from 'react'

const RISK_COLORS: Record<string, string> = {
  low: '#00e676',
  medium: '#ffb300',
  high: '#ff5252',
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { data: balanceData } = useBalance({ address, chainId: 5000 })
  const { input, setInput, setStrategy, setLoading, setError, loading, error } = useStrategy()
  const { history } = useStrategyHistory()
  const router = useRouter()
  const [showHistory, setShowHistory] = useState(false)

  // ✅ Permanent wagmi v2 fix
  const balanceFormatted = balanceData 
    ? parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(3) 
    : '0.000'

  const relevantProtocols = RISK_PROTOCOLS[input.risk].map((key) => ({ key, ...PROTOCOLS[key] }))

  async function generateStrategy() {
    if (!input.amount || !input.goal) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: input.amount,
          risk: input.risk,
          goal: input.goal,
          balance: balanceFormatted,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setStrategy(data)
      router.push('/strategy')
    } catch {
      setError('Failed to generate strategy. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function restoreStrategy(entry: typeof history[0]) {
    setInput(entry.input)
    setStrategy(entry.strategy)
    router.push('/strategy')
  }

  if (!isConnected) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18' }}>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>DASHBOARD</h1>
          <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>Build your yield strategy</p>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2d7a4f', fontSize: '14px', letterSpacing: '2px' }}>CONNECT WALLET TO CONTINUE</p>
          <ConnectKitButton />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>DASHBOARD</h1>
          <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>Build your yield strategy</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '600', background: showHistory ? 'linear-gradient(135deg, #0a3d1f, #0d2e18)' : 'transparent', border: '1px solid #1a6b45', borderRadius: '20px', color: '#00e676', padding: '7px 14px', cursor: 'pointer', letterSpacing: '1px' }}
            >
              HISTORY ({history.length}) {showHistory ? '▲' : '▼'}
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#030f07', border: '1px solid #1a6b45', borderRadius: '20px', padding: '8px 16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '12px', fontWeight: '600' }}>MANTLE MAINNET</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px' }}>
        {showHistory && history.length > 0 && (
          <div style={{ marginBottom: '28px', background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '20px' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px' }}>
              STRATEGY HISTORY
            </p>
            {/* ... rest of history panel remains the same ... */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
              {history.map((entry, idx) => (
                <div key={entry.id} style={{ background: '#020c06', border: '1px solid #0d2e18', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      {idx === 0 && <span style={{ background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', fontSize: '9px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', fontFamily: 'JetBrains Mono, monospace' }}>LATEST</span>}
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '11px', fontWeight: '600' }}>{entry.date}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#1a6b45', fontSize: '11px' }}>{entry.timestamp}</span>
                      <span style={{ color: RISK_COLORS[entry.input.risk] ?? '#ffb300', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}>{entry.input.risk} risk</span>
                      <span style={{ color: '#2d7a4f', fontSize: '11px' }}>${entry.input.amount} USDC</span>
                    </div>
                    <p style={{ color: '#4db87a', fontSize: '12px', lineHeight: '1.5' }}>
                      {entry.strategy.summary?.slice(0, 100)}...
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '18px', fontWeight: '700' }}>
                      {entry.strategy.estimatedAPY?.min ?? 0}–{entry.strategy.estimatedAPY?.max ?? 0}%
                    </p>
                    <button
                      onClick={() => restoreStrategy(entry)}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '700', background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', letterSpacing: '1px', whiteSpace: 'nowrap' }}
                    >
                      RESTORE →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'WALLET BALANCE', value: `${balanceDisplay} MNT` },
            { label: 'SELECTED RISK', value: input.risk.toUpperCase() },
            { label: 'PROTOCOLS AVAILABLE', value: `${relevantProtocols.length} protocols` },
          ].map((s) => (
            <div key={s.label} style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '24px' }}>
              <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '10px' }}>{s.label}</p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', fontWeight: '700', color: '#00e676' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Form + Protocol preview - same as before */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Form section remains unchanged from your previous version */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* ... your form inputs ... */}
            <button
              onClick={generateStrategy}
              disabled={!input.amount || !input.goal || loading}
              style={{ padding: '16px', borderRadius: '12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', cursor: (!input.amount || !input.goal || loading) ? 'not-allowed' : 'pointer', background: (!input.amount || !input.goal || loading) ? '#0d2e18' : 'linear-gradient(135deg, #00c853, #1de9b6)', color: (!input.amount || !input.goal || loading) ? '#1a6b45' : '#000', border: 'none' }}
            >
              {loading ? 'CONSULTING 3 AI ANALYSTS...' : 'GENERATE AI STRATEGY →'}
            </button>
            {error && <p style={{ color: '#ff5252', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>{error}</p>}
          </div>

          {/* Protocol preview - same as before */}
          <div>
            <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px' }}>
              PROTOCOLS FOR {input.risk.toUpperCase()} RISK
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {relevantProtocols.map(({ key, name, type, apy, tvl, risk }) => (
                <div key={key} style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '14px', fontWeight: '700' }}>{name}</p>
                      <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>{type}</p>
                    </div>
                    <span style={{ color: RISK_COLORS[risk], fontSize: '12px', fontWeight: '600', fontFamily: 'JetBrains Mono, monospace', background: '#020c06', border: `1px solid ${RISK_COLORS[risk]}40`, padding: '4px 10px', borderRadius: '20px' }}>
                      {risk}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '15px', fontWeight: '700' }}>{apy.min}–{apy.max}% APY</span>
                    <span style={{ color: '#2d7a4f', fontSize: '12px' }}>TVL: {tvl}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

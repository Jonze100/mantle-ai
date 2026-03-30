'use client'
import { useAccount, useBalance } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useStrategy } from '@/context/StrategyContext'
import { useStrategyHistory } from '@/hooks/useStrategyHistory'
import { PROTOCOLS, RISK_PROTOCOLS } from '@/lib/protocols'
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

  const balanceFormatted = balanceData 
    ? parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(3) 
    : '0.000'

  const relevantProtocols = RISK_PROTOCOLS[input.risk || 'medium'].map((key) => {
    const protocol = PROTOCOLS[key]
    // Fix mETH link + make all cards clickable
    let url = protocol.url || '#'
    if (key === 'meth' || protocol.name?.includes('mETH')) {
      url = 'https://meth.mantle.xyz/'
    }
    return { key, ...protocol, url }
  })

  async function generateStrategy() {
    if (!input.amount || !input.goal) {
      setError('Please enter amount and goal')
      return
    }
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0f0c' }}>
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18' }}>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700' }}>DASHBOARD</h1>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ConnectKitButton />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0a0f0c', color: '#e8f5ee' }}>
      {/* Sidebar - matches your screenshot */}
      <div style={{ width: '260px', background: '#020c06', borderRight: '1px solid #0d2e18', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{ background: '#00e676', color: '#000', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>M</div>
          <div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: '700' }}>MantleAI</span>
            <p style={{ fontSize: '10px', color: '#2d7a4f', letterSpacing: '1px' }}>YIELD STRATEGIST</p>
          </div>
        </div>

        <div style={{ marginBottom: '24px', fontSize: '13px', color: '#00e676' }}>
          • MNT/USD <span style={{ color: '#00e676' }}>$0.691</span> <span style={{ color: '#2d7a4f' }}>▲2.36%</span>
        </div>

        <nav style={{ flex: 1 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#1a3d2a', borderRadius: '8px', color: '#00e676', marginBottom: '4px', textDecoration: 'none' }}>
            <span>📊</span> Dashboard
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#e8f5ee', textDecoration: 'none' }}>
            <span>🤖</span> Strategy <span style={{ background: '#00e676', color: '#000', fontSize: '10px', padding: '2px 6px', borderRadius: '9999px' }}>AI</span>
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#e8f5ee', textDecoration: 'none' }}>Execute</a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#e8f5ee', textDecoration: 'none' }}>Protocols</a>
        </nav>

        <div style={{ marginTop: 'auto', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#2d7a4f' }}>CONNECTED</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', marginTop: '4px' }}>
            0x0844d0...4F31E6
          </div>
          <div style={{ color: '#00e676', fontSize: '15px', fontWeight: '700', marginTop: '8px' }}>{balanceFormatted} MNT</div>
          <button style={{ marginTop: '16px', width: '100%', padding: '10px', background: 'transparent', border: '1px solid #ff5252', color: '#ff5252', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
            DISCONNECT
          </button>
          <div style={{ marginTop: '24px', fontSize: '11px', color: '#2d7a4f', textAlign: 'center' }}>
            Built by @jonze100<br />
            MANTLE SQUAD BOUNTY 2026
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: '700' }}>DASHBOARD</h1>
            <p style={{ color: '#2d7a4f', fontSize: '13px' }}>Build your yield strategy</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '600', background: showHistory ? '#1a3d2a' : 'transparent', border: '1px solid #1a6b45', borderRadius: '9999px', color: '#00e676', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                HISTORY ({history.length}) {showHistory ? '▲' : '▼'}
              </button>
            )}
            <div style={{ background: '#030f07', border: '1px solid #1a6b45', borderRadius: '9999px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: '#00e676', borderRadius: '50%' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#00e676' }}>MANTLE MAINNET</span>
            </div>
          </div>
        </div>

        {/* History Panel (now working) */}
        {showHistory && history.length > 0 && (
          <div style={{ margin: '20px 32px', background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '24px' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#1a6b45', fontSize: '12px', marginBottom: '16px' }}>STRATEGY HISTORY</p>
            {history.map((entry, idx) => (
              <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#020c06', padding: '16px', borderRadius: '12px', marginBottom: '12px' }}>
                <div>
                  <span style={{ color: '#00e676' }}>{entry.date} {entry.timestamp}</span>
                  <span style={{ color: RISK_COLORS[entry.input.risk] || '#ffb300', marginLeft: '12px' }}>{entry.input.risk} risk</span>
                </div>
                <button onClick={() => restoreStrategy(entry)} style={{ background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', border: 'none', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: '700' }}>
                  RESTORE →
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ flex: 1, padding: '32px', display: 'flex', gap: '32px' }}>
          {/* Form */}
          <div style={{ flex: 1, background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '32px' }}>
            <h2 style={{ color: '#00e676', fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', marginBottom: '24px' }}>BUILD YOUR STRATEGY</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#1a6b45', display: 'block', marginBottom: '8px' }}>AMOUNT (USDC)</label>
                <input type="number" value={input.amount || ''} onChange={(e) => setInput({ ...input, amount: e.target.value })} style={{ width: '100%', padding: '16px', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '8px', color: '#e8f5ee', fontSize: '17px' }} placeholder="1000" />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#1a6b45', display: 'block', marginBottom: '8px' }}>RISK LEVEL</label>
                <select value={input.risk || 'medium'} onChange={(e) => setInput({ ...input, risk: e.target.value as any })} style={{ width: '100%', padding: '16px', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '8px', color: '#e8f5ee', fontSize: '17px' }}>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#1a6b45', display: 'block', marginBottom: '8px' }}>GOAL / TIME HORIZON</label>
                <input type="text" value={input.goal || ''} onChange={(e) => setInput({ ...input, goal: e.target.value })} style={{ width: '100%', padding: '16px', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '8px', color: '#e8f5ee', fontSize: '17px' }} placeholder="e.g. Stable growth over 6 months" />
              </div>

              <button onClick={generateStrategy} disabled={loading || !input.amount || !input.goal} style={{ padding: '18px', background: loading || !input.amount || !input.goal ? '#0d2e18' : 'linear-gradient(135deg, #00c853, #1de9b6)', color: loading || !input.amount || !input.goal ? '#4db87a' : '#000', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: loading || !input.amount || !input.goal ? 'not-allowed' : 'pointer' }}>
                {loading ? 'CONSULTING AI ANALYSTS...' : 'GENERATE AI STRATEGY →'}
              </button>
              {error && <p style={{ color: '#ff5252' }}>{error}</p>}
            </div>
          </div>

          {/* Protocols Column */}
          <div style={{ width: '420px' }}>
            <p style={{ color: '#1a6b45', fontSize: '12px', fontWeight: '600', letterSpacing: '2px', marginBottom: '16px' }}>
              PROTOCOLS FOR {(input.risk || 'MEDIUM').toUpperCase()} RISK
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {relevantProtocols.map(({ key, name, type, apy, tvl, risk, url }) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '20px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '15px', fontWeight: '700' }}>{name}</p>
                        <p style={{ color: '#2d7a4f', fontSize: '13px' }}>{type}</p>
                      </div>
                      <span style={{ color: RISK_COLORS[risk], fontSize: '12px', fontWeight: '600', background: '#020c06', border: `1px solid ${RISK_COLORS[risk]}40`, padding: '4px 12px', borderRadius: '9999px' }}>
                        {risk}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700' }}>{apy.min}–{apy.max}% APY</span>
                      <span style={{ color: '#2d7a4f' }}>TVL: {tvl}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

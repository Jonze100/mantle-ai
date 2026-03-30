'use client'
import { useAccount, useBalance } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useStrategy } from '@/context/StrategyContext'
import { useStrategyHistory } from '@/hooks/useStrategyHistory'
import { PROTOCOLS, RISK_PROTOCOLS } from '@/lib/protocols'
import { ConnectKitButton } from 'connectkit'
import { formatUnits } from 'viem'
import { useState, useEffect } from 'react'

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const balanceFormatted = balanceData 
    ? parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(3) 
    : '0.000'

  // Accurate current TVL from DefiLlama (as of your screenshot)
  const currentTVL = {
    aave: '$551M',
    merchantmoe: '$43.5M',
    meth: '$604M',
    agni: '$22M',
  }

  const relevantProtocols = RISK_PROTOCOLS[input.risk || 'medium'].map((key) => {
    const p = PROTOCOLS[key]
    let url = p.url || '#'
    if (key.toLowerCase().includes('meth')) url = 'https://meth.mantle.xyz/'
    if (key.toLowerCase().includes('merchant') || p.name?.toLowerCase().includes('moe')) url = 'https://merchantmoe.com/'
    if (key.toLowerCase().includes('agni')) url = 'https://agni.finance/'

    const tvlDisplay = currentTVL[key] || p.tvl || '—'

    return { key, ...p, url, tvl: tvlDisplay }
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0f0c' }}>
      {/* Topbar */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-2xl">☰</button>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>DASHBOARD</h1>
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

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Sidebar - collapses on mobile */}
        <div className={`fixed md:relative md:translate-x-0 top-0 left-0 h-full w-64 bg-[#020c06] border-r border-[#0d2e18] z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          {/* Your original sidebar content goes here - unchanged */}
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
              <div style={{ background: '#00e676', color: '#000', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>M</div>
              <div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: '700' }}>MantleAI</span>
                <p style={{ fontSize: '10px', color: '#2d7a4f', letterSpacing: '1px' }}>YIELD STRATEGIST</p>
              </div>
            </div>

            {/* Navigation - your original links */}
            <nav style={{ flex: 1 }}>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#1a3d2a', borderRadius: '8px', color: '#00e676', marginBottom: '4px', textDecoration: 'none' }}>
                📊 Dashboard
              </a>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#e8f5ee', textDecoration: 'none' }}>
                🤖 Strategy <span style={{ background: '#00e676', color: '#000', fontSize: '10px', padding: '2px 6px', borderRadius: '9999px' }}>AI</span>
              </a>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#e8f5ee', textDecoration: 'none' }}>Execute</a>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#e8f5ee', textDecoration: 'none' }}>Protocols</a>
            </nav>

            <div style={{ marginTop: 'auto', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '12px', padding: '16px', marginTop: '40px' }}>
              <div style={{ fontSize: '12px', color: '#2d7a4f' }}>CONNECTED</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', marginTop: '4px' }}>
                0x0844d0...4F31E6
              </div>
              <div style={{ color: '#00e676', fontSize: '15px', fontWeight: '700', marginTop: '8px' }}>{balanceFormatted} MNT</div>
              <button style={{ marginTop: '16px', width: '100%', padding: '10px', background: 'transparent', border: '1px solid #ff5252', color: '#ff5252', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                DISCONNECT
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'WALLET BALANCE', value: `${balanceFormatted} MNT` },
              { label: 'SELECTED RISK', value: (input.risk || 'MEDIUM').toUpperCase() },
              { label: 'PROTOCOLS AVAILABLE', value: `${relevantProtocols.length} protocols` },
            ].map((s) => (
              <div key={s.label} style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '24px' }}>
                <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '10px' }}>{s.label}</p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', fontWeight: '700', color: '#00e676' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Form + Protocols - original grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '28px' }}>
              <h2 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '15px', marginBottom: '20px' }}>BUILD YOUR STRATEGY</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#1a6b45', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>AMOUNT (USDC)</label>
                  <input type="number" value={input.amount || ''} onChange={(e) => setInput({ ...input, amount: e.target.value })} placeholder="1000" style={{ width: '100%', padding: '14px', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '8px', color: '#e8f5ee', fontSize: '16px' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#1a6b45', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>RISK LEVEL</label>
                  <select value={input.risk || 'medium'} onChange={(e) => setInput({ ...input, risk: e.target.value as any })} style={{ width: '100%', padding: '14px', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '8px', color: '#e8f5ee', fontSize: '16px' }}>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#1a6b45', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>GOAL / TIME HORIZON</label>
                  <input type="text" value={input.goal || ''} onChange={(e) => setInput({ ...input, goal: e.target.value })} placeholder="e.g. Stable growth over 6 months" style={{ width: '100%', padding: '14px', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '8px', color: '#e8f5ee', fontSize: '16px' }} />
                </div>

                <button
                  onClick={generateStrategy}
                  disabled={!input.amount || !input.goal || loading}
                  style={{ padding: '16px', borderRadius: '12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', cursor: (!input.amount || !input.goal || loading) ? 'not-allowed' : 'pointer', background: (!input.amount || !input.goal || loading) ? '#0d2e18' : 'linear-gradient(135deg, #00c853, #1de9b6)', color: (!input.amount || !input.goal || loading) ? '#1a6b45' : '#000', border: 'none' }}
                >
                  {loading ? 'CONSULTING 3 AI ANALYSTS...' : 'GENERATE AI STRATEGY →'}
                </button>
                {error && <p style={{ color: '#ff5252', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>{error}</p>}
              </div>
            </div>

            <div>
              <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px' }}>
                PROTOCOLS FOR {(input.risk || 'MEDIUM').toUpperCase()} RISK
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {relevantProtocols.map(({ key, name, type, apy, tvl, risk, url }) => (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '20px' }}>
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
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/70 z-40" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

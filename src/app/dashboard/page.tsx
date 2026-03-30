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

  // wagmi v2 balance fix
  const balanceFormatted = balanceData 
    ? parseFloat(formatUnits(balanceData.value, balanceData.decimals)).toFixed(3) 
    : '0.000'

  const relevantProtocols = RISK_PROTOCOLS[input.risk || 'medium'].map((key) => ({ key, ...PROTOCOLS[key] }))

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
    } catch (err) {
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0f0c', color: '#e8f5ee' }}>
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18' }}>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>DASHBOARD</h1>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2d7a4f', fontSize: '14px', letterSpacing: '2px' }}>CONNECT WALLET TO CONTINUE</p>
          <ConnectKitButton />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0f0c', color: '#e8f5ee' }}>
      {/* Topbar */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>DASHBOARD</h1>
          <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>Build your yield strategy</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {history.length > 0 && (
            <button onClick={() => setShowHistory(!showHistory)} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '600', background: showHistory ? 'linear-gradient(135deg, #0a3d1f, #0d2e18)' : 'transparent', border: '1px solid #1a6b45', borderRadius: '20px', color: '#00e676', padding: '7px 14px', cursor: 'pointer' }}>
              HISTORY ({history.length}) {showHistory ? '▲' : '▼'}
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#030f07', border: '1px solid #1a6b45', borderRadius: '20px', padding: '8px 16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '12px', fontWeight: '600' }}>MANTLE MAINNET</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px', display: 'flex', gap: '24px' }}>
        {/* Form Section */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '28px' }}>
          <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '15px', marginBottom: '20px', color: '#00e676' }}>BUILD YOUR STRATEGY</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#1a6b45', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>AMOUNT (USDC)</label>
              <input 
                type="number" 
                value={input.amount || ''} 
                onChange={(e) => setInput({ ...input, amount: e.target.value })}
                placeholder="1000"
                style={{ width: '100%', padding: '14px', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '8px', color: '#e8f5ee', fontSize: '16px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#1a6b45', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>RISK LEVEL</label>
              <select 
                value={input.risk || 'medium'} 
                onChange={(e) => setInput({ ...input, risk: e.target.value as any })}
                style={{ width: '100%', padding: '14px', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '8px', color: '#e8f5ee', fontSize: '16px' }}
              >
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#1a6b45', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>GOAL / TIME HORIZON</label>
              <input 
                type="text" 
                value={input.goal || ''} 
                onChange={(e) => setInput({ ...input, goal: e.target.value })}
                placeholder="e.g. Stable growth over 6 months"
                style={{ width: '100%', padding: '14px', background: '#020c06', border: '1px solid #1a6b45', borderRadius: '8px', color: '#e8f5ee', fontSize: '16px' }}
              />
            </div>

            <button
              onClick={generateStrategy}
              disabled={loading || !input.amount || !input.goal}
              style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                fontFamily: 'JetBrains Mono, monospace', 
                fontSize: '14px', 
                fontWeight: '700', 
                letterSpacing: '1px',
                background: (loading || !input.amount || !input.goal) ? '#0d2e18' : 'linear-gradient(135deg, #00c853, #1de9b6)', 
                color: (loading || !input.amount || !input.goal) ? '#4db87a' : '#000', 
                border: 'none',
                cursor: (loading || !input.amount || !input.goal) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'CONSULTING AI ANALYSTS...' : 'GENERATE AI STRATEGY →'}
            </button>

            {error && <p style={{ color: '#ff5252', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
          </div>
        </div>

        {/* Protocol Preview */}
        <div style={{ flex: 1 }}>
          <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '16px' }}>
            PROTOCOLS FOR {(input.risk || 'MEDIUM').toUpperCase()} RISK
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {relevantProtocols.map(({ key, name, type, apy, tvl, risk }) => (
              <div key={key} style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '14px', fontWeight: '700' }}>{name}</p>
                    <p style={{ color: '#2d7a4f', fontSize: '12px' }}>{type}</p>
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
  )
}

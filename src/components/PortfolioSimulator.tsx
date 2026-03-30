'use client'
import { useState } from 'react'

type Props = {
  amount: string
  apy: number
}

export default function PortfolioSimulator({ amount, apy }: Props) {
  const [stage, setStage] = useState<'idle' | 'running' | 'done'>('idle')
  const [progress, setProgress] = useState(0)

  const principal = parseFloat(amount) || 0
  if (principal <= 0 || apy <= 0) return null

  const rate = apy / 100
  const periods = [
    { label: '1 Month', months: 1 },
    { label: '3 Months', months: 3 },
    { label: '6 Months', months: 6 },
    { label: '1 Year', months: 12 },
  ]

  const results = periods.map(({ label, months }) => {
    const value = principal * Math.pow(1 + rate / 12, months)
    const gain = value - principal
    const gainPct = (gain / principal) * 100
    return { label, value, gain, gainPct }
  })

  const maxGain = results[results.length - 1].gain

  function runSimulation() {
    setStage('running')
    setProgress(0)
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5
      if (p >= 100) {
        clearInterval(interval)
        setProgress(100)
        setTimeout(() => setStage('done'), 200)
        return
      }
      setProgress(p)
    }, 100)
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '24px' }}>
      <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', marginBottom: '4px' }}>
        PORTFOLIO GROWTH SIMULATOR
      </p>
      <p style={{ color: '#2d7a4f', fontSize: '12px', marginBottom: '20px' }}>
        ${principal.toLocaleString()} at {apy}% APY · compounded monthly
      </p>

      {/* Growth bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        {results.map(({ label, value, gain, gainPct }) => {
          const barWidth = maxGain > 0 ? Math.max(6, (gain / maxGain) * 100) : 6
          return (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4db87a', fontSize: '13px', fontWeight: '600' }}>{label}</span>
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '14px', fontWeight: '700' }}>
                    ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{ color: '#00c853', fontSize: '11px', marginLeft: '8px' }}>+{gainPct.toFixed(1)}%</span>
                </div>
              </div>
              <div style={{ height: '5px', background: '#020c06', borderRadius: '3px', overflow: 'hidden', border: '1px solid #0d2e18' }}>
                <div style={{ height: '100%', width: `${barWidth}%`, background: 'linear-gradient(90deg, #00c853, #1de9b6)', borderRadius: '3px' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress bar shown while running */}
      {stage === 'running' && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#1a6b45', fontSize: '10px', letterSpacing: '1px' }}>SIMULATING ON-CHAIN CONDITIONS</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '10px' }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: '4px', background: '#020c06', borderRadius: '2px', border: '1px solid #0d2e18', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #00c853, #1de9b6)', transition: 'width 0.1s linear' }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #0d2e18' }}>
        <div>
          <p style={{ color: '#1a6b45', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '1px', marginBottom: '4px' }}>PROJECTED (1 YEAR)</p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '18px', fontWeight: '700' }}>
            ${results[3].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <button
          onClick={runSimulation}
          disabled={stage === 'running'}
          style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: '700',
            background: stage === 'done' ? 'linear-gradient(135deg, #00c853, #1de9b6)' : '#030f07',
            border: `1px solid ${stage === 'done' ? '#00c853' : '#1a6b45'}`,
            color: stage === 'done' ? '#000' : '#00e676',
            padding: '10px 20px', borderRadius: '10px',
            cursor: stage === 'running' ? 'not-allowed' : 'pointer',
            letterSpacing: '1px', opacity: stage === 'running' ? 0.7 : 1,
          }}
        >
          {stage === 'idle' ? 'SIMULATE' : stage === 'running' ? 'RUNNING...' : '✓ DONE'}
        </button>
      </div>

      {/* Results panel after simulation */}
      {stage === 'done' && (
        <div style={{ marginTop: '16px', background: 'linear-gradient(135deg, #0a3d1f, #030f07)', border: '1px solid #1a6b45', borderRadius: '12px', padding: '16px' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', marginBottom: '12px' }}>SIMULATION RESULTS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Principal', value: `$${principal.toLocaleString()}`, highlight: false },
              { label: 'Yield at 3 months', value: `+$${results[1].gain.toFixed(2)}`, highlight: true },
              { label: 'Yield at 6 months', value: `+$${results[2].gain.toFixed(2)}`, highlight: true },
              { label: 'Yield at 1 year', value: `+$${results[3].gain.toFixed(2)}`, highlight: true },
              { label: 'APY applied', value: `${apy}%`, highlight: true },
              { label: 'Est. gas cost (Mantle)', value: '~$0.03 total', highlight: true },
            ].map(({ label, value, highlight }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#4db87a', fontSize: '13px' }}>{label}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: highlight ? '#00e676' : '#e8f5ee', fontSize: '13px', fontWeight: '600' }}>{value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #1a6b45', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#e8f5ee', fontSize: '14px', fontWeight: '600' }}>Total value (1 yr)</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '16px', fontWeight: '700' }}>
                ${results[3].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <button
            onClick={() => { setStage('idle'); setProgress(0) }}
            style={{ marginTop: '12px', width: '100%', padding: '8px', background: 'transparent', border: '1px solid #1a6b45', borderRadius: '8px', color: '#1a6b45', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer', letterSpacing: '1px' }}
          >
            RUN AGAIN
          </button>
        </div>
      )}
    </div>
  )
}

'use client'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import { useDefiData } from '@/hooks/useDefiData'

const FEATURES = [
  { title: 'AI Strategy Builder', desc: 'Describe your goal in plain English. Claude AI maps the optimal yield route across Mantle protocols instantly.' },
  { title: 'Smart Protocol Routing', desc: 'Routes across Aave V3, Merchant Moe, AGNI Finance, mETH, INIT Capital and Bybit Vault.' },
  { title: 'Portfolio Simulator', desc: 'See projected growth at 1, 3, 6 and 12 months based on your chosen strategy APY.' },
  { title: 'Risk Management', desc: 'Choose low, medium or high risk. Every strategy flags impermanent loss, liquidation risks and more.' },
]

export default function OverviewPage() {
  const { isConnected } = useAccount()
  const { mantleTVL, aaveTVL, methTVL, agniTVL, loading, lastUpdated } = useDefiData()

  const STATS = [
    { label: 'MANTLE TVL', value: mantleTVL, sub: 'Total Value Locked' },
    { label: 'AAVE V3 TVL', value: aaveTVL, sub: 'Lending market' },
    { label: 'mETH TVL', value: methTVL, sub: 'Liquid staking' },
    { label: 'AGNI TVL', value: agniTVL, sub: 'Concentrated liquidity' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #0d2e18', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(2,12,6,0.8)' }}>
        <div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', color: '#e8f5ee', fontSize: '16px', fontWeight: '700', letterSpacing: '2px' }}>OVERVIEW</h1>
          <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '2px' }}>Mantle DeFi Yield Strategist</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastUpdated && (
            <span style={{ color: '#1a6b45', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
              LIVE · {lastUpdated}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#030f07', border: '1px solid #1a6b45', borderRadius: '20px', padding: '8px 16px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e676' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '12px', fontWeight: '600' }}>MANTLE MAINNET</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px 32px' }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #0a3d1f, #0d2e18)', border: '1px solid #1a6b45', borderRadius: '20px', padding: '6px 14px', marginBottom: '20px' }}>
            <span style={{ color: '#00e676', fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>✦ AI-Powered DeFi on Mantle</span>
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: '300', color: '#e8f5ee', lineHeight: '1.2', marginBottom: '16px' }}>
            Your personal yield strategist<br />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', background: 'linear-gradient(135deg, #00c853, #1de9b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              built for Mantle.
            </span>
          </h2>
          <p style={{ color: '#4db87a', fontSize: '16px', maxWidth: '520px', lineHeight: '1.7', marginBottom: '32px' }}>
            Tell the AI your investment amount, risk appetite and goal. Get a personalized DeFi strategy routed across Mantle&apos;s best protocols in seconds.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {isConnected ? (
              <Link href="/dashboard" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: '700', background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', letterSpacing: '1px' }}>
                BUILD STRATEGY →
              </Link>
            ) : (
              <ConnectKitButton />
            )}
            <Link href="/protocols" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#2d7a4f', textDecoration: 'underline', textUnderlineOffset: '4px', letterSpacing: '1px' }}>
              VIEW PROTOCOLS
            </Link>
          </div>
        </div>

        {/* Live stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '48px' }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: loading ? '#1a6b45' : '#00e676' }} />
                <span style={{ color: loading ? '#1a6b45' : '#00e676', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace' }}>
                  {loading ? 'LOADING' : 'LIVE'}
                </span>
              </div>
              <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '10px' }}>{s.label}</p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '28px', fontWeight: '700', background: 'linear-gradient(135deg, #00c853, #1de9b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.value}
              </p>
              <p style={{ color: '#2d7a4f', fontSize: '12px', marginTop: '6px' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div>
          <p style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '3px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '20px' }}>FEATURES</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: 'linear-gradient(135deg, #030f07, #020c06)', border: '1px solid #0d2e18', borderRadius: '16px', padding: '24px' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0a3d1f, #0d2e18)', border: '1px solid #1a6b45', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#00e676', fontSize: '16px' }}>✦</div>
                <h3 style={{ color: '#e8f5ee', fontSize: '15px', fontWeight: '600', marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: '#4db87a', fontSize: '14px', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 32px', borderTop: '1px solid #0d2e18' }}>
        <p style={{ color: '#1a6b45', fontSize: '11px', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
          POWERED BY CLAUDE AI · BUILT ON MANTLE NETWORK · DATA: DEFILLAMA {lastUpdated && `· UPDATED ${lastUpdated}`}
        </p>
      </div>
    </div>
  )
}

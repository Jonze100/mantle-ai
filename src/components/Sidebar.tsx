'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { useMNTPrice } from '@/hooks/useMNTPrice'

const NAV = [
  {
    section: 'MAIN',
    items: [
      { label: 'Overview', href: '/' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    section: 'STRATEGY',
    items: [
      { label: 'Strategy', href: '/strategy', badge: 'AI' },
      { label: 'Execute', href: '/execute' },
    ],
  },
  {
    section: 'EXPLORE',
    items: [
      { label: 'Protocols', href: '/protocols' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address, chainId: 5000 })
  const { disconnect } = useDisconnect()
  const { price, change24h } = useMNTPrice()

  const priceUp = (change24h ?? 0) >= 0
  const raw = parseFloat(balance?.formatted ?? '0')
  const balanceDisplay = isNaN(raw) ? '0.000' : raw.toFixed(3)

  return (
    <aside style={{ width: '260px', minHeight: '100vh', background: 'linear-gradient(180deg, #030f07 0%, #020c06 100%)', borderRight: '1px solid #0d2e18', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #0d2e18' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #00c853, #1de9b6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: '#000', fontFamily: 'JetBrains Mono, monospace' }}>M</div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '15px', fontWeight: '700', letterSpacing: '1px' }}>MantleAI</div>
            <div style={{ color: '#2d7a4f', fontSize: '10px', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace' }}>YIELD STRATEGIST</div>
          </div>
        </div>
      </div>

      {price && (
        <div style={{ padding: '10px 20px', borderBottom: '1px solid #0d2e18', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#020c06' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00e676' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#1a6b45', fontSize: '10px', letterSpacing: '1px' }}>MNT/USD</span>
          </div>
          <div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00e676', fontSize: '13px', fontWeight: '700' }}>${price}</span>
            {change24h !== null && (
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', marginLeft: '6px', color: priceUp ? '#00e676' : '#ff5252' }}>
                {priceUp ? '▲' : '▼'}{Math.abs(change24h)}%
              </span>
            )}
          </div>
        </div>
      )}

      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {NAV.map((group) => (
          <div key={group.section} style={{ marginBottom: '24px' }}>
            <div style={{ color: '#1a6b45', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', padding: '0 10px', marginBottom: '8px', fontFamily: 'JetBrains Mono, monospace' }}>{group.section}</div>
            {group.items.map((item) => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', textDecoration: 'none', background: active ? 'linear-gradient(135deg, #0a3d1f, #0d2e18)' : 'transparent', border: active ? '1px solid #1a6b45' : '1px solid transparent', color: active ? '#00e676' : '#4db87a' }}>
                  <span style={{ flex: 1, fontSize: '14px', fontWeight: active ? '600' : '400' }}>{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span style={{ background: 'linear-gradient(135deg, #00c853, #1de9b6)', color: '#000', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '20px', fontFamily: 'JetBrains Mono, monospace' }}>{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid #0d2e18' }}>
        {isConnected && address ? (
          <div style={{ background: '#030f07', border: '1px solid #0d2e18', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
            <div style={{ color: '#1a6b45', fontSize: '10px', letterSpacing: '2px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>CONNECTED</div>
            <div style={{ color: '#00e676', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>
              {address.slice(0, 8)}...{address.slice(-6)}
            </div>
            <div style={{ color: '#4db87a', fontSize: '18px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', marginBottom: '12px' }}>
              {balanceDisplay}
              <span style={{ color: '#1a6b45', fontSize: '12px', fontWeight: '400', marginLeft: '4px' }}>MNT</span>
            </div>
            <button
              onClick={() => disconnect()}
              style={{ width: '100%', padding: '8px 0', background: 'transparent', border: '1px solid #3d1010', borderRadius: '8px', color: '#ff5252', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '600', cursor: 'pointer', letterSpacing: '1px' }}
            >
              DISCONNECT
            </button>
          </div>
        ) : (
          <ConnectKitButton />
        )}

        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #0d2e18', textAlign: 'center' }}>
          <p style={{ color: '#2d7a4f', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
            {'Built by '}
            <a href="https://x.com/jonze100" target="_blank" rel="noopener noreferrer" style={{ color: '#00e676', textDecoration: 'none', fontWeight: '700' }}>
              @jonze100
            </a>
          </p>
          <p style={{ color: '#0d2e18', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px', letterSpacing: '1px' }}>
            MANTLE SQUAD BOUNTY 2026
          </p>
        </div>
      </div>
    </aside>
  )
}

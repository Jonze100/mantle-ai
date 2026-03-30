import { NextResponse } from 'next/server'

function fmt(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toFixed(0)}`
}

export async function GET() {
  try {
    const [mantleRes, protocolsRes] = await Promise.all([
      fetch('https://api.llama.fi/v2/chains', { next: { revalidate: 60 } }),
      fetch('https://api.llama.fi/protocols', { next: { revalidate: 60 } }),
    ])

    const chains = await mantleRes.json()
    const protocols = await protocolsRes.json()

    const mantleChain = chains.find((c: { name: string; tvl: number }) =>
      c.name?.toLowerCase() === 'mantle'
    )
    const mantleTVL = mantleChain ? fmt(mantleChain.tvl) : '$1.2B'

    function getProtocolTVL(slug: string): string {
      const p = protocols.find((x: { slug: string; tvl: number }) =>
        x.slug?.toLowerCase().includes(slug.toLowerCase())
      )
      return p ? fmt(p.tvl) : null
    }

    return NextResponse.json({
      mantleTVL,
      aaveTVL: getProtocolTVL('aave-v3') ?? getProtocolTVL('aave') ?? '$1.34B',
      methTVL: getProtocolTVL('meth') ?? '$620M',
      agniTVL: getProtocolTVL('agni') ?? '$95M',
      initTVL: getProtocolTVL('init-capital') ?? getProtocolTVL('init') ?? '$45M',
      merchantMoeTVL: getProtocolTVL('merchant-moe') ?? getProtocolTVL('merchantmoe') ?? '$180M',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  } catch {
    return NextResponse.json({
      mantleTVL: '$1.2B',
      aaveTVL: '$1.34B',
      methTVL: '$620M',
      agniTVL: '$95M',
      initTVL: '$45M',
      merchantMoeTVL: '$180M',
      lastUpdated: '--',
    })
  }
}

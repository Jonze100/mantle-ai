import { NextResponse } from 'next/server'

function formatTVL(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`
  return `$${value.toLocaleString()}`
}

export async function GET() {
  try {
    const [chainsRes, aaveRes, methRes, agniRes, initRes] = await Promise.allSettled([
      fetch('https://api.llama.fi/v2/chains', { next: { revalidate: 60 } }),
      fetch('https://api.llama.fi/protocol/aave-v3', { next: { revalidate: 60 } }),
      fetch('https://api.llama.fi/protocol/mantle-lsd', { next: { revalidate: 60 } }),
      fetch('https://api.llama.fi/protocol/agni-finance', { next: { revalidate: 60 } }),
      fetch('https://api.llama.fi/protocol/init-capital', { next: { revalidate: 60 } }),
    ])

    let mantleTVL = '$1.2B'
    let aaveTVL = '$1.34B'
    let methTVL = '$620M'
    let agniTVL = '$95M'
    let initTVL = '$45M'

    if (chainsRes.status === 'fulfilled' && chainsRes.value.ok) {
      const chains = await chainsRes.value.json()
      const mantle = chains.find((c: { name: string; tvl: number }) => c.name === 'Mantle')
      if (mantle?.tvl) mantleTVL = formatTVL(mantle.tvl)
    }

    if (aaveRes.status === 'fulfilled' && aaveRes.value.ok) {
      const aave = await aaveRes.value.json()
      const mantleChain = aave?.chainTvls?.Mantle
      if (mantleChain?.tvl?.length > 0) {
        const latest = mantleChain.tvl[mantleChain.tvl.length - 1]?.totalLiquidityUSD
        if (latest) aaveTVL = formatTVL(latest)
      }
    }

    if (methRes.status === 'fulfilled' && methRes.value.ok) {
      const meth = await methRes.value.json()
      if (meth?.tvl?.length > 0) {
        const latest = meth.tvl[meth.tvl.length - 1]?.totalLiquidityUSD
        if (latest) methTVL = formatTVL(latest)
      }
    }

    if (agniRes.status === 'fulfilled' && agniRes.value.ok) {
      const agni = await agniRes.value.json()
      if (agni?.tvl?.length > 0) {
        const latest = agni.tvl[agni.tvl.length - 1]?.totalLiquidityUSD
        if (latest) agniTVL = formatTVL(latest)
      }
    }

    if (initRes.status === 'fulfilled' && initRes.value.ok) {
      const init = await initRes.value.json()
      if (init?.tvl?.length > 0) {
        const latest = init.tvl[init.tvl.length - 1]?.totalLiquidityUSD
        if (latest) initTVL = formatTVL(latest)
      }
    }

    return NextResponse.json({
      mantleTVL,
      aaveTVL,
      methTVL,
      agniTVL,
      initTVL,
      lastUpdated: new Date().toISOString(),
    })
  } catch (err) {
    console.error('DefiLlama fetch error:', err)
    return NextResponse.json({
      mantleTVL: '$1.2B',
      aaveTVL: '$1.34B',
      methTVL: '$620M',
      agniTVL: '$95M',
      initTVL: '$45M',
      lastUpdated: new Date().toISOString(),
    })
  }
}

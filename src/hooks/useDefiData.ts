import { useState, useEffect } from 'react'

export type DefiData = {
  mantleTVL: string
  aaveTVL: string
  methTVL: string
  agniTVL: string
  initTVL: string
  merchantMoeTVL: string
  lastUpdated: string
}

export function useDefiData() {
  const [data, setData] = useState<DefiData | null>(null)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await window.fetch('/api/defi-stats')
        const json = await res.json()
        setData(json)
      } catch {}
    }
    fetch()
    const interval = setInterval(fetch, 60000)
    return () => clearInterval(interval)
  }, [])

  return data
}

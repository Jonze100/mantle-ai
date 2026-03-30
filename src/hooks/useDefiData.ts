import { useState, useEffect } from 'react'

export type DefiStats = {
  mantleTVL: string
  aaveTVL: string
  methTVL: string
  agniTVL: string
  initTVL: string
  loading: boolean
  lastUpdated: string
}

export function useDefiData(): DefiStats {
  const [stats, setStats] = useState<DefiStats>({
    mantleTVL: '...',
    aaveTVL: '...',
    methTVL: '...',
    agniTVL: '...',
    initTVL: '...',
    loading: true,
    lastUpdated: '',
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/defi-stats')
        const data = await res.json()
        setStats({
          mantleTVL: data.mantleTVL,
          aaveTVL: data.aaveTVL,
          methTVL: data.methTVL,
          agniTVL: data.agniTVL,
          initTVL: data.initTVL,
          loading: false,
          lastUpdated: new Date(data.lastUpdated).toLocaleTimeString(),
        })
      } catch {
        setStats((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  return stats
}

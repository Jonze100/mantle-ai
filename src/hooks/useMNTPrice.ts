import { useState, useEffect } from 'react'

export function useMNTPrice() {
  const [price, setPrice] = useState<string | null>(null)
  const [change24h, setChange24h] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=mantle&vs_currencies=usd&include_24hr_change=true'
        )
        const data = await res.json()
        if (data?.mantle?.usd) {
          setPrice(data.mantle.usd.toFixed(3))
          setChange24h(parseFloat(data.mantle.usd_24h_change?.toFixed(2) ?? '0'))
        }
      } catch {
        setPrice(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 60000)
    return () => clearInterval(interval)
  }, [])

  return { price, change24h, loading }
}

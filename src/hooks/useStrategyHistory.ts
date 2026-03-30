import { useState, useEffect } from 'react'
import { Strategy, StrategyInput } from '@/context/StrategyContext'

export type HistoryEntry = {
  id: string
  timestamp: string
  date: string
  input: StrategyInput
  strategy: Strategy
}

const STORAGE_KEY = 'mantle_ai_strategy_history'
const MAX_HISTORY = 10

export function useStrategyHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  function saveStrategy(input: StrategyInput, strategy: Strategy) {
    const now = new Date()
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
      input,
      strategy,
    }
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
      return updated
    })
  }

  function clearHistory() {
    setHistory([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  return { history, saveStrategy, clearHistory }
}

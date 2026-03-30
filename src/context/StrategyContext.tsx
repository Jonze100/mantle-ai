'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export type StrategyTier = {
  tier: string
  protocol: string
  allocation: string
  expectedAPY: number
  risk: string
  rationale: string
}

export type ExecutionStep = {
  step: number
  action: string
  protocol: string
  gasNote: string
}

export type Strategy = {
  summary: string
  estimatedAPY: { min: number; max: number }
  strategies: StrategyTier[]
  executionPath: ExecutionStep[]
  risks: string[]
  mantleAdvantage: string
  analystConsensus?: string
  analysts?: string[]
}

export type StrategyInput = {
  amount: string
  risk: 'low' | 'medium' | 'high'
  goal: string
}

type StrategyContextType = {
  strategy: Strategy | null
  setStrategy: (s: Strategy | null) => void
  input: StrategyInput
  setInput: (i: StrategyInput) => void
  loading: boolean
  setLoading: (l: boolean) => void
  error: string
  setError: (e: string) => void
}

const StrategyContext = createContext<StrategyContextType | null>(null)

export function StrategyProvider({ children }: { children: ReactNode }) {
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [input, setInput] = useState<StrategyInput>({
    amount: '',
    risk: 'medium',
    goal: '',
  })

  return (
    <StrategyContext.Provider value={{
      strategy, setStrategy,
      input, setInput,
      loading, setLoading,
      error, setError,
    }}>
      {children}
    </StrategyContext.Provider>
  )
}

export function useStrategy() {
  const ctx = useContext(StrategyContext)
  if (!ctx) throw new Error('useStrategy must be used within StrategyProvider')
  return ctx
}

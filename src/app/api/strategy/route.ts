import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { PROTOCOLS, RISK_PROTOCOLS, RiskLevel } from '@/lib/protocols'

export const maxDuration = 60

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { amount, risk, goal, balance } = await req.json()

  const relevantProtocols = RISK_PROTOCOLS[risk as RiskLevel]
    .map((key) => {
      const p = PROTOCOLS[key]
      return `- ${p.name} (${p.type}): APY ${p.apy.min}–${p.apy.max}%, TVL ${p.tvl}, Risk: ${p.risk}. ${p.description}`
    })
    .join('\n')

  const allProtocols = Object.entries(PROTOCOLS)
    .map(([, p]) => `- ${p.name} (${p.type}): APY ${p.apy.min}–${p.apy.max}%, TVL ${p.tvl}, Risk: ${p.risk}`)
    .join('\n')

  try {
    // Run 3 analyst perspectives in parallel
    const [conservative, aggressive, riskManager] = await Promise.all([
      client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `You are a conservative DeFi analyst. A user has $${amount} USDC, ${risk} risk tolerance, and wants: "${goal}". MNT balance: ${balance}.

Available Mantle protocols:
${allProtocols}

Give a 3-sentence recommendation: which protocol, why, and the key risk. Be specific to this user's goal and amount.`
        }],
      }),
      client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `You are an aggressive yield maximizer. A user has $${amount} USDC, ${risk} risk tolerance, and wants: "${goal}". MNT balance: ${balance}.

Available Mantle protocols:
${allProtocols}

Give a 3-sentence recommendation focused on maximizing APY for this specific user's amount and goal. Be direct.`
        }],
      }),
      client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `You are a DeFi risk manager. A user has $${amount} USDC, ${risk} risk tolerance, and wants: "${goal}". MNT balance: ${balance}.

Available Mantle protocols:
${allProtocols}

Give a 3-sentence recommendation focused on best risk-adjusted return for this specific user. Mention the biggest risk to avoid.`
        }],
      }),
    ])

    const conservativeText = (conservative.content[0] as { type: string; text: string }).text
    const aggressiveText = (aggressive.content[0] as { type: string; text: string }).text
    const riskText = (riskManager.content[0] as { type: string; text: string }).text

    // Synthesize all three into final strategy
    const synthesis = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are MantleAI. Synthesize 3 analyst views into the best DeFi strategy for this user.

USER: $${amount} USDC · ${risk} risk · Goal: "${goal}"

CONSERVATIVE ANALYST: ${conservativeText}

YIELD MAXIMIZER: ${aggressiveText}

RISK MANAGER: ${riskText}

PROTOCOLS AVAILABLE FOR ${risk.toUpperCase()} RISK:
${relevantProtocols}

Respond ONLY with this JSON object. Start with { end with }. No extra text:

{
  "summary": "2 sentences specific to this user's $${amount} goal of '${goal}'",
  "estimatedAPY": { "min": <number>, "max": <number> },
  "strategies": [
    { "tier": "Conservative", "protocol": "<protocol name>", "allocation": "<e.g. $${Math.round(Number(amount) * 0.4)} or 40%>", "expectedAPY": <number>, "risk": "low", "rationale": "<why this fits this user>" },
    { "tier": "Balanced", "protocol": "<protocol name>", "allocation": "<e.g. $${Math.round(Number(amount) * 0.4)} or 40%>", "expectedAPY": <number>, "risk": "medium", "rationale": "<why this fits this user>" },
    { "tier": "Aggressive", "protocol": "<protocol name>", "allocation": "<e.g. $${Math.round(Number(amount) * 0.2)} or 20%>", "expectedAPY": <number>, "risk": "high", "rationale": "<why this fits this user>" }
  ],
  "executionPath": [
    { "step": 1, "action": "<specific step>", "protocol": "<exact name>", "gasNote": "~$0.01 on Mantle" },
    { "step": 2, "action": "<specific step>", "protocol": "<exact name>", "gasNote": "~$0.01 on Mantle" },
    { "step": 3, "action": "<specific step>", "protocol": "<exact name>", "gasNote": "~$0.01 on Mantle" }
  ],
  "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "mantleAdvantage": "<why Mantle is ideal for this strategy>",
  "analystConsensus": "<what all 3 analysts agreed on>"
}`
      }],
    })

    const raw = (synthesis.content[0] as { type: string; text: string }).text
    const clean = raw.replace(/```json|```/g, '').trim()

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(clean)
    } catch {
      const match = clean.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('No valid JSON in response')
      parsed = JSON.parse(match[0])
    }

    const strategies = Array.isArray(parsed.strategies) ? parsed.strategies : []
    const apyValues = strategies.map((s: Record<string, unknown>) => Number(s.expectedAPY) || 5)
    const estimatedAPY = (parsed.estimatedAPY && typeof (parsed.estimatedAPY as Record<string, unknown>).min === 'number')
      ? parsed.estimatedAPY as { min: number; max: number }
      : { min: Math.min(...apyValues), max: Math.max(...apyValues) }

    return NextResponse.json({
      summary: String(parsed.summary ?? `A ${risk}-risk strategy for $${amount} USDC on Mantle.`),
      estimatedAPY,
      strategies: strategies.map((s: Record<string, unknown>) => ({
        tier: String(s.tier ?? 'Strategy'),
        protocol: String(s.protocol ?? 'Aave V3'),
        allocation: String(s.allocation ?? '100%'),
        expectedAPY: Number(s.expectedAPY ?? 5),
        risk: String(s.risk ?? risk),
        rationale: String(s.rationale ?? ''),
      })),
      executionPath: Array.isArray(parsed.executionPath)
        ? parsed.executionPath.map((s: Record<string, unknown>, i: number) => ({
            step: Number(s.step ?? i + 1),
            action: String(s.action ?? ''),
            protocol: String(s.protocol ?? ''),
            gasNote: String(s.gasNote ?? '~$0.01 on Mantle'),
          }))
        : [],
      risks: Array.isArray(parsed.risks) ? parsed.risks.map(String) : ['Smart contract risk', 'Market volatility', 'Liquidity risk'],
      mantleAdvantage: String(parsed.mantleAdvantage ?? 'Mantle offers ultra-low gas fees and deep DeFi liquidity.'),
      analystConsensus: String(parsed.analystConsensus ?? ''),
      analysts: ['Conservative Analyst', 'Yield Maximizer', 'Risk Manager'],
    })

  } catch (err) {
    console.error('Strategy API error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

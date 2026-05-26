import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            revenue_trend,
            profit_margin,
            competitor_position,
            demand_level,
            customer_satisfaction,
            complaint_frequency,
            negotiation_pressure
        } = body

        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your-groq-api-key-here') {
            return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

        const systemPrompt = `You are the Business Orchestrator Agent inside GrowthMate AI.

Your mission:
Continuously evaluate overall business performance and decide the most appropriate strategic action.

Your primary objective:
Increase revenue while maintaining sustainable profit margins and customer satisfaction.

Decision Rules:
1. If revenue is decreasing significantly: Consider activating Marketing Strategy Service.
2. If profit margin is too low: Consider activating Pricing Intelligence Service.
3. If complaints are increasing: Consider activating Customer Insights Service.
4. If negotiation pressure is high: Consider activating Negotiation Service.
5. Avoid recommending unnecessary discounts that harm long-term profit.
6. Prioritize sustainable growth over short-term sales spikes.

Return structured JSON ONLY. Do not include explanations outside JSON.`

        const userPrompt = `Business Performance Data:

Revenue Trend: ${revenue_trend}
Profit Margin: ${profit_margin}%
Competitor Price Position: ${competitor_position}
Demand Level: ${demand_level}
Customer Satisfaction: ${customer_satisfaction}
Complaint Frequency: ${complaint_frequency}
Recent Negotiation Pressure: ${negotiation_pressure}

Tasks:
1. Decide which service should be activated.
2. Explain why this service is needed.
3. Assign priority level (Low / Medium / High).
4. Suggest immediate action summary.
5. Assess overall business health (Good / Moderate / Risky).

Return strictly in this format:
{
  "activate_service": "",
  "priority_level": "",
  "reason": "",
  "immediate_action": "",
  "business_health_status": ""
}`

        console.log('🤖 Orchestrating business strategy...')

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "llama-3.1-8b-instant", // Using 8B for fast orchestration logic
            temperature: 0.2, // Low temperature for consistent decision making
            response_format: { type: "json_object" }
        })

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}')

        return NextResponse.json(result)

    } catch (error: unknown) {
        console.error('Orchestrator error:', error)
        const err = error as Record<string, unknown>
        return NextResponse.json({
            error: err?.status === 429 ? 'AI Rate Limit reached' : 'Strategic orchestration failed'
        }, { status: (err?.status as number) || 500 })
    }
}

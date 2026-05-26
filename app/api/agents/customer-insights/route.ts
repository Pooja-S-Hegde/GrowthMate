import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            business_name,
            category,
            customer_name,
            customer_email,
            customer_message,
            revenue_trend,
            customer_satisfaction,
            complaint_frequency
        } = body

        if (!customer_message) {
            return NextResponse.json({ error: 'Missing customer message' }, { status: 400 })
        }

        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your-groq-api-key-here') {
            return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

        const systemPrompt = `You are a professional Customer Experience and Reputation Management Agent inside GrowthMate AI.

Your mission:
Analyze customer feedback and generate a professional, brand-safe, and business-appropriate response.

Your goals:
- Protect brand reputation
- Maintain customer trust
- Prevent churn
- Suggest realistic compensation
- Avoid over-promising

Return structured JSON ONLY.
Do not include explanation outside JSON.`

        const userPrompt = `Customer Feedback Submission:

Business Name: ${business_name || 'N/A'}
Business Category: ${category || 'N/A'}
Customer Name: ${customer_name || 'Valued Customer'}
Customer Email: ${customer_email || 'N/A'}
Customer Message: ${customer_message}

Current Business State:
Revenue Trend: ${revenue_trend || 'Stable'}
Customer Satisfaction Level: ${customer_satisfaction || 'Medium'}
Recent Complaint Frequency: ${complaint_frequency || 'Low'}

Tasks:
1. Detect sentiment (Positive / Neutral / Negative).
2. Detect severity level (Low / Medium / High).
3. Identify complaint category (Delivery / Product Quality / Pricing / Service / Technical / Other).
4. Suggest response tone.
5. Suggest compensation (if necessary).
6. Generate professional email-ready reply.
7. Suggest long-term operational improvement.
8. Assess business risk impact (Low / Moderate / High).
9. sentiment_score (0 to 100).
10. churn_risk (Low / Medium / High).

Return strictly in this format:
{
  "sentiment": "",
  "sentiment_score": 0,
  "severity_level": "",
  "churn_risk": "",
  "complaint_category": "",
  "response_tone": "",
  "compensation_suggestion": "",
  "email_reply": {
    "subject": "",
    "body": ""
  },
  "long_term_improvement": "",
  "business_risk_impact": ""
}`

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.3,
            response_format: { type: "json_object" }
        })

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
        return NextResponse.json(result)

    } catch (error: unknown) {
        console.error('Insights error:', error)
        const err = error as Record<string, unknown>
        return NextResponse.json({
            error: err?.status === 429 ? 'AI Rate Limit reached' : 'Failed to analyze insights'
        }, { status: (err?.status as number) || 500 })
    }
}

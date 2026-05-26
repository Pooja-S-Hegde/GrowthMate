import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            business_name,
            product_name,
            category,
            revenue_trend,
            demand_level,
            customer_satisfaction,
            target_audience,
            budget_level,
            location
        } = body

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

        const SYSTEM_PROMPT = `You are an elite Creative Director and Senior Marketing Strategist at GrowthMate AI.

Your mission:
Design cohesive, high-conversion marketing campaigns for small-to-medium businesses that look like they came from a top-tier agency.

Core Directives:
1. **Realism**: Copy must be professional. No generic "Buy Now" filler. Use punchy, emotional, and result-driven language.
2. **Visual Hierarchy**: For posters, the Headline must be the most impactful element (1-3 words).
3. **Location Strategy**: Naturally integrate the business location into the call-to-action or footer text.
4. **Platform Adaptation**: WhatsApp messages should be friendly; Instagram should be visually evocative; Ad scripts should be high-energy.

Poster Design Philosophy (Freepik Inspired):
- **Headline**: Ultra-minimal. Max 2 words. Iconic. (e.g., "STYLE", "CRUNCH", "LUXURY")
- **Sub-headline**: A singular, razor-sharp value proposition. Max 10 words.
- **Offer**: Bold and extremely concise. (e.g., "50% OFF", "BUY 1 GET 1")
- **Call to Action**: Minimalist directive. (e.g., "ORDER NOW", "VISIT STORES")

Category Specifics:
- Electronics → Future, Speed, Innovation.
- Fashion/Clothes → Elegance, Season, Identity.
- Furniture → Comfort, Heritage, Space.
- Services → Trust, Results, Peace of Mind.

Return structured JSON only.
No explanation outside JSON.`

        const USER_PROMPT = `Business Details:
Business Name: ${business_name}
Product/Service: ${product_name}
Category: ${category}
Location: ${location}
Revenue Trend: ${revenue_trend}
Demand Level: ${demand_level}
Customer Satisfaction: ${customer_satisfaction}
Target Audience: ${target_audience}
Budget Level: ${budget_level}

Tasks:
1. Decide campaign strategy.
2. Suggest offer type.
3. Recommend campaign duration (days).
4. Generate WhatsApp promotional message (Include location).
5. Generate Instagram caption (Include location).
6. Generate 20-second ad script.
7. Generate poster text layout (ULTRA-MINIMALIST AGENCY QUALITY):
   - Headline: EXACTLY 1 OR 2 WORDS. Must be visually explosive.
   - Subheadline: Max 8-10 words. The "why".
   - Offer line: EXTREMELY SHORT (e.g., "FLAT 25% OFF").
   - Call to action: Shortest possible directive (e.g., "ORDER NOW").
8. Suggest 5 hashtags.
9. Provide short reasoning.
10. Generate a high-quality SDXL image prompt for a commercial background. Requirements: Photorealistic, cinematic lighting, professional studio setup, copy space (empty space) for text overlay, 8k resolution, advertisement style. Avoid text in background.

Return strictly in this format:
{
  "campaign_strategy": "",
  "offer_type": "",
  "recommended_duration_days": number,
  "whatsapp_message": "",
  "instagram_caption": "",
  "short_ad_script": "",
  "poster_content": {
    "headline": "",
    "subheadline": "",
    "offer_line": "",
    "call_to_action": ""
  },
  "hashtags": ["", "", "", "", ""],
  "reasoning": "",
  "sd_image_prompt": ""
}`

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: USER_PROMPT }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            response_format: { type: "json_object" }
        })

        const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
        return NextResponse.json(result)

    } catch (error) {
        console.error('Marketing agent error:', error)
        return NextResponse.json({ error: 'Failed to generate marketing strategy' }, { status: 500 })
    }
}

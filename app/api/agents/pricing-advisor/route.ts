import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        // Verify authentication (skip if Supabase is unreachable)
        try {
            const supabase = createClient()
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError || !user) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                )
            }
        } catch (authCheckError) {
            console.warn('Supabase auth check failed, proceeding without authentication:', authCheckError)
            // Continue without authentication if Supabase is unreachable
        }

        // Parse request body
        const body = await request.json()
        const {
            cost_price,
            current_price,
            competitor_price,
            demand_level,
            revenue_trend,
            monthly_sales_volume,
            customer_satisfaction
        } = body

        // Validate inputs
        if (!cost_price || !current_price || !competitor_price || !demand_level || !revenue_trend) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const costPrice = parseFloat(cost_price)
        const currentPrice = parseFloat(current_price)
        const competitorPrice = parseFloat(competitor_price)
        const monthlyVolume = parseInt(monthly_sales_volume) || 0

        // Try AI first if API key is configured
        if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-api-key-here') {
            console.log('🤖 Attempting AI-powered pricing analysis with Groq API (Llama 3.3)...')
            try {
                const groq = new Groq({
                    apiKey: process.env.GROQ_API_KEY
                })

                const prompt = `You are a pricing advisor. Analyze this business data and return ONLY a JSON object (no markdown, no explanation):

Cost: ₹${costPrice}
Current Price: ₹${currentPrice}
Competitor: ₹${competitorPrice}
Demand: ${demand_level}
Trend: ${revenue_trend}
Volume: ${monthlyVolume || 'N/A'}
Satisfaction: ${customer_satisfaction}

Return this exact JSON structure with NO markdown formatting:
{
  "recommended_price": <number>,
  "minimum_safe_price": <number>,
  "safe_price_range": "₹X - ₹Y",
  "expected_profit_margin": "X%",
  "competitor_analysis": "<max 50 words>",
  "risk_level": "Low|Medium|High",
  "strategic_advice": "<max 100 words>"
}`

                const completion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "You are a business pricing expert. Always respond with valid JSON only, no markdown formatting."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.7,
                    max_tokens: 2048,
                    response_format: { type: "json_object" }
                })

                const text = completion.choices[0]?.message?.content || ''

                console.log('✅ Groq API response received')
                console.log('📄 Response length:', text.length, 'characters')

                try {
                    const aiResponse = JSON.parse(text)
                    if (aiResponse.recommended_price && aiResponse.minimum_safe_price) {
                        console.log('✅ AI-powered pricing recommendation generated successfully!')
                        return NextResponse.json({
                            ...aiResponse,
                            ai_powered: true,
                            model: 'llama-3.3-70b-versatile',
                            provider: 'groq',
                            timestamp: new Date().toISOString()
                        })
                    } else {
                        console.warn('⚠️ JSON parsed but missing required fields:', Object.keys(aiResponse))
                    }
                } catch (parseError) {
                    console.error('❌ JSON parse error:', parseError instanceof Error ? parseError.message : String(parseError))
                }

                console.warn('⚠️ AI response did not contain valid pricing data, falling back to rule-based system')
            } catch (aiError) {
                console.error('❌ AI generation failed, falling back to rule-based system:', aiError)
                // Fall through to rule-based system
            }
        } else {
            console.log('⚡ Groq API key not configured, using rule-based system')
        }

        // Fallback: Advanced rule-based system
        console.log('⚡ Using rule-based pricing system (fallback)')
        const analysis = calculatePricingStrategy({
            cost_price: costPrice,
            current_price: currentPrice,
            competitor_price: competitorPrice,
            demand_level,
            revenue_trend,
            monthly_sales_volume: monthlyVolume,
            customer_satisfaction
        })


        return NextResponse.json({
            ...analysis,
            ai_powered: false,
            model: 'rule-based-advanced',
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Pricing advisor error:', error)
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

interface PricingInput {
    cost_price: number
    current_price: number
    competitor_price: number
    demand_level: 'Low' | 'Medium' | 'High'
    revenue_trend: 'Increasing' | 'Stable' | 'Decreasing'
    monthly_sales_volume: number
    customer_satisfaction: 'Low' | 'Medium' | 'High'
}

function calculatePricingStrategy(input: PricingInput) {
    const {
        cost_price,
        current_price,
        competitor_price,
        demand_level,
        revenue_trend,
        monthly_sales_volume,
        customer_satisfaction
    } = input

    // Calculate minimum safe price (cost + 10% minimum margin)
    const minimum_safe_price = Math.ceil(cost_price * 1.10)

    // Base recommended price calculation
    let recommended_price = cost_price

    // Demand-based pricing multiplier
    const demandMultiplier = {
        'Low': 1.15,      // 15% margin for low demand
        'Medium': 1.25,   // 25% margin for medium demand
        'High': 1.40      // 40% margin for high demand
    }[demand_level]

    recommended_price = cost_price * demandMultiplier

    // Adjust based on revenue trend
    if (revenue_trend === 'Decreasing') {
        recommended_price *= 0.95  // Be more competitive
    } else if (revenue_trend === 'Increasing') {
        recommended_price *= 1.05  // Can afford premium
    }

    // Competitor price consideration
    const competitor_gap = competitor_price - recommended_price

    if (competitor_gap > cost_price * 0.2) {
        // Competitor is much higher, we can increase
        recommended_price = Math.min(recommended_price * 1.1, competitor_price * 0.95)
    } else if (competitor_gap < -cost_price * 0.1) {
        // Competitor is lower, be cautious
        recommended_price = Math.max(recommended_price * 0.95, minimum_safe_price)
    }

    // Customer satisfaction adjustment
    if (customer_satisfaction === 'High') {
        recommended_price *= 1.05  // Premium pricing justified
    } else if (customer_satisfaction === 'Low') {
        recommended_price *= 0.95  // Need competitive pricing
    }

    // Round to nearest rupee
    recommended_price = Math.ceil(recommended_price)
    recommended_price = Math.max(recommended_price, minimum_safe_price)

    // Calculate safe price range
    const range_lower = Math.ceil(recommended_price * 0.95)
    const range_upper = Math.ceil(recommended_price * 1.10)
    const safe_price_range = `₹${range_lower} - ₹${range_upper}`

    // Calculate profit margin
    const profit_margin = ((recommended_price - cost_price) / recommended_price * 100).toFixed(1)

    // Competitor analysis
    let competitor_analysis = ''
    const price_diff_percent = ((recommended_price - competitor_price) / competitor_price * 100).toFixed(1)

    if (recommended_price < competitor_price) {
        competitor_analysis = `${Math.abs(parseFloat(price_diff_percent))}% lower than competitor - competitive advantage`
    } else if (recommended_price > competitor_price) {
        competitor_analysis = `${price_diff_percent}% higher than competitor - premium positioning`
    } else {
        competitor_analysis = 'Matched with competitor pricing'
    }

    // Risk assessment
    let risk_level: 'Low' | 'Medium' | 'High' = 'Medium'

    if (revenue_trend === 'Decreasing' && demand_level === 'Low') {
        risk_level = 'High'
    } else if (revenue_trend === 'Increasing' && demand_level === 'High') {
        risk_level = 'Low'
    }

    if (recommended_price < competitor_price * 0.8) {
        risk_level = 'High'
    }

    // Strategic advice
    let strategic_advice = ''

    if (demand_level === 'High' && revenue_trend === 'Increasing') {
        strategic_advice = `Strong market position detected. Your recommended price of ₹${recommended_price} capitalizes on high demand while maintaining ${profit_margin}% profit margin. Consider gradual price increases of 3-5% quarterly to test price elasticity. Focus on value-added services to justify premium positioning. Monitor competitor response closely and be prepared to adjust within 30 days.`
    } else if (demand_level === 'Low' && revenue_trend === 'Decreasing') {
        strategic_advice = `Market challenges detected. The recommended price of ₹${recommended_price} prioritizes customer retention over maximum margins. Consider implementing bundle offers or loyalty programs to increase perceived value. Analyze root causes: is low demand due to price, quality, or market saturation? Focus on operational efficiency to maintain profitability at competitive prices.`
    } else if (revenue_trend === 'Stable') {
        strategic_advice = `Stable business environment. The recommended price of ₹${recommended_price} maintains equilibrium between profitability (${profit_margin}% margin) and market competitiveness. Test small price variations (±5%) with A/B testing to optimize revenue. Focus on operational efficiency rather than aggressive pricing changes. Monitor market trends monthly and adjust strategy accordingly.`
    } else if (customer_satisfaction === 'Low') {
        strategic_advice = `Customer satisfaction concerns limit pricing power. Before implementing the recommended ₹${recommended_price}, address quality or service issues. Low satisfaction makes customers price-sensitive and reduces retention. Invest in customer experience improvements for 2-3 months, then revisit pricing strategy. Current focus should be on value delivery, not price optimization.`
    } else if (recommended_price > competitor_price * 1.15) {
        strategic_advice = `Premium pricing strategy at ₹${recommended_price}. This ${Math.abs(parseFloat(price_diff_percent))}% premium over competitors requires strong value proposition justification. Highlight unique benefits, superior quality, or better service. Consider tiered pricing options to capture different market segments. Track conversion rates closely - if they drop >15%, consider repositioning.`
    } else {
        strategic_advice = `Balanced pricing approach recommended at ₹${recommended_price}, offering ${profit_margin}% profit margin. This positions you competitively while maintaining healthy profitability. Monitor sales velocity at this price point - if volume drops >15%, consider reverting to current pricing. Track competitor moves and be ready to adjust within 30 days. Focus on consistent delivery to build customer loyalty.`
    }

    // Add volume-based insight
    if (monthly_sales_volume > 0) {
        const current_revenue = current_price * monthly_sales_volume
        const projected_revenue = recommended_price * monthly_sales_volume
        const revenue_change = ((projected_revenue - current_revenue) / current_revenue * 100).toFixed(1)

        strategic_advice += ` At your current volume of ${monthly_sales_volume} units/month, this pricing ${parseFloat(revenue_change) > 0 ? 'could increase' : 'might decrease'} monthly revenue by approximately ${Math.abs(parseFloat(revenue_change))}%. However, expect some volume sensitivity - typically a ${Math.abs(parseFloat(price_diff_percent))}% price change affects volume by 5-15% in competitive markets.`
    }

    return {
        recommended_price,
        minimum_safe_price,
        safe_price_range,
        expected_profit_margin: `${profit_margin}%`,
        competitor_analysis,
        risk_level,
        strategic_advice
    }
}

import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            product_name,
            category,
            cost_price,
            asking_price,
            min_safe_price,
            competitor_price,
            demand_level,
            quantity,
            subscription_length,
            duration
        } = body

        // Validate required fields
        if (!product_name || !category || !cost_price || !asking_price || !min_safe_price) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Try AI first if API key is configured
        if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-api-key-here') {
            console.log('🤖 Attempting AI-powered negotiation simulation with Groq API (Llama 3.3)...')
            try {
                const groq = new Groq({
                    apiKey: process.env.GROQ_API_KEY
                })

                const prompt = `You are a professional negotiation simulator. Simulate a realistic 5-round negotiation between buyer and seller.

Product: ${product_name}
Category: ${category}
Cost Price: ₹${cost_price}
Asking Price: ₹${asking_price}
Min Safe Price: ₹${min_safe_price}
Competitor Price: ₹${competitor_price}
Demand: ${demand_level}
${quantity ? `Quantity: ${quantity}` : ''}
${subscription_length ? `Subscription: ${subscription_length} months` : ''}
${duration ? `Duration: ${duration} days` : ''}

Category Strategy:
${getCategoryStrategy(category)}

Rules:
- Simulate exactly 5 rounds
- Seller NEVER goes below min_safe_price
- Price changes must be gradual and realistic
- Final agreement may succeed or fail
- Keep reasoning concise (max 30 words each)

Return ONLY this JSON structure (no markdown):
{
  "category_used": "${category}",
  "rounds": [
    {
      "round": 1,
      "buyer_offer": <number>,
      "seller_counter": <number>,
      "buyer_reason": "<max 30 words>",
      "seller_reason": "<max 30 words>"
    }
  ],
  "agreement_status": "Success|Failed",
  "final_price": <number>,
  "profit_margin_percentage": <number>,
  "risk_level": "Low|Medium|High",
  "summary": "<max 100 words>"
}`

                const completion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: "You are a professional negotiation expert. Always respond with valid JSON only, no markdown formatting."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.8,
                    max_tokens: 3072,
                    response_format: { type: "json_object" }
                })

                const text = completion.choices[0]?.message?.content || ''

                console.log('✅ Groq API response received')
                console.log('📄 Response length:', text.length, 'characters')

                try {
                    const aiResponse = JSON.parse(text)
                    if (aiResponse.rounds && aiResponse.agreement_status) {
                        console.log('✅ AI-powered negotiation simulation generated successfully!')
                        return NextResponse.json({
                            ...aiResponse,
                            ai_powered: true,
                            model: 'llama-3.3-70b-versatile',
                            provider: 'groq',
                            timestamp: new Date().toISOString()
                        })
                    }
                } catch (parseError) {
                    console.error('❌ JSON parse error:', parseError)
                }

                console.warn('⚠️ AI response invalid, falling back to rule-based system')
            } catch (aiError) {
                console.error('❌ AI generation failed:', aiError)
            }
        }

        // Fallback: Rule-based simulation
        console.log('⚡ Using rule-based negotiation simulation')
        const simulation = simulateNegotiation({
            product_name,
            category,
            cost_price: parseFloat(cost_price),
            asking_price: parseFloat(asking_price),
            min_safe_price: parseFloat(min_safe_price),
            competitor_price: parseFloat(competitor_price),
            demand_level,
            quantity: quantity ? parseInt(quantity) : undefined,
            subscription_length: subscription_length ? parseInt(subscription_length) : undefined,
            duration: duration ? parseInt(duration) : undefined
        })

        return NextResponse.json({
            ...simulation,
            ai_powered: false,
            model: 'rule-based',
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Negotiation simulation error:', error)
        return NextResponse.json(
            { error: 'Failed to simulate negotiation' },
            { status: 500 }
        )
    }
}

function getCategoryStrategy(category: string): string {
    const strategies: Record<string, string> = {
        electronics: 'Highly competitive, small margins. Buyer compares prices extensively.',
        clothes: 'Moderate margins, discounts common. Emotional buying possible.',
        furniture: 'Higher flexibility, gradual concessions expected.',
        services: 'Value-based pricing. Seller defends expertise.',
        wholesale: 'Volume-based discounts. Negotiation depends on quantity.',
        saas: 'Subscription discounts instead of price cuts. Offer longer contracts.',
        rentals: 'Price based on duration. Offer extended periods instead of discounts.'
    }
    return strategies[category] || 'Standard negotiation approach.'
}

interface SimulationData {
    category: string;
    cost_price: number;
    asking_price: number;
    min_safe_price: number;
    competitor_price: number;
    demand_level?: string;
    product_name?: string;
    quantity?: number;
    subscription_length?: number;
    duration?: number;
}

function simulateNegotiation(data: SimulationData) {
    const {
        category,
        cost_price,
        asking_price,
        min_safe_price,
        competitor_price
    } = data

    const rounds = []
    let currentBuyerOffer = competitor_price * 0.9 // Start 10% below competitor
    let currentSellerPrice = asking_price

    // Simulate 5 rounds
    for (let i = 1; i <= 5; i++) {
        const buyerOffer = Math.round(currentBuyerOffer)
        const sellerCounter = Math.round(currentSellerPrice)

        rounds.push({
            round: i,
            buyer_offer: buyerOffer,
            seller_counter: sellerCounter,
            buyer_reason: getBuyerReason(i, category, buyerOffer, competitor_price),
            seller_reason: getSellerReason(i, category, sellerCounter)
        })

        // Gradual convergence
        currentBuyerOffer += (currentSellerPrice - currentBuyerOffer) * 0.3
        currentSellerPrice -= (currentSellerPrice - currentBuyerOffer) * 0.25

        // Seller won't go below min safe price
        if (currentSellerPrice < min_safe_price) {
            currentSellerPrice = min_safe_price
        }
    }

    const lastRound = rounds[rounds.length - 1]
    const gap = Math.abs(lastRound.buyer_offer - lastRound.seller_counter)
    const agreementThreshold = asking_price * 0.05 // 5% gap acceptable

    const agreed = gap <= agreementThreshold && lastRound.seller_counter >= min_safe_price
    const finalPrice = agreed ? Math.round((lastRound.buyer_offer + lastRound.seller_counter) / 2) : 0

    const profitMargin = finalPrice > 0 ? ((finalPrice - cost_price) / finalPrice * 100) : 0
    const riskLevel = profitMargin < 15 ? 'High' : profitMargin < 25 ? 'Medium' : 'Low'

    return {
        category_used: category,
        rounds,
        agreement_status: agreed ? 'Success' : 'Failed',
        final_price: finalPrice,
        profit_margin_percentage: Math.round(profitMargin * 10) / 10,
        risk_level: riskLevel,
        summary: agreed
            ? `Deal closed at ₹${finalPrice} after ${rounds.length} rounds. ${profitMargin.toFixed(1)}% profit margin achieved. ${riskLevel} risk level.`
            : `Negotiation failed. Buyer's final offer (₹${lastRound.buyer_offer}) was below seller's minimum acceptable price (₹${min_safe_price}).`
    }
}

function getBuyerReason(round: number, category: string, offer: number, competitor: number): string {
    const reasons = [
        `Starting below competitor price of ₹${competitor} to test seller's flexibility.`,
        `Incrementally increasing offer while staying competitive in the market.`,
        `Willing to meet halfway but need better value than competitor offers.`,
        `Final push - this is close to my maximum budget for this ${category}.`,
        `Last offer - cannot go higher while maintaining profitability.`
    ]
    return reasons[round - 1] || reasons[reasons.length - 1]
}

function getSellerReason(round: number, category: string, counter: number): string {
    const reasons = [
        `Starting with asking price to establish value and quality positioning.`,
        `Small concession to show flexibility while maintaining healthy margins.`,
        `Further discount offered but staying well above minimum acceptable price.`,
        `Approaching bottom line - cannot compromise quality at lower prices.`,
        `Final offer at ₹${counter} - this is the lowest I can go profitably.`
    ]
    return reasons[round - 1] || reasons[reasons.length - 1]
}

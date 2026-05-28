import { NextRequest } from 'next/server'
import Groq from 'groq-sdk'

async function searchDuckDuckGo(query: string): Promise<string> {
    try {
        const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })
        if (!response.ok) throw new Error('Search failed')
        const html = await response.text()
        
        const snippets: string[] = []
        const regex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g
        let match
        while ((match = regex.exec(html)) !== null && snippets.length < 5) {
            const text = match[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim()
            snippets.push(text)
        }
        return snippets.join('\n')
    } catch (e) {
        console.error("Search error:", e)
        return ""
    }
}

export async function POST(request: NextRequest) {
    // Parse body BEFORE creating stream
    const body = await request.json()
    const { product_name, manual_price } = body

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        async start(controller) {
            try {
                // Validate
                if (!product_name) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Missing product name' })}\n\n`))
                    controller.close()
                    return
                }

                // Check if Groq is configured
                if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your-groq-api-key-here') {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Groq API key not configured' })}\n\n`))
                    controller.close()
                    return
                }

                const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

                let asking_price: number

                // Use manual price if provided, otherwise estimate with AI
                if (manual_price && !isNaN(parseInt(manual_price))) {
                    asking_price = parseInt(manual_price)
                    console.log(`💰 Using user-provided price: ₹${asking_price} for ${product_name}`)
                } else {
                    // Step 1: AI estimates market price with real-time web search grounding
                    console.log(`🔍 Searching live market prices for "${product_name}"...`)
                    const searchContext = await searchDuckDuckGo(`${product_name} price in India`)

                    console.log(`🤖 Estimating market price for ${product_name} using live search results...`)
                    const priceEstimateResponse = await groq.chat.completions.create({
                        messages: [{
                            role: "user",
                            content: `You are an expert pricing research agent. Your task is to estimate a realistic current market price in Indian Rupees (₹) for the product "${product_name}" using the live web search results below.

Live Search Results:
${searchContext}

Guidelines:
1. Review the search results for mentions of prices, range, or launch prices.
2. If the product is a future/unreleased model (e.g. S26), base your estimate on its current predecessor's price (e.g. S24, S25) or expected premium pricing.
3. Be realistic based on current market conditions in India.
4. Return your final estimated number wrapped in a tag like [ESTIMATED_PRICE:XXXX] where XXXX is only digits.
5. Do not include the product name, model numbers like "S26" or "15", or any explanation in your response. Only return the tag. For example: [ESTIMATED_PRICE:75000].`
                        }],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0.1,
                        max_tokens: 30
                    })

                    const priceText = priceEstimateResponse.choices[0]?.message?.content?.trim() || ""
                    const match = priceText.match(/\[ESTIMATED_PRICE:\s*(\d+)\s*\]/i)
                    asking_price = match ? parseInt(match[1]) : 50000
                    console.log(`💰 AI Estimated price: ₹${asking_price}`)
                }

                // Send agreed price to frontend
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    type: 'estimated_price',
                    price: asking_price
                })}\n\n`))

                // Auto-calculate negotiation range
                // Seller's reserve: 80% of estimated price (won't go below this)
                // Buyer's max budget: estimated price (won't go above this)
                const seller_min_price = Math.floor(asking_price * 0.8)
                const buyer_max_price = asking_price

                // Step 2: Auto-generate product description using AI
                console.log(`🤖 Generating description for ${product_name}...`)
                const descResponse = await groq.chat.completions.create({
                    messages: [{
                        role: "user",
                        content: `Generate a brief, realistic product description for "${product_name}". Include key features, condition, or specifications in 1-2 sentences. Be concise and factual.`
                    }],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.7,
                    max_tokens: 100
                })
                const product_description = descResponse.choices[0]?.message?.content || `${product_name} in good condition`

                // Step 3: Auto-generate market context
                const contextResponse = await groq.chat.completions.create({
                    messages: [{
                        role: "user",
                        content: `Generate a brief market context for "${product_name}" in 1 sentence. Mention demand, competition, or market conditions.`
                    }],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.7,
                    max_tokens: 50
                })
                const market_context = contextResponse.choices[0]?.message?.content || "Competitive market with moderate demand"

                console.log(`✅ Setup complete: ${product_description} | ${market_context}`)


                // MSAMN System prompts for buyer and seller
                const BUYER_SYSTEM_PROMPT = (max_price: number, product_info: string, market_context: string, conversation_history: string, max_rounds: number, current_round: number) => `You are Buyer Agent operating under the Meta-Strategic Adaptive Multi-Agent Negotiation (MSAMN) framework.

Your objective:
Maximize your surplus while reaching a fair and efficient agreement.

You must follow a structured reasoning protocol before generating your response.

==============================
PRIVATE INFORMATION (CONFIDENTIAL)
==============================
Your maximum willingness to pay: ₹${max_price}
DO NOT reveal this value under any circumstance.

==============================
PUBLIC CONTEXT
==============================
Product Information: ${product_info}
Market Context: ${market_context}
Conversation History: 
${conversation_history}

Maximum Negotiation Rounds: ${max_rounds}
Current Round: ${current_round}

==============================
MANDATORY META-STRATEGIC REASONING (Internal)
==============================

Before responding, internally perform the following steps:

1. Opponent Belief Modeling:
   - Estimate seller’s minimum acceptable price range.
   - Estimate seller aggression level (low / moderate / high).
   - Estimate concession speed.

2. Gap Analysis:
   - Compute price gap between offers.
   - Evaluate bargaining zone proximity.

3. Dynamic Concession Strategy:
   - If far from agreement → moderate concession.
   - If near agreement → small precision concession.
   - Avoid over-concession early.

4. Fairness Evaluation:
   - Aim for balanced surplus split.
   - Avoid extreme skew unless strategically justified.

5. Confidence-Based Agreement Rule:
   - If price gap is very small and acceptable → finalize deal.
   - Only finalize when outcome is efficient and fair.

If the price gap is within 3% of the estimated bargaining zone, strongly consider closing the deal.

DO NOT output these reasoning steps.
They are internal only.

==============================
RESPONSE FORMAT REQUIREMENTS
==============================

You MUST include exactly ONE price offer in the format:

### BUYER PRICE(₹X) ###

- X must be TOTAL transaction price.
- Do NOT use per-unit pricing.
- Keep response under 150 words.
- Be strategic, polite, and realistic.
- Never reveal your maximum budget.

==============================
DEAL FINALIZATION RULE
==============================

If you accept the agreement, include:
MAKE DEAL

Example:
"That works for me. MAKE DEAL"

Now respond as Buyer Agent.`

                const SELLER_SYSTEM_PROMPT = (min_price: number, initial_price: number, product_info: string, market_context: string, conversation_history: string, max_rounds: number, current_round: number) => `You are Seller Agent operating under the Meta-Strategic Adaptive Multi-Agent Negotiation (MSAMN) framework.

Your objective:
Maximize profit while achieving fair and efficient agreement.

==============================
PRIVATE INFORMATION (CONFIDENTIAL)
==============================
Your minimum acceptable price: ₹${min_price}
Your initial asking price: ₹${initial_price}
DO NOT reveal your minimum price.

==============================
PUBLIC CONTEXT
==============================
Product Information: ${product_info}
Market Context: ${market_context}
Conversation History: 
${conversation_history}

Maximum Negotiation Rounds: ${max_rounds}
Current Round: ${current_round}

==============================
MANDATORY META-STRATEGIC REASONING (Internal)
==============================

Before responding, internally perform:

1. Opponent Belief Modeling:
   - Estimate buyer’s maximum willingness to pay.
   - Detect urgency or hesitation.
   - Estimate concession pattern.

2. Strategic Adjustment:
   - Apply adaptive concession rate.
   - Large gap → structured reduction.
   - Small gap → precision adjustment.

3. Fairness Optimization:
   - Avoid excessive skew.
   - Seek balanced surplus.

4. Confidence Agreement Rule:
   - If near buyer's offer and acceptable → finalize.
   - Do not delay unnecessarily.

If the price gap is within 3% of the estimated bargaining zone, strongly consider closing the deal.

Do NOT output reasoning.

==============================
RESPONSE FORMAT REQUIREMENTS
==============================

You MUST include exactly ONE price offer:

### SELLER PRICE(₹X) ###

- X must be TOTAL transaction value.
- No per-unit pricing.
- Keep response under 150 words.
- Professional and strategic tone.
- Never reveal your minimum acceptable price.

==============================
DEAL FINALIZATION RULE
==============================

If accepting:
Include: MAKE DEAL

Now respond as Seller Agent.`

                // Helper to parse price from message
                const parsePrice = (text: string): number | null => {
                    const match = text.match(/###\s*(?:BUYER|SELLER)\s*PRICE\s*\(?\s*₹?(\d+)\s*\)?\s*###/i)
                    return match ? parseInt(match[1]) : null
                }

                // Helper to check if deal is made
                const isDealMade = (text: string): boolean => {
                    const normalized = text.toUpperCase()
                    return normalized.includes('MAKE DEAL') || normalized.includes('I ACCEPT') || normalized.includes('DEAL CLOSED')
                }

                // Negotiation history
                const history: Array<{ role: 'buyer' | 'seller', content: string }> = []
                let dealFixed = false
                let roundCount = 0
                const MAX_ROUNDS = 10 // Extended to 10 rounds for better negotiation

                // Helper to get AI response
                const getAIResponse = async (role: 'buyer' | 'seller', round: number): Promise<string> => {
                    const historyStr = history.map(h => `${h.role.toUpperCase()}: ${h.content}`).join('\n\n')

                    const systemPrompt = role === 'buyer'
                        ? BUYER_SYSTEM_PROMPT(buyer_max_price, product_description, market_context, historyStr || "Negotiation starting now.", MAX_ROUNDS, round)
                        : SELLER_SYSTEM_PROMPT(seller_min_price, asking_price, product_description, market_context, historyStr || "Negotiation starting now.", MAX_ROUNDS, round)

                    const completion = await groq.chat.completions.create({
                        messages: [
                            { role: "system", content: systemPrompt }
                        ],
                        model: "llama-3.3-70b-versatile",
                        temperature: 0.7,
                        max_tokens: 500
                    })

                    return completion.choices[0]?.message?.content || ''
                }

                // Start with seller's initial offer
                console.log('🤖 Starting MSAMN AI vs AI negotiation...')

                const sellerResponse = await getAIResponse('seller', 1)
                const sellerPrice = parsePrice(sellerResponse)

                history.push({ role: 'seller', content: sellerResponse })
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    type: 'message',
                    message: { role: 'seller', content: sellerResponse, price: sellerPrice }
                })}\n\n`))

                roundCount++

                // Negotiation loop
                while (!dealFixed && roundCount < MAX_ROUNDS) {
                    // Buyer's turn
                    const buyerResponse = await getAIResponse('buyer', roundCount + 1)
                    const buyerPrice = parsePrice(buyerResponse)

                    history.push({ role: 'buyer', content: buyerResponse })
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: 'message',
                        message: { role: 'buyer', content: buyerResponse, price: buyerPrice }
                    })}\n\n`))

                    // Check if buyer made deal
                    if (isDealMade(buyerResponse)) {
                        dealFixed = true
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'deal',
                            price: buyerPrice || sellerPrice,
                            rounds: roundCount + 1
                        })}\n\n`))
                        break
                    }

                    roundCount++

                    // Seller's turn
                    const sellerResponse2 = await getAIResponse('seller', roundCount + 1)
                    const sellerPrice2 = parsePrice(sellerResponse2)

                    history.push({ role: 'seller', content: sellerResponse2 })
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: 'message',
                        message: { role: 'seller', content: sellerResponse2, price: sellerPrice2 }
                    })}\n\n`))

                    // Check if seller made deal
                    if (isDealMade(sellerResponse2)) {
                        dealFixed = true
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                            type: 'deal',
                            price: sellerPrice2 || buyerPrice,
                            rounds: roundCount + 1
                        })}\n\n`))
                        break
                    }

                    roundCount++

                    // Small delay for better UX
                    await new Promise(resolve => setTimeout(resolve, 500))
                }

                // If max rounds reached without deal
                if (!dealFixed) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        type: 'no_deal',
                        rounds: roundCount
                    })}\n\n`))
                }

                console.log(`✅ Negotiation completed: ${dealFixed ? 'DEAL' : 'NO DEAL'} after ${roundCount} rounds`)
                controller.close()

            } catch (error) {
                console.error('Negotiation error:', error)
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                })}\n\n`))
                controller.close()
            }
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    })
}

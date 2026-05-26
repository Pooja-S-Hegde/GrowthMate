import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            product_name,
            category
        } = body

        // Normalize for resilient matching
        const normalizedCategory = (category || '').toLowerCase().trim();
        const normalizedProduct = (product_name || '').toLowerCase().trim();

        // Helper: check if product name mentions a specific device type
        const productIs = (...keywords: string[]) => keywords.some(k => normalizedProduct.includes(k));

        // ─── BUILD A PRODUCT-AWARE, CATEGORY-SPECIFIC SCENE ───────────────────
        let designPrompt = '';

        if (normalizedCategory.includes('electronics') || normalizedCategory.includes('tech') || normalizedCategory.includes('saas') || normalizedCategory.includes('software')) {

            if (productIs('tv', 'television', 'led tv', 'smart tv', 'oled', 'qled', 'monitor', 'display', 'screen')) {
                designPrompt = `A cinematic, ultra-premium electronics advertisement. A large, ultra-thin bezel-less flat-screen smart LED television mounted on a sleek charcoal wall in a beautifully styled modern living room. The TV screen is completely blank and dark with no content. Soft warm ambient lighting from recessed ceiling lights, a minimal modern sofa partially visible, a subtle bokeh city lights background through a floor-to-ceiling window. Cinematic depth of field, premium magazine-quality studio photography, 8K resolution. The scene must have plenty of empty space above and below the TV for text overlay.`;
            } else if (productIs('laptop', 'notebook', 'macbook', 'chromebook')) {
                designPrompt = `A premium tech lifestyle advertisement. A sleek, ultra-thin silver laptop open at an elegant angle on a clean matte white desk. Soft diffused studio lighting from above, subtle reflection on a polished glass table surface, a blurred bokeh background of a modern minimal office with large windows. The laptop screen is completely dark with no content. Premium advertising quality, cinematic lighting, 8K resolution.`;
            } else if (productIs('phone', 'smartphone', 'mobile', 'iphone', 'android', 'handset')) {
                designPrompt = `A luxury smartphone advertisement setup. Two ultra-thin premium smartphones, one face-up and one standing angled, resting on a dark reflective glass pedestal. Dramatic cinematic lighting with subtle neon purple and cyan ambient glow, sharp shadows, premium futuristic studio background. The phone screens are completely blank and dark. No text, no brands, no UI elements visible. 8K quality, magazine-grade photography.`;
            } else if (productIs('headphone', 'earphone', 'earbud', 'airpod', 'speaker', 'audio')) {
                designPrompt = `An ultra-premium audio product advertisement. A pair of sleek matte black wireless over-ear headphones floating on an invisible stand against a dark gradient background with soft purple ambient light. Clean negative space around the product, subtle product shadow below, cinematic studio photography, 8K resolution.`;
            } else if (productIs('camera', 'dslr', 'mirrorless', 'lens')) {
                designPrompt = `A premium photography equipment advertisement. A sleek professional camera body without branding on a dark textured slate surface with selective focus lighting. Cinematic studio lighting from the side, dramatic shadows, premium product photography aesthetic, 8K resolution.`;
            } else if (productIs('refrigerator', 'fridge', 'washing machine', 'appliance', 'ac', 'air conditioner')) {
                designPrompt = `A premium home appliance advertisement. A modern, matte finish large home appliance in a clean, beautifully styled contemporary kitchen or laundry room interior. Bright natural light, clean white surfaces, minimal Scandinavian aesthetic. No text, no logos, no brand marks. 8K quality, commercial advertising photography.`;
            } else {
                // Generic electronics fallback — but still cinematic
                designPrompt = `A high-end, futuristic tech advertisement studio shot. A sleek ${product_name} product concept shown as an abstract premium device form, clean matte metallic surfaces, resting on a dark reflective glass pedestal. Dramatic cinematic lighting with subtle neon cyan and deep purple ambient glow, razor-sharp shadows, ultra-modern black background with plenty of empty copy space. 8K quality, premium commercial photography.`;
            }

        } else if (normalizedCategory.includes('healthcare') || normalizedCategory.includes('health') || normalizedCategory.includes('medical') || normalizedCategory.includes('wellness')) {

            if (productIs('kit', 'supplement', 'capsule', 'tablet', 'vitamin', 'booster', 'medicine', 'syrup')) {
                designPrompt = `A luxury organic wellness advertisement. A pristine, clean unlabeled amber glass supplement bottle and small elegant capsules scattered gently on a smooth white marble surface. Surrounded by fresh botanical elements — green eucalyptus sprigs, white chamomile flowers, and soft morning sunlight streaming in from the side. Clean pastel background, plenty of empty space above. High-end wellness brand photography, serene, elegant, 8K quality.`;
            } else if (productIs('cream', 'lotion', 'serum', 'moisturizer', 'skincare', 'face wash')) {
                designPrompt = `A premium skincare product advertisement. A clean, frosted glass skincare tube or pump bottle with NO label, resting on a polished white marble surface surrounded by fresh rose petals, green leaves, and a clean water droplet spray. Soft pastel pink and white tones, luxury cosmetic brand photography, beautiful bokeh background. 8K quality, serene and elegant.`;
            } else {
                designPrompt = `A premium, luxury minimalist organic wellness scene. A clean aesthetic amber glass container with NO label, NO text, and NO logo, resting on a smooth natural stone pedestal. Surrounded by elegant botanical elements like fresh green eucalyptus leaves, subtle white flowers, and soft morning sunlight casting long, gentle shadows on a clean pastel plaster wall. High-end wellness advertising style, extremely clean, serene, and premium, 8K quality.`;
            }

        } else if (normalizedCategory.includes('clothes') || normalizedCategory.includes('fashion') || normalizedCategory.includes('apparel') || normalizedCategory.includes('beauty')) {

            designPrompt = `A premium high-fashion editorial studio setting. A beautifully textured organic linen fabric or a minimalist design hanger showcasing a clean solid-color luxury garment with NO tags, NO text, and NO patterns. Warm soft studio lighting, delicate soft-focus background, abundant clean negative space. Vogue editorial style, minimalist and high-end, 8K quality.`;

        } else if (normalizedCategory.includes('food') || normalizedCategory.includes('beverage') || normalizedCategory.includes('restaurant') || normalizedCategory.includes('drink')) {

            designPrompt = `A high-end gourmet food advertising photograph. Beautifully presented fresh gourmet food or drink elegantly arranged on a dark rustic slate surface. Vibrant fresh colors, subtle bokeh background, warm cinematic side-lighting casting gentle long shadows. Commercial culinary photography style, extremely clean and mouthwatering, 8K quality.`;

        } else if (normalizedCategory.includes('furniture') || normalizedCategory.includes('home') || normalizedCategory.includes('decor')) {

            designPrompt = `A high-end Scandinavian interior design showcase. A minimalist, beautifully crafted solid wood furniture piece or elegant ceramic decor item in a clean, sunlit modern room. Soft warm natural sunlight streaming through tall windows, casting beautiful leaf shadow patterns on a clean beige plaster wall. Extremely spacious, clean, and peaceful composition with ample negative space, 8K quality.`;

        } else {
            // Fully generic fallback — uses product name and category
            designPrompt = `An elite, professional commercial advertising photograph specifically for "${product_name}". A beautifully styled product scene, minimalist and premium, with elegant studio lighting, clean background, and beautiful contextual props that relate to ${category}. The product itself should be displayed prominently in the lower portion of the frame. Absolutely no text, no labels, no watermarks, no placeholder writing, no alphabets anywhere. 8K quality, commercial advertising grade.`;
        }

        // Append the universal no-text directive
        const finalPrompt = `${designPrompt} ABSOLUTE REQUIREMENT: The image must contain ZERO text, ZERO words, ZERO letters, ZERO numbers, ZERO logos, ZERO labels, ZERO writing of any kind anywhere. Pure photographic background only, with plenty of clean empty space for text overlay.`.replace(/\s+/g, ' ').trim();

        // MANDATORY: Use Leonardo.ai for ultra-high-end poster generation
        if (!process.env.LEONARDO_API_KEY) {
            return NextResponse.json({
                error: 'Leonardo API key missing. Please add LEONARDO_API_KEY to your .env.local.'
            }, { status: 401 })
        }

        console.log('🚀 Designing poster with Leonardo.ai...');

        try {
            // 1. Start the generation (Asynchronous)
            const genResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    prompt: finalPrompt,
                    negative_prompt: "text, words, letters, brand name, writing, label, typography, watermark, signature, banner, poster template, mockup template, placeholder text, fake text, logo, alphabet, numbers, frames, borders, messy, cluttered, text boxes",
                    modelId: 'de7d3faf-762f-48e0-b3b7-9d0ac3a3fcf3', // Leonardo Phoenix (Best for text/posters)
                    width: 832,
                    height: 1248, // Aspect Ratio 2:3 approx
                    num_images: 1,
                    alchemy: true, // Alchemy is supported and recommended
                    presetStyle: 'DYNAMIC'
                })
            });

            const genData = await genResponse.json();
            const generationId = genData.sdGenerationJob?.generationId;

            if (!generationId) {
                console.error('Leonardo Gen Error:', genData);
                throw new Error(genData.message || 'Leonardo failed to start generation job');
            }

            console.log(`📡 Generation started: ${generationId}. Polling for result...`);

            // 2. Poll for the result
            let imageUrl = '';
            let attempts = 0;
            const maxAttempts = 20;

            while (attempts < maxAttempts) {
                attempts++;
                // Wait 2-3 seconds between polls
                await new Promise(resolve => setTimeout(resolve, 2500));

                const statusResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
                        'Accept': 'application/json'
                    }
                });

                const statusData = await statusResponse.json();
                const generation = statusData.generations_by_pk;

                if (generation?.status === 'COMPLETE') {
                    imageUrl = generation.generated_images?.[0]?.url;
                    break;
                } else if (generation?.status === 'FAILED') {
                    throw new Error('Leonardo image generation failed');
                }

                console.log(`...waiting for Leonardo AI (Attempt ${attempts})...`);
            }

            if (imageUrl) {
                console.log('✅ Leonardo generation successful');
                return NextResponse.json({ url: imageUrl, provider: 'leonardo' });
            } else {
                throw new Error('Leonardo timed out waiting for image');
            }

        } catch (err: unknown) {
            const e = err as Error;
            console.error("Leonardo Execution Error:", e.message);
            return NextResponse.json({ error: `Leonardo Error: ${e.message}` }, { status: 500 });
        }

    } catch (error: unknown) {
        const e = error as Error;
        console.error('System error in poster designer:', e.message);
        return NextResponse.json({ error: 'Failed to connect to Leonardo Designer' }, { status: 500 });
    }
}

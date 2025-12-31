import { NextResponse } from 'next/server';

export async function POST(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await req.json();
        const { html, token } = body;

        if (!html || !token) {
            return NextResponse.json({ error: 'Missing html or token' }, { status: 400 });
        }

        const puppeteerUrl = process.env.PUPPETEER_API_URL;
        // Note: User specified no API Key needed for this internal service.

        if (!puppeteerUrl) {
            return NextResponse.json({ error: 'Puppeteer service not configured' }, { status: 503 });
        }

        // Call user's custom Image Generation Endpoint
        const response = await fetch(puppeteerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html,
                // settings for A4 quality
                width: 794, // approx 210mm at 96dpi HQ
                height: 1123, // approx 297mm at 96dpi HQ
                deviceScaleFactor: 3, // High quality requested by user
                type: 'png',
                waitFor: 100 // small buffer for render
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Puppeteer service error: ${response.status} - ${errText}`);
        }

        // Expecting JSON with base64 or raw image. 
        const data = await response.json();
        let base64String = data.image || data.base64 || data.content || (typeof data === 'string' ? data : null);

        if (!base64String && data.data) {
            base64String = data.data;
        }

        if (!base64String) {
            console.warn('Unknown response format from Puppeteer:', data);
            throw new Error('Formato de resposta do Puppeteer desconhecido');
        }

        // Strip prefix if present (e.g. "data:image/png;base64,")
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // Return PNG
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="curriculo-${params.id}.png"`
            }
        });

    } catch (err: any) {
        console.error('Error in export:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

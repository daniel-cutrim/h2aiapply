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
        // Note: Use /pdf-from-html endpoint logic

        if (!puppeteerUrl) {
            return NextResponse.json({ error: 'Puppeteer service not configured' }, { status: 503 });
        }

        // Replace the endpoint path if the env var is base URL, otherwise assume user provided full URL
        // For safety, let's append /pdf-from-html if the user provided just the base, 
        // OR if the user provided the full URL to the previous image endpoint, we might need to adjust.
        // However, usually PUPPETEER_API_URL is the full endpoint. 
        // Let's assume the user will update the ENV or we construct it.
        // User snippet show: app.post('/pdf-from-html', ...). 
        // I'll assume PUPPETEER_API_URL in .env should be updated or I should try to detect.
        // Best practice: Use the URL as is from ENV, but if it ends in /image-from-html, switch it.

        let targetUrl = puppeteerUrl;
        if (targetUrl.includes('/image-from-html')) {
            targetUrl = targetUrl.replace('/image-from-html', '/pdf-from-html');
        } else if (!targetUrl.endsWith('/pdf-from-html')) {
            // If it looks like a base URL (no specific route), append
            targetUrl = targetUrl.replace(/\/$/, '') + '/pdf-from-html';
        }

        // Call user's PDF Generation Endpoint
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html,
                format: 'A4',
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                },
                waitFor: 100
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Puppeteer service error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        const base64Pdf = data.pdf || data.file || (typeof data === 'string' ? data : null);

        if (!base64Pdf) {
            throw new Error('PDF output not found in response');
        }

        const buffer = Buffer.from(base64Pdf, 'base64');

        // Return PDF
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="curriculo-${params.id}.pdf"`
            }
        });

    } catch (err: any) {
        console.error('Error in export:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

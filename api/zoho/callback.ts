import type { VercelRequest, VercelResponse } from '@vercel/node';

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_DC = process.env.ZOHO_DC || 'com';
// This should match the redirect URI registered in Zoho console
// e.g., https://practiceactivation.vercel.app/zoho/oauth/callback
const REDIRECT_URI = process.env.ZOHO_REDIRECT_URI || '';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
    }

    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
        return res.status(500).json({ error: "Server not configured with Zoho Client ID/Secret" });
    }

    try {
        const tokenUrl = `https://accounts.zoho.${ZOHO_DC}/oauth/v2/token`;

        const params = new URLSearchParams();
        params.append('code', code as string);
        params.append('client_id', ZOHO_CLIENT_ID);
        params.append('client_secret', ZOHO_CLIENT_SECRET);
        params.append('redirect_uri', REDIRECT_URI);
        params.append('grant_type', 'authorization_code');

        const response = await fetch(tokenUrl, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({
                success: false,
                message: "Failed to exchange code for token",
                error: data.error,
                details: "Ensure the code is fresh and REDIRECT_URI matches exactly."
            });
        }

        // Success! 
        return res.status(200).json({
            success: true,
            message: "Zoho OAuth successful!",
            refresh_token: data.refresh_token,
            access_token: data.access_token,
            api_domain: data.api_domain,
            instructions: "COPIA EL REFRESH_TOKEN Y GUÁRDALO EN TU VARIABLE DE ENTORNO ZOHO_REFRESH_TOKEN EN VERCEL."
        });

    } catch (error) {
        console.error('Zoho Callback Error:', error);
        return res.status(500).json({
            error: "Internal server error during token exchange",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

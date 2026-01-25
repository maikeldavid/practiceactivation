import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    return res.status(200).json({
        status: 'ok',
        message: 'API is working',
        nodeVersion: process.version,
        envCheck: {
            hasClientId: !!process.env.ZOHO_CLIENT_ID,
            hasClientSecret: !!process.env.ZOHO_CLIENT_SECRET
        }
    });
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const code = req.query.code;

    return res.status(200).json({
        ok: true,
        message: "Zoho callback received",
        code,
    });
}

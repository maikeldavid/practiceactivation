import type { VercelRequest, VercelResponse } from '@vercel/node';

const PANDADOC_API_URL = 'https://api.pandadoc.com/public/v1';
const PANDADOC_API_KEY = process.env.PANDADOC_API_KEY;

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { documentId } = req.query;

    if (!documentId || typeof documentId !== 'string') {
        return res.status(400).json({ error: 'Missing documentId parameter' });
    }

    if (!PANDADOC_API_KEY) {
        return res.status(500).json({ error: 'PandaDoc API key not configured' });
    }

    try {
        const response = await fetch(`${PANDADOC_API_URL}/documents/${documentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `API-Key ${PANDADOC_API_KEY}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(500).json({
                error: 'Failed to get document status',
                details: errorData
            });
        }

        const documentData = await response.json();

        // Map PandaDoc status to our status
        let status: 'pending' | 'sent' | 'signed' = 'pending';
        if (documentData.status === 'document.completed') {
            status = 'signed';
        } else if (documentData.status === 'document.sent' || documentData.status === 'document.viewed') {
            status = 'sent';
        }

        return res.status(200).json({
            success: true,
            status: status,
            pandadocStatus: documentData.status,
        });

    } catch (error) {
        console.error('PandaDoc API error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

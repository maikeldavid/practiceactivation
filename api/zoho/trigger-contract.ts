import type { VercelRequest, VercelResponse } from '@vercel/node';

// This endpoint could be called by a Zoho CRM button or workflow
// to trigger the contract creation and sending via PandaDoc
export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, userName, documentType, practiceName } = req.body;

    if (!email || !documentType) {
        return res.status(400).json({ error: 'Email and documentType are required' });
    }

    try {
        // We can reuse the internal logic of create-document
        // For now, we'll redirect to the local create-document logic
        // but in a real app, this might be a direct call to the service

        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;

        const response = await fetch(`${protocol}://${host}/api/pandadoc/create-document`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                documentType,
                userEmail: email,
                userName: userName || 'Provider',
                practiceName: practiceName || 'Itera Health Provider'
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json({
            success: true,
            message: `${documentType} successfully triggered from Zoho for ${email}`,
            documentId: data.documentId
        });

    } catch (error) {
        console.error('Trigger Contract Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

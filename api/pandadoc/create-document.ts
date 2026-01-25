import type { VercelRequest, VercelResponse } from '@vercel/node';

const PANDADOC_API_URL = 'https://api.pandadoc.com/public/v1';
const PANDADOC_API_KEY = process.env.PANDADOC_API_KEY;
const BAA_TEMPLATE_ID = process.env.PANDADOC_BAA_TEMPLATE_ID;
const CONTRACT_TEMPLATE_ID = process.env.PANDADOC_CONTRACT_TEMPLATE_ID;

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { documentType, userEmail, userName, practiceName } = req.body;

    if (!documentType || !userEmail || !userName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!PANDADOC_API_KEY || !BAA_TEMPLATE_ID || !CONTRACT_TEMPLATE_ID) {
        return res.status(500).json({
            error: 'PandaDoc API credentials not configured',
            message: 'Please add PANDADOC_API_KEY, PANDADOC_BAA_TEMPLATE_ID, and PANDADOC_CONTRACT_TEMPLATE_ID to environment variables'
        });
    }

    const templateId = documentType === 'BAA' ? BAA_TEMPLATE_ID : CONTRACT_TEMPLATE_ID;
    const [firstName, ...lastNameParts] = userName.split(' ');
    const lastName = lastNameParts.join(' ') || firstName;

    try {
        // Step 1: Create document from template
        const createDocumentResponse = await fetch(`${PANDADOC_API_URL}/documents`, {
            method: 'POST',
            headers: {
                'Authorization': `API-Key ${PANDADOC_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `${documentType} - ${practiceName}`,
                template_uuid: templateId,
                recipients: [
                    {
                        email: userEmail,
                        first_name: firstName,
                        last_name: lastName,
                        role: 'Signer',
                    },
                ],
                tokens: [
                    {
                        name: 'Practice.Name',
                        value: practiceName,
                    },
                    {
                        name: 'Signer.Name',
                        value: userName,
                    },
                    {
                        name: 'Signer.Email',
                        value: userEmail,
                    },
                ],
            }),
        });

        if (!createDocumentResponse.ok) {
            const errorData = await createDocumentResponse.json();
            console.error('PandaDoc create document error:', errorData);
            return res.status(500).json({
                error: 'Failed to create document',
                details: errorData
            });
        }

        const documentData = await createDocumentResponse.json();
        const documentId = documentData.id;

        // Step 2: Send the document
        const sendResponse = await fetch(`${PANDADOC_API_URL}/documents/${documentId}/send`, {
            method: 'POST',
            headers: {
                'Authorization': `API-Key ${PANDADOC_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Please sign the ${documentType} to complete your onboarding with ITERA Health.`,
                silent: false,
            }),
        });

        if (!sendResponse.ok) {
            const errorData = await sendResponse.json();
            console.error('PandaDoc send document error:', errorData);
            return res.status(500).json({
                error: 'Failed to send document',
                details: errorData
            });
        }

        // Step 3: Create embedded session
        const sessionResponse = await fetch(`${PANDADOC_API_URL}/documents/${documentId}/session`, {
            method: 'POST',
            headers: {
                'Authorization': `API-Key ${PANDADOC_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipient: userEmail,
                lifetime: 900, // 15 minutes
            }),
        });

        if (!sessionResponse.ok) {
            const errorData = await sessionResponse.json();
            console.error('PandaDoc create session error:', errorData);
            return res.status(500).json({
                error: 'Failed to create signing session',
                details: errorData
            });
        }

        const sessionData = await sessionResponse.json();

        return res.status(200).json({
            success: true,
            documentId: documentId,
            sessionUrl: sessionData.id,
        });

    } catch (error) {
        console.error('PandaDoc API error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { upsertZohoHierarchy } from './lib/zoho-crm';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        practiceName,
        providerName,
        providerEmail,
        phone,
        address,
        npi,
        status,
        contractStatus,
        internalId
    } = req.body;

    if (!practiceName || !providerEmail) {
        return res.status(400).json({ error: 'Missing required sync data' });
    }

    try {
        const result = await upsertZohoHierarchy({
            practiceName,
            internalPracticeId: internalId || providerEmail, // Fallback if no ID
            providerName,
            providerEmail,
            providerPhone: phone,
            providerAddress: address,
            providerNpi: npi,
            onboardingStatus: status || 'Initiated',
            contractStatus: contractStatus || 'Pending'
        });

        return res.status(200).json({
            success: true,
            message: 'Full sync complete',
            details: result
        });

    } catch (error) {
        console.error('Zoho Full Sync Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Zoho Sync Failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            debug: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

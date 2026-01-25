import type { VercelRequest, VercelResponse } from '@vercel/node';

// This endpoint receives notifications from Zoho CRM (Webhooks)
export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;

        // Log the data for debugging
        console.log('--- ZOHO WEBHOOK RECEIVED ---');
        console.log('Source Module:', data.module);
        console.log('Record details:', data.record);
        console.log('Changes:', data.changes);
        console.log('-----------------------------');

        // MÁQUINA DE ESTADOS / LÓGICA DE NEGOCIO
        // Ejemplo: Si el Deal cambió a 'Contract Complete' en Zoho, 
        // podrías actualizar tu DB interna aquí.

        /*
        if (data.module === 'Deals' && data.record.Stage === 'Contract Complete') {
            const internalId = data.record.Internal_ID;
            // updateInternalOnboardingStatus(internalId, 'Ready for Outreach');
        }
        */

        return res.status(200).json({
            success: true,
            message: 'Zoho notification received and logged'
        });

    } catch (error) {
        console.error('Zoho Webhook Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Error processing Zoho notification'
        });
    }
}

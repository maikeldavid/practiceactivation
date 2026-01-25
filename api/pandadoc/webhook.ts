import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const event = req.body;

        // Log webhook event for debugging
        console.log('PandaDoc webhook received:', JSON.stringify(event, null, 2));

        // Handle document completion event
        if (event.event === 'document_completed') {
            const documentId = event.data.id;
            const status = event.data.status;

            console.log(`Document ${documentId} completed with status: ${status}`);

            // In a real implementation, you would:
            // 1. Store this in your database
            // 2. Trigger notifications
            // 3. Update user's onboarding status

            return res.status(200).json({
                success: true,
                message: 'Webhook processed successfully'
            });
        }

        // Acknowledge other events
        return res.status(200).json({
            success: true,
            message: 'Event acknowledged'
        });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

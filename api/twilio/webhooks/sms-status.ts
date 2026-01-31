import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { TwilioWebhookPayload } from '../../../types';

/**
 * Webhook endpoint to receive SMS status updates from Twilio
 * Twilio calls this endpoint when SMS status changes: queued -> sent -> delivered/failed
 * 
 * Configure in Twilio Console or when sending SMS via statusCallback parameter
 */
export default async function handler(
    req: VercelRequest,
    res: VercelResponse
): Promise<VercelResponse> {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload: TwilioWebhookPayload = req.body;

        const messageSid = payload.MessageSid || payload.SmsSid;
        const status = payload.SmsStatus;
        const to = payload.To;
        const from = payload.From;
        const errorCode = payload.ErrorCode;

        console.log(`SMS Status Update: ${messageSid} - ${status}`, {
            to,
            from,
            errorCode,
        });

        // TODO: Update database with status
        // Example:
        // await db.smsMessages.update({
        //   where: { twilioMessageSid: messageSid },
        //   data: {
        //     status: status,
        //     dateUpdated: new Date().toISOString(),
        //     errorCode: errorCode,
        //   }
        // });

        // If SMS failed, you might want to trigger retry logic or alert
        if (status === 'failed' || status === 'undelivered') {
            console.error(`SMS Failed: ${messageSid}`, { errorCode, to });
            // TODO: Implement retry or notification logic
        }

        // If delivered, update patient contact status
        if (status === 'delivered') {
            // TODO: Update patient outreach status
            // await updatePatientContactStatus(patientId, 'SMS Delivered');
        }

        // Respond with 200 to acknowledge receipt
        return res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('SMS Status Webhook Error:', error);
        // Still return 200 to prevent Twilio from retrying
        return res.status(200).json({ received: false, error: error.message });
    }
}

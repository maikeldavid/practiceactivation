import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { TwilioWebhookPayload } from '../../../types';

/**
 * Webhook endpoint to receive call status updates from Twilio
 * Tracks call lifecycle: initiated -> ringing -> in-progress -> completed
 * 
 * Configure via statusCallback when making calls
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

        const callSid = payload.CallSid;
        const status = payload.CallStatus;
        const duration = payload.CallDuration;
        const to = payload.To;
        const from = payload.From;
        const answeredBy = payload.AnsweredBy;

        console.log(`Call Status Update: ${callSid} - ${status}`, {
            to,
            from,
            duration,
            answeredBy,
        });

        // TODO: Update database with call status
        // await db.callRecords.update({
        //   where: { twilioCallSid: callSid },
        //   data: {
        //     status: status,
        //     duration: duration ? parseInt(duration) : undefined,
        //     answeredBy: answeredBy,
        //     dateUpdated: new Date().toISOString(),
        //   }
        // });

        // Handle completed calls
        if (status === 'completed') {
            const durationInSeconds = duration ? parseInt(duration) : 0;

            // If call was very short, might be voicemail or declined
            if (durationInSeconds < 5) {
                console.log(`Short call detected: ${callSid} (${durationInSeconds}s)`);
                // TODO: Mark for follow-up
            }

            // If machine detected, handle differently
            if (answeredBy === 'machine') {
                console.log(`Voicemail detected: ${callSid}`);
                // TODO: Update patient status to indicate voicemail left
            }
        }

        // Handle failed calls
        if (status === 'failed' || status === 'busy' || status === 'no-answer') {
            console.warn(`Call not successful: ${callSid} - ${status}`);
            // TODO: Implement retry logic or escalation
        }

        return res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('Call Status Webhook Error:', error);
        return res.status(200).json({ received: false, error: error.message });
    }
}

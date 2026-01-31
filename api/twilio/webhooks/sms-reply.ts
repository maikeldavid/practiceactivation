import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { TwilioWebhookPayload } from '../../../types';

/**
 * Webhook endpoint to receive incoming SMS replies from patients
 * Processes keywords like YES, NO, STOP, HELP for automated workflows
 * 
 * Configure in Twilio Console for your phone number's "Messaging" webhook
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

        const messageSid = payload.MessageSid;
        const from = payload.From; // Patient's phone number
        const to = payload.To; // Your Twilio number
        const body = payload.Body?.trim().toUpperCase() || '';

        console.log(`Incoming SMS Reply: ${from} - "${body}"`);

        // TODO: Look up patient by phone number
        // const patient = await findPatientByPhone(from);

        // Process common keywords
        let autoResponse = '';
        let updateStatus = '';

        switch (body) {
            case 'YES':
            case 'Y':
            case 'CONFIRM':
                autoResponse = 'Thank you for confirming! A Care Manager will contact you shortly.';
                updateStatus = 'Consent Sent';
                // TODO: Update patient status and create appointment
                break;

            case 'NO':
            case 'N':
            case 'DECLINE':
                autoResponse = 'We understand. If you change your mind, please contact us at [PHONE].';
                updateStatus = 'Not Approved';
                // TODO: Update patient status
                break;

            case 'STOP':
            case 'UNSUBSCRIBE':
            case 'CANCEL':
                autoResponse = 'You have been unsubscribed. Reply START to opt back in.';
                updateStatus = 'Opted Out';
                // TODO: Mark patient as opted out
                break;

            case 'START':
            case 'SUBSCRIBE':
                autoResponse = 'Welcome back! You will receive updates from our care team.';
                // TODO: Opt patient back in
                break;

            case 'HELP':
            case 'INFO':
                autoResponse = 'For assistance, call us at [PHONE] or visit [WEBSITE]. Reply STOP to unsubscribe.';
                break;

            default:
                // Generic reply - store for care manager review
                autoResponse = 'Thank you for your message. A Care Manager will respond soon.';
                // TODO: Create task for care manager to review and respond
                break;
        }

        // TODO: Store incoming message in database
        // await db.smsMessages.create({
        //   data: {
        //     twilioMessageSid: messageSid,
        //     from: from,
        //     to: to,
        //     body: payload.Body,
        //     direction: 'inbound',
        //     status: 'received',
        //     dateSent: new Date().toISOString(),
        //     patientId: patient?.id,
        //   }
        // });

        // Respond with TwiML if auto-response needed
        if (autoResponse) {
            const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${autoResponse}</Message>
</Response>`;

            res.setHeader('Content-Type', 'text/xml');
            return res.status(200).send(twiml);
        }

        // Otherwise, just acknowledge
        return res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('SMS Reply Webhook Error:', error);
        return res.status(200).json({ received: false, error: error.message });
    }
}

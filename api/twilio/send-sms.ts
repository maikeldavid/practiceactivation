import type { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

interface SendSMSRequest {
    to: string | string[]; // Single number or array for bulk
    body: string;
    patientId?: string;
    campaignId?: string;
    statusCallback?: string;
}

interface SendSMSResponse {
    success: boolean;
    messages?: Array<{
        sid: string;
        to: string;
        status: string;
    }>;
    error?: string;
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
): Promise<VercelResponse> {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validate Twilio credentials
    if (!accountSid || !authToken || !twilioPhoneNumber) {
        return res.status(500).json({
            success: false,
            error: 'Twilio credentials not configured. Please check environment variables.',
        });
    }

    try {
        const { to, body, patientId, campaignId, statusCallback }: SendSMSRequest = req.body;

        // Validate input
        if (!to || !body) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, body',
            });
        }

        // Initialize Twilio client
        const client = twilio(accountSid, authToken);

        // Handle bulk or single send
        const recipients = Array.isArray(to) ? to : [to];
        const messages: Array<{ sid: string; to: string; status: string }> = [];

        // Send SMS to each recipient
        for (const phoneNumber of recipients) {
            try {
                const message = await client.messages.create({
                    body: body,
                    from: twilioPhoneNumber,
                    to: phoneNumber,
                    statusCallback: statusCallback || `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/twilio/webhooks/sms-status`,
                });

                messages.push({
                    sid: message.sid,
                    to: phoneNumber,
                    status: message.status,
                });

                // Optional: Store in database with patientId/campaignId
                // await storeSMSLog({ messageSid: message.sid, patientId, campaignId, to: phoneNumber, body });

            } catch (twilioError: any) {
                console.error(`Error sending SMS to ${phoneNumber}:`, twilioError);
                messages.push({
                    sid: '',
                    to: phoneNumber,
                    status: 'failed',
                });
            }

            // Rate limiting: wait 100ms between messages to avoid Twilio throttling
            if (recipients.length > 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return res.status(200).json({
            success: true,
            messages,
        } as SendSMSResponse);

    } catch (error: any) {
        console.error('Send SMS Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to send SMS',
        } as SendSMSResponse);
    }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

interface MakeCallRequest {
    to: string | string[]; // Phone number(s) to call
    twimlUrl?: string; // URL to TwiML instructions
    twimlScript?: string; // Or direct TwiML script
    patientId?: string;
    campaignId?: string;
    recordCall?: boolean;
    machineDetection?: 'Enable' | 'DetectMessageEnd';
}

interface MakeCallResponse {
    success: boolean;
    calls?: Array<{
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
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!accountSid || !authToken || !twilioPhoneNumber) {
        return res.status(500).json({
            success: false,
            error: 'Twilio credentials not configured',
        });
    }

    try {
        const {
            to,
            twimlUrl,
            twimlScript,
            patientId,
            campaignId,
            recordCall = false,
            machineDetection,
        }: MakeCallRequest = req.body;

        if (!to) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: to',
            });
        }

        if (!twimlUrl && !twimlScript) {
            return res.status(400).json({
                success: false,
                error: 'Either twimlUrl or twimlScript must be provided',
            });
        }

        const client = twilio(accountSid, authToken);
        const recipients = Array.isArray(to) ? to : [to];
        const calls: Array<{ sid: string; to: string; status: string }> = [];

        for (const phoneNumber of recipients) {
            try {
                // If twimlScript is provided, create a temporary TwiML response
                let url = twimlUrl;
                if (twimlScript && !twimlUrl) {
                    // In production, you'd want to create a TwiML bin or endpoint
                    // For now, we'll use the twimlUrl parameter
                    url = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/twilio/twiml/${campaignId || 'default'}`;
                }

                const call = await client.calls.create({
                    from: twilioPhoneNumber!,
                    to: phoneNumber,
                    url: url!,
                    statusCallback: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/twilio/webhooks/call-status`,
                    statusCallbackMethod: 'POST',
                    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
                    record: recordCall,
                    recordingStatusCallback: recordCall
                        ? `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/twilio/webhooks/recording-status`
                        : undefined,
                    machineDetection: machineDetection,
                });

                calls.push({
                    sid: call.sid,
                    to: phoneNumber,
                    status: call.status,
                });

                // Optional: Store in database
                // await storeCallLog({ callSid: call.sid, patientId, campaignId, to: phoneNumber });

            } catch (twilioError: any) {
                console.error(`Error calling ${phoneNumber}:`, twilioError);
                calls.push({
                    sid: '',
                    to: phoneNumber,
                    status: 'failed',
                });
            }

            // Rate limiting between calls
            if (recipients.length > 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        return res.status(200).json({
            success: true,
            calls,
        } as MakeCallResponse);

    } catch (error: any) {
        console.error('Make Call Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to make call',
        } as MakeCallResponse);
    }
}

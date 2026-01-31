/**
 * Twilio Service
 * Frontend service layer for interacting with Twilio API endpoints
 */

import type { SMSMessage, CallRecord, Campaign } from '../types';

interface SendSMSParams {
    to: string | string[];
    body: string;
    patientId?: string;
    campaignId?: string;
}

interface MakeCallParams {
    to: string | string[];
    twimlUrl?: string;
    twimlScript?: string;
    patientId?: string;
    campaignId?: string;
    recordCall?: boolean;
}

interface TwilioServiceResponse {
    success: boolean;
    data?: any;
    error?: string;
}

class TwilioService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = '/api/twilio';
    }

    /**
     * Send SMS to one or more recipients
     */
    async sendSMS(params: SendSMSParams): Promise<TwilioServiceResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/send-sms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error('TwilioService.sendSMS error:', error);
            return {
                success: false,
                error: error.message || 'Failed to send SMS',
            };
        }
    }

    /**
     * Make voice call to one or more recipients
     */
    async makeCall(params: MakeCallParams): Promise<TwilioServiceResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/make-call`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error('TwilioService.makeCall error:', error);
            return {
                success: false,
                error: error.message || 'Failed to make call',
            };
        }
    }

    /**
     * Send SMS to patient with template
     */
    async sendPatientSMS(
        patientId: string,
        phoneNumber: string,
        template: string,
        variables: Record<string, string> = {}
    ): Promise<TwilioServiceResponse> {
        // Replace template variables
        let message = template;
        Object.keys(variables).forEach((key) => {
            message = message.replace(new RegExp(`{${key}}`, 'g'), variables[key]);
        });

        return this.sendSMS({
            to: phoneNumber,
            body: message,
            patientId,
        });
    }

    /**
     * Call patient with script
     */
    async callPatient(
        patientId: string,
        phoneNumber: string,
        scriptUrl: string,
        recordCall = false
    ): Promise<TwilioServiceResponse> {
        return this.makeCall({
            to: phoneNumber,
            twimlUrl: scriptUrl,
            patientId,
            recordCall,
        });
    }

    /**
     * Execute campaign (batch send SMS or calls)
     */
    async executeCampaign(campaign: Campaign, patients: any[]): Promise<TwilioServiceResponse> {
        const phoneNumbers = patients
            .filter(p => p.phone)
            .map(p => p.phone);

        if (phoneNumbers.length === 0) {
            return {
                success: false,
                error: 'No valid phone numbers found in target patients',
            };
        }

        if (campaign.type === 'sms') {
            const template = campaign.content?.smsTemplate || '';

            // For now, send to all at once (in production, implement throttling)
            return this.sendSMS({
                to: phoneNumbers,
                body: template,
                campaignId: campaign.id,
            });
        }

        if (campaign.type === 'call') {
            const scriptUrl = campaign.content?.callScriptId || '';

            return this.makeCall({
                to: phoneNumbers,
                twimlUrl: scriptUrl,
                campaignId: campaign.id,
            });
        }

        return {
            success: false,
            error: 'Unsupported campaign type',
        };
    }

    /**
     * Test Twilio connection
     */
    async testConnection(): Promise<TwilioServiceResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/test-connection`, {
                method: 'POST',
            });

            const data = await response.json();
            return data;
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'Connection test failed',
            };
        }
    }
}

// Export singleton instance
export const twilioService = new TwilioService();
export default twilioService;

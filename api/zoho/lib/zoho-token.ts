const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_DC = process.env.ZOHO_DC || 'com'; // e.g., 'com', 'eu', 'in'

export async function getZohoAccessToken(): Promise<string> {
    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
        throw new Error('Missing Zoho CRM credentials in environment variables');
    }

    const accountsUrl = `https://accounts.zoho.${ZOHO_DC}/oauth/v2/token`;

    const params = new URLSearchParams();
    params.append('refresh_token', ZOHO_REFRESH_TOKEN);
    params.append('client_id', ZOHO_CLIENT_ID);
    params.append('client_secret', ZOHO_CLIENT_SECRET);
    params.append('grant_type', 'refresh_token');

    try {
        const response = await fetch(accountsUrl, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            console.error('Zoho Token Refresh Error:', data);
            throw new Error(`Failed to refresh Zoho access token: ${data.error || response.statusText}`);
        }

        return data.access_token;
    } catch (error) {
        console.error('Zoho API Error:', error);
        throw error;
    }
}

export function getZohoApiDomain(): string {
    return `https://www.zohoapis.${ZOHO_DC}/crm/v3`;
}

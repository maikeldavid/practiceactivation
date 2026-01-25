import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getZohoAccessToken, getZohoApiDomain } from './lib/zoho-token';

const ZOHO_MODULE = process.env.ZOHO_MODULE || 'Leads';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, firstName, lastName, practiceName, phone, address, npi, status, contractStatus } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const accessToken = await getZohoAccessToken();
        const apiDomain = getZohoApiDomain();

        // 1. Search for existing record by email
        const searchUrl = `${apiDomain}/${ZOHO_MODULE}/search?email=${encodeURIComponent(email)}`;
        const searchResponse = await fetch(searchUrl, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`
            }
        });

        let recordId = null;
        if (searchResponse.status === 200) {
            const searchData = await searchResponse.json();
            if (searchData.data && searchData.data.length > 0) {
                recordId = searchData.data[0].id;
            }
        }

        // 2. Prepare Zoho Record Data
        // Note: Standard API names for Leads are used here. Adjust if using custom module.
        const zohoData: any = {
            Email: email,
            Company: practiceName || 'Itera Health Provider',
            Last_Name: lastName || practiceName || 'Provider',
            First_Name: firstName || '',
            Phone: phone || '',
            Street: address || '',
            NPI_Number: npi || '', // Custom field name assumption
            Onboarding_Status: status || 'Initiated', // Custom field name assumption
            Contract_Status: contractStatus || 'Pending' // Custom field name assumption
        };

        let result;
        if (recordId) {
            // Update existing record
            const updateUrl = `${apiDomain}/${ZOHO_MODULE}/${recordId}`;
            const updateResponse = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: [zohoData] })
            });
            result = await updateResponse.json();
        } else {
            // Create new record
            const createUrl = `${apiDomain}/${ZOHO_MODULE}`;
            const createResponse = await fetch(createUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Zoho-oauthtoken ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: [zohoData] })
            });
            result = await createResponse.json();
        }

        if (result.data && result.data[0].status === 'success') {
            return res.status(200).json({
                success: true,
                recordId: result.data[0].details.id,
                message: recordId ? 'Record updated' : 'Record created'
            });
        } else {
            console.error('Zoho API Error Result:', result);
            return res.status(500).json({
                success: false,
                error: 'Zoho API failed to process record',
                details: result
            });
        }

    } catch (error) {
        console.error('Zoho Integration Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

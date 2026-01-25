import { getZohoAccessToken, getZohoApiDomain } from './zoho-token';

export interface ZohoSyncData {
    practiceName: string;
    internalPracticeId: string;
    providerName: string;
    providerEmail: string;
    providerPhone?: string;
    providerAddress?: string;
    providerNpi?: string;
    onboardingStatus: string;
    contractStatus?: string;
}

export async function upsertZohoHierarchy(data: ZohoSyncData) {
    const accessToken = await getZohoAccessToken();
    const apiDomain = getZohoApiDomain();

    // 1. UPSERT ACCOUNT (The Practice)
    const accountId = await upsertRecord(apiDomain, accessToken, 'Accounts', {
        Account_Name: data.practiceName,
        External_ID: data.internalPracticeId, // Custom field assumption
        Phone: data.providerPhone,
        Billing_Street: data.providerAddress
    }, `(Account_Name:equals:${encodeURIComponent(data.practiceName)})`);

    // 2. UPSERT CONTACT (The Provider)
    const contactId = await upsertRecord(apiDomain, accessToken, 'Contacts', {
        First_Name: data.providerName.split(' ')[0],
        Last_Name: data.providerName.split(' ').slice(1).join(' ') || data.providerName,
        Email: data.providerEmail,
        Account_Name: accountId, // Link to Account
        Phone: data.providerPhone,
        Mailing_Street: data.providerAddress,
        NPI: data.providerNpi // Custom field assumption
    }, `(Email:equals:${encodeURIComponent(data.providerEmail)})`);

    // 3. UPSERT DEAL (The Onboarding Process)
    // A Deal is usually unique per Account or per Onboarding session
    const dealName = `Onboarding - ${data.practiceName}`;
    const dealId = await upsertRecord(apiDomain, accessToken, 'Deals', {
        Deal_Name: dealName,
        Account_Name: accountId,
        Contact_Name: contactId,
        Stage: mapStatusToStage(data.onboardingStatus, data.contractStatus),
        Amount: 0,
        Closing_Date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        Onboarding_Status: data.onboardingStatus,
        Contract_Status: data.contractStatus,
        Internal_ID: data.internalPracticeId // Custom field to track link
    }, `(Deal_Name:equals:${encodeURIComponent(dealName)})`);

    return { accountId, contactId, dealId };
}

async function upsertRecord(domain: string, token: string, module: string, data: any, searchCriteria: string): Promise<string> {
    // 1. Search first to see if record exists
    const searchUrl = `${domain}/${module}/search?criteria=${searchCriteria}`;
    const searchRes = await fetch(searchUrl, {
        headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
    });

    let existingId = null;
    if (searchRes.status === 200) {
        const searchData = await searchRes.json();
        if (searchData.data && searchData.data.length > 0) {
            existingId = searchData.data[0].id;
        }
    }

    // 2. Perform Upsert
    const payload = { data: [data] };
    const method = existingId ? 'PUT' : 'POST';
    const url = existingId ? `${domain}/${module}/${existingId}` : `${domain}/${module}`;

    const upsertRes = await fetch(url, {
        method,
        headers: {
            'Authorization': `Zoho-oauthtoken ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await upsertRes.json();

    // 3. Handle Result
    if (result.data && result.data[0].status === 'success') {
        return result.data[0].details.id;
    }

    // 4. SMART FALLBACK: If a field is invalid/missing in Zoho (like a custom field not yet created), 
    // remove it and try again automatically.
    const firstError = result.data?.[0];
    if (firstError?.code === 'INVALID_DATA' && firstError?.details?.api_name) {
        const invalidField = firstError.details.api_name;
        console.warn(`Zoho [${module}]: Field '${invalidField}' is invalid. Retrying without it...`);

        const newData = { ...data };
        delete newData[invalidField];

        // If we still have data to send, retry recursively
        if (Object.keys(newData).length > 0) {
            return upsertRecord(domain, token, module, newData, searchCriteria);
        }
    }

    // If it's another type of error or we can't retry
    const errorMsg = result.data?.[0]?.message || JSON.stringify(result);
    console.error(`Zoho ${module} Final Error:`, errorMsg);
    throw new Error(`Zoho API [${module}]: ${errorMsg}`);
}

function mapStatusToStage(onboardingStatus: string, contractStatus?: string): string {
    if (contractStatus === 'Signed') return 'Closed Won';
    if (onboardingStatus.includes('Step 2')) return 'Ready for contract'; // This triggers the Zoho Workflow
    if (onboardingStatus.includes('Step')) return 'Qualification';
    return 'New Business';
}

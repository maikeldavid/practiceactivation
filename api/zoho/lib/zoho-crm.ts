import { getZohoAccessToken, getZohoApiDomain } from './zoho-token.js';

export interface ZohoAssignmentRule {
    field: string;
    operator: string;
    value: string;
    assignTo: string;
}

export interface ZohoSyncData {
    practiceName: string;
    internalPracticeId: string;
    providerName: string;
    providerEmail: string;
    providerPhone?: string;
    providerAddress?: string;
    providerNpi?: string;
    providerURL?: string;
    medicarePotential?: string;
    otherPotential?: string;
    onboardingStatus: string;
    contractStatus?: string;
    assignmentRules?: ZohoAssignmentRule[];
    accountId?: string;
    contactId?: string;
    dealId?: string;
}

export async function upsertZohoHierarchy(data: ZohoSyncData) {
    const accessToken = await getZohoAccessToken();
    const apiDomain = getZohoApiDomain();

    console.log(`Starting Upsert Hierarchy for: ${data.practiceName} (${data.internalPracticeId})`);

    // Determine Owner based on Assignment Rules
    const targetOwner = evaluateAssignmentRules(data);
    const ownerField = targetOwner ? { Owner: { id: targetOwner } } : {};

    // 1. UPSERT ACCOUNT (The Practice)
    const accountId = await upsertRecord(apiDomain, accessToken, 'Accounts', {
        Account_Name: data.practiceName || 'New Practice',
        External_ID: data.internalPracticeId,
        Phone: data.providerPhone,
        Website: data.providerURL,
        Billing_Street: data.providerAddress,
        Shipping_Street: data.providerAddress,
        ...ownerField
    }, `(External_ID:equals:${encodeURIComponent(data.internalPracticeId)})`, data.accountId);

    // 2. UPSERT CONTACT (The Provider)
    const contactId = await upsertRecord(apiDomain, accessToken, 'Contacts', {
        First_Name: data.providerName.split(' ')[0],
        Last_Name: data.providerName.split(' ').slice(1).join(' ') || data.providerName || 'Provider',
        Email: data.providerEmail,
        Account_Name: { id: accountId },
        Phone: data.providerPhone,
        Mobile: data.providerPhone,
        Mailing_Street: data.providerAddress,
        Other_Street: data.providerAddress,
        NPI: data.providerNpi,
        ...ownerField
    }, `(Email:equals:${encodeURIComponent(data.providerEmail)})`, data.contactId);

    // 3. UPSERT DEAL (The Onboarding/Qualification Process)
    const isSigned = data.contractStatus === 'Signed';
    const prefix = isSigned ? 'Onboarding' : 'Qualification';
    const dealName = `${prefix} - ${data.practiceName || data.providerName}`;
    const dealId = await upsertRecord(apiDomain, accessToken, 'Deals', {
        Deal_Name: dealName,
        Account_Name: { id: accountId },
        Contact_Name: { id: contactId },
        Stage: mapStatusToStage(data.onboardingStatus, data.contractStatus),
        Amount: 0,
        Closing_Date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        Onboarding_Status: data.onboardingStatus,
        Contract_Status: data.contractStatus,
        Medicare_Potential: data.medicarePotential,
        Other_Potential: data.otherPotential,
        Internal_ID: data.internalPracticeId,
        ...ownerField
    }, `(Internal_ID:equals:${encodeURIComponent(data.internalPracticeId)})`, data.dealId);

    return { accountId, contactId, dealId };
}

function evaluateAssignmentRules(data: ZohoSyncData): string | null {
    if (!data.assignmentRules || data.assignmentRules.length === 0) return null;

    for (const rule of data.assignmentRules) {
        let actualValue = '';
        if (rule.field === 'NPI') actualValue = data.providerNpi || '';
        if (rule.field === 'Practice Name') actualValue = data.practiceName || '';
        if (rule.field === 'Zip Code') {
            // Extract zip from address
            const zipMatch = data.providerAddress?.match(/\d{5}/);
            actualValue = zipMatch ? zipMatch[0] : '';
        }
        if (rule.field === 'Always') return mapUserToZohoId(rule.assignTo);

        const match = checkCondition(actualValue, rule.operator, rule.value);
        if (match) return mapUserToZohoId(rule.assignTo);
    }
    return null;
}

function checkCondition(actual: string, operator: string, target: string): boolean {
    if (operator === 'equals') return actual.toLowerCase() === target.toLowerCase();
    if (operator === 'contains') return actual.toLowerCase().includes(target.toLowerCase());
    if (operator === 'starts with') return actual.toLowerCase().startsWith(target.toLowerCase());
    return false;
}

function mapUserToZohoId(userName: string): string | null {
    // This is a placeholder. In a real scenario, you'd have a mapping of names to Zoho User IDs.
    // If we send a string name to Zoho's ID field, it will error.
    // So for now, we'll only return a value if it looks like an ID OR we assume the user provides IDs in the 'assignTo' field.
    if (userName.match(/^\d{18,20}$/)) return userName;

    // Demo Mappings (Should be moved to ENV or Database)
    const mappings: { [key: string]: string } = {
        'Maikel (Default)': process.env.ZOHO_DEFAULT_OWNER_ID || '',
        'Florida Sales Team': '5987103000000215001', // Example Dummy ID
    };

    return mappings[userName] || null;
}

async function upsertRecord(domain: string, token: string, module: string, data: any, searchCriteria: string, explicitId?: string): Promise<string> {
    // 1. Identification Phase: Prioritize Explicit ID if identity is confirmed
    let existingId: string | null = explicitId || null;

    // Only perform search if we don't have a trusted ID
    if (!existingId) {
        console.log(`Zoho [${module}]: No explicit ID provided. Attempting identification via search: ${searchCriteria}`);
        try {
            const searchUrl = `${domain}/${module}/search?criteria=${encodeURIComponent(searchCriteria)}`;
            const searchRes = await fetch(searchUrl, {
                headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
            });

            if (searchRes.status === 200) {
                const searchData = await searchRes.json();
                if (searchData.data && searchData.data.length > 0) {
                    existingId = searchData.data[0].id;
                    console.log(`Zoho [${module}]: Found existing record by identifier: ${existingId}`);
                }
            }
        } catch (e) {
            console.error(`Zoho [${module}]: Identification search failed:`, e);
        }
    } else {
        console.log(`Zoho [${module}]: Using trusted explicit ID: ${existingId}`);
    }

    // B. SECONDARY SEARCH fallback (by Name/Email) - Only if A found nothing
    if (!existingId) {
        let fallbackCriteria = '';
        if (module === 'Accounts' && data.Account_Name) {
            fallbackCriteria = `(Account_Name:equals:${encodeURIComponent(data.Account_Name)})`;
        } else if (module === 'Contacts' && data.Email) {
            fallbackCriteria = `(Email:equals:${encodeURIComponent(data.Email)})`;
        } else if (module === 'Deals' && data.Deal_Name) {
            fallbackCriteria = `(Deal_Name:equals:${encodeURIComponent(data.Deal_Name)})`;
        }

        if (fallbackCriteria) {
            console.log(`Zoho [${module}]: Secondary search attempt with fallback: ${fallbackCriteria}`);
            try {
                const fallbackUrl = `${domain}/${module}/search?criteria=${encodeURIComponent(fallbackCriteria)}`;
                const fallbackRes = await fetch(fallbackUrl, {
                    headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
                });
                if (fallbackRes.status === 200) {
                    const fallbackData = await fallbackRes.json();
                    if (fallbackData.data && fallbackData.data.length > 0) {
                        existingId = fallbackData.data[0].id;
                        console.log(`Zoho [${module}]: Found record via fallback identity: ${existingId}`);
                    }
                }
            } catch (e) {
                console.error(`Zoho [${module}]: Fallback search failed:`, e);
            }
        }
    }

    // 2. Perform Upsert
    const payload = { data: [data] };
    const method = existingId ? 'PUT' : 'POST';
    const url = existingId ? `${domain}/${module}/${existingId}` : `${domain}/${module}`;

    console.log(`Zoho [${module}]: Sending ${method} request to ${url}`);

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
    if (result.data && result.data[0] && result.data[0].status === 'success') {
        const newId = result.data[0].details.id;
        console.log(`Zoho [${module}]: Upsert successful. ID: ${newId}`);
        return newId;
    }

    // 4. SMART FALLBACK: If a field is invalid/missing in Zoho
    const firstError = result.data?.[0];
    if (firstError?.code === 'INVALID_DATA' && firstError?.details?.api_name) {
        const invalidField = firstError.details.api_name;
        console.warn(`Zoho [${module}]: Field '${invalidField}' is invalid in Zoho. Retrying without it...`);

        const newData = { ...data };
        delete newData[invalidField];

        // Clean up search criteria if it depends on the invalid field
        let newCriteria = searchCriteria;
        if (searchCriteria.includes(invalidField)) {
            console.warn(`Zoho [${module}]: Search criteria depends on invalid field '${invalidField}'. Falling back to Name-based search.`);
            if (module === 'Accounts' && data.Account_Name) {
                newCriteria = `(Account_Name:equals:${encodeURIComponent(data.Account_Name)})`;
            } else if (module === 'Contacts' && data.Last_Name) {
                newCriteria = `(Last_Name:equals:${encodeURIComponent(data.Last_Name)})`;
            } else if (module === 'Deals' && data.Deal_Name) {
                newCriteria = `(Deal_Name:equals:${encodeURIComponent(data.Deal_Name)})`;
            } else {
                newCriteria = `(id:equals:0)`; // Force skip search
            }
        }

        if (Object.keys(newData).length > 0) {
            return upsertRecord(domain, token, module, newData, newCriteria);
        }
    }

    // 5. FINAL ERROR REPORTING
    const errorMsg = result.data?.[0]?.message || JSON.stringify(result);
    const detailMsg = `Zoho [${module}] Sync Failed: ${errorMsg}. Response: ${JSON.stringify(result)}`;
    console.error(detailMsg);
    console.error(`Data sent was: ${JSON.stringify(data)}`);
    throw new Error(detailMsg);
}


function mapStatusToStage(onboardingStatus: string, contractStatus?: string): string {
    const isContractSigned = contractStatus === 'Signed';

    // Before Contract is signed
    if (!isContractSigned) {
        if (onboardingStatus.includes('Step 2')) return 'Ready for contract';
        return 'Qualification';
    }

    // After Contract is signed -> Onboarding Starts
    if (onboardingStatus.includes('Step 5')) return 'Closed Won / Live';
    if (onboardingStatus.includes('Step 4')) return 'Onboarding - EHR Configuration';
    if (onboardingStatus.includes('Step 3')) return 'Onboarding - Care Team Setup';

    return 'Contract Signed / Onboarding Start';
}

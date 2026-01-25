export interface ZohoTokenResponse {
    access_token: string;
    refresh_token?: string;
    api_domain: string;
    token_type: string;
    expires_in: number;
}

export interface ZohoProviderUpdate {
    providerId?: string; // Zoho Record ID
    email: string;
    data: {
        First_Name?: string;
        Last_Name?: string;
        Practice_Name?: string;
        Email: string;
        Phone?: string;
        Address?: string;
        NPI?: string;
        Onboarding_Status?: string;
        Contract_Status?: string;
        [key: string]: any;
    };
}

export interface ZohoSyncResponse {
    success: boolean;
    recordId?: string;
    message?: string;
    error?: string;
}

export interface ZohoEnvConfig {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    dc: string; // e.g., 'com', 'eu'
    moduleName: string; // e.g., 'Leads', 'Providers'
}

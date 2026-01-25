export interface PandaDocDocumentRequest {
    name: string;
    template_uuid: string;
    recipients: Array<{
        email: string;
        first_name: string;
        last_name: string;
        role: string;
    }>;
    tokens?: Array<{
        name: string;
        value: string;
    }>;
    fields?: Record<string, {
        value: string;
    }>;
}

export interface PandaDocDocument {
    id: string;
    name: string;
    status: 'document.draft' | 'document.sent' | 'document.viewed' | 'document.completed' | 'document.declined';
    date_created: string;
    date_modified: string;
    recipients: Array<{
        email: string;
        first_name: string;
        last_name: string;
        role: string;
    }>;
}

export interface PandaDocSessionRequest {
    recipient: string;
    lifetime: number;
}

export interface PandaDocSession {
    id: string;
    expires_at: string;
}

export interface DocumentSigningStatus {
    documentId: string;
    type: 'BAA' | 'CONTRACT';
    status: 'pending' | 'sent' | 'signed' | 'error';
    sessionUrl?: string;
    pandadocId?: string;
    error?: string;
}

export interface CreateDocumentResponse {
    success: boolean;
    documentId?: string;
    sessionUrl?: string;
    error?: string;
}

export interface DocumentStatusResponse {
    success: boolean;
    status?: 'pending' | 'sent' | 'signed';
    error?: string;
}

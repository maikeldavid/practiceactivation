import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, FileTextIcon, ClockIcon, AlertCircleIcon, EyeIcon } from '../IconComponents';
import PandaDocModal from '../PandaDocModal';
import type { CreateDocumentResponse, DocumentStatusResponse } from '../../types/pandadoc.types';

interface DocumentSigningViewProps {
    userEmail: string;
    providerName: string;
    onDocumentsSigned: () => void;
}

interface Document {
    id: string;
    type: 'BAA' | 'CONTRACT';
    name: string;
    status: 'pending' | 'sent' | 'signed' | 'error';
    pandadocId?: string;
    sessionUrl?: string;
    error?: string;
}

const DocumentSigningView: React.FC<DocumentSigningViewProps> = ({
    userEmail,
    providerName,
    onDocumentsSigned
}) => {
    const [documents, setDocuments] = useState<Document[]>([
        {
            id: 'baa-001',
            type: 'BAA',
            name: 'Business Associate Agreement (BAA)',
            status: 'pending'
        },
        {
            id: 'contract-001',
            type: 'CONTRACT',
            name: 'Digital Service Agreement',
            status: 'pending'
        }
    ]);

    const [signingDocument, setSigningDocument] = useState<Document | null>(null);
    const [isCreatingDocument, setIsCreatingDocument] = useState<string | null>(null);
    const [isPandaDocModalOpen, setIsPandaDocModalOpen] = useState(false);

    // Poll for document status periodically
    useEffect(() => {
        const pendingDocs = documents.filter(doc => doc.status === 'sent' && doc.pandadocId);

        if (pendingDocs.length === 0) return;

        const pollInterval = setInterval(async () => {
            for (const doc of pendingDocs) {
                try {
                    const response = await fetch(`/api/pandadoc/document-status?documentId=${doc.pandadocId}`);
                    const data: DocumentStatusResponse = await response.json();

                    if (data.success && data.status === 'signed') {
                        setDocuments(prev => prev.map(d =>
                            d.id === doc.id ? { ...d, status: 'signed' } : d
                        ));
                    }
                } catch (error) {
                    console.error('Error polling document status:', error);
                }
            }
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(pollInterval);
    }, [documents]);

    // Check if all documents are signed
    useEffect(() => {
        const allSigned = documents.every(doc => doc.status === 'signed');
        if (allSigned && documents.length > 0) {
            setTimeout(() => {
                onDocumentsSigned();
            }, 1000);
        }
    }, [documents, onDocumentsSigned]);

    const handleSignDocument = async (doc: Document) => {
        setIsCreatingDocument(doc.id);

        try {
            const response = await fetch('/api/pandadoc/create-document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentType: doc.type,
                    userEmail: userEmail,
                    userName: providerName,
                    practiceName: providerName,
                }),
            });

            const data: CreateDocumentResponse = await response.json();

            if (!data.success || !data.documentId || !data.sessionUrl) {
                throw new Error(data.error || 'Failed to create document');
            }

            // Update document with session URL and PandaDoc ID
            const updatedDoc = {
                ...doc,
                status: 'sent' as const,
                pandadocId: data.documentId,
                sessionUrl: data.sessionUrl,
            };

            setDocuments(prev => prev.map(d =>
                d.id === doc.id ? updatedDoc : d
            ));

            setSigningDocument(updatedDoc);
            setIsPandaDocModalOpen(true);

        } catch (error) {
            console.error('Error creating PandaDoc document:', error);
            setDocuments(prev => prev.map(d =>
                d.id === doc.id
                    ? { ...d, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
                    : d
            ));
        } finally {
            setIsCreatingDocument(null);
        }
    };

    const handleReviewDocument = async (doc: Document) => {
        // If it already has a session URL, just open it
        if (doc.sessionUrl) {
            setSigningDocument(doc);
            setIsPandaDocModalOpen(true);
            return;
        }

        // Otherwise create it first
        await handleSignDocument(doc);
    };

    const handlePandaDocComplete = () => {
        if (signingDocument) {
            setDocuments(prev => prev.map(d =>
                d.id === signingDocument.id ? { ...d, status: 'signed' } : d
            ));
        }
    };

    const handleClosePandaDoc = () => {
        setIsPandaDocModalOpen(false);
        setSigningDocument(null);
    };

    const allDocumentsSigned = documents.every(doc => doc.status === 'signed');
    const pendingCount = documents.filter(doc => doc.status !== 'signed').length;

    return (
        <>
            <div className="space-y-8 animate-fade-in-up">
                <div>
                    <h2 className="text-3xl font-bold text-itera-blue-dark mb-2">Sign Legal Documents</h2>
                    <p className="text-gray-600">Review and sign the required legal documents to complete your onboarding</p>
                </div>

                {!allDocumentsSigned && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                        <ClockIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-bold text-blue-900 mb-1">
                                {pendingCount} document{pendingCount > 1 ? 's' : ''} pending signature
                            </p>
                            <p className="text-blue-700">
                                Click "Sign Now" to open the secure signing interface powered by PandaDoc.
                            </p>
                        </div>
                    </div>
                )}

                {/* Documents List */}
                <div className="space-y-4">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className={`border-2 rounded-2xl p-6 transition-all ${doc.status === 'signed'
                                ? 'border-green-200 bg-green-50/50'
                                : doc.status === 'error'
                                    ? 'border-red-200 bg-red-50/50'
                                    : 'border-gray-200 bg-white hover:border-itera-blue/30 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.status === 'signed'
                                        ? 'bg-green-100 text-green-600'
                                        : doc.status === 'error'
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-blue-50 text-itera-blue'
                                        }`}>
                                        {doc.status === 'signed' ? (
                                            <CheckCircleIcon className="w-6 h-6" />
                                        ) : doc.status === 'error' ? (
                                            <AlertCircleIcon className="w-6 h-6" />
                                        ) : (
                                            <FileTextIcon className="w-6 h-6" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                                            {doc.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm">
                                            {doc.status === 'signed' ? (
                                                <span className="text-green-600 font-medium flex items-center gap-1">
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    Signed successfully
                                                </span>
                                            ) : doc.status === 'error' ? (
                                                <span className="text-red-600 font-medium flex items-center gap-1">
                                                    <AlertCircleIcon className="w-4 h-4" />
                                                    {doc.error || 'Error creating document'}
                                                </span>
                                            ) : doc.status === 'sent' ? (
                                                <span className="text-gray-500">
                                                    Ready to sign
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">
                                                    Not yet sent
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {doc.status !== 'signed' && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleReviewDocument(doc)}
                                            disabled={isCreatingDocument === doc.id}
                                            className="px-6 py-3 rounded-xl font-bold border-2 border-itera-blue text-itera-blue hover:bg-itera-blue/5 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                            Review
                                        </button>
                                        <button
                                            onClick={() => handleSignDocument(doc)}
                                            disabled={isCreatingDocument === doc.id}
                                            className={`px-6 py-3 rounded-xl font-bold transition-all ${isCreatingDocument === doc.id
                                                ? 'bg-gray-100 text-gray-400 cursor-wait'
                                                : 'bg-itera-blue text-white hover:bg-itera-blue-dark shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                                }`}
                                        >
                                            {isCreatingDocument === doc.id ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Preparing...
                                                </span>
                                            ) : (
                                                'Sign Now'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Success State */}
                {allDocumentsSigned && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center gap-3 text-green-700">
                            <CheckCircleIcon className="w-6 h-6" />
                            <div>
                                <p className="font-bold">All documents signed!</p>
                                <p className="text-sm text-green-600">Your onboarding is now complete. You can proceed to use the portal.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* PandaDoc Modal */}
            {signingDocument && signingDocument.sessionUrl && (
                <PandaDocModal
                    isOpen={isPandaDocModalOpen}
                    onClose={handleClosePandaDoc}
                    sessionUrl={signingDocument.sessionUrl}
                    documentName={signingDocument.name}
                    onComplete={handlePandaDocComplete}
                />
            )}
        </>
    );
};

export default DocumentSigningView;

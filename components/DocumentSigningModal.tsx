import React, { useState } from 'react';
import { XIcon, CheckCircleIcon, FileTextIcon, ClockIcon } from './IconComponents';

interface DocumentSigningModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
    onDocumentsSigned: () => void;
}

interface Document {
    id: string;
    type: 'BAA' | 'CONTRACT';
    name: string;
    status: 'pending' | 'sent' | 'signed';
    sentAt?: Date;
    signedAt?: Date;
}

const DocumentSigningModal: React.FC<DocumentSigningModalProps> = ({
    isOpen,
    onClose,
    userEmail,
    onDocumentsSigned
}) => {
    // Mock documents - in production, this would come from backend
    const [documents, setDocuments] = useState<Document[]>([
        {
            id: 'baa-001',
            type: 'BAA',
            name: 'Business Associate Agreement (BAA)',
            status: 'sent',
            sentAt: new Date()
        },
        {
            id: 'contract-001',
            type: 'CONTRACT',
            name: 'Digital Service Agreement',
            status: 'sent',
            sentAt: new Date()
        }
    ]);

    const [signingDocument, setSigningDocument] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSignDocument = (docId: string) => {
        // Mock signing process - in production, this would open PandaDoc embedded session
        setSigningDocument(docId);

        // Simulate signing delay
        setTimeout(() => {
            setDocuments(prev => prev.map(doc =>
                doc.id === docId
                    ? { ...doc, status: 'signed' as const, signedAt: new Date() }
                    : doc
            ));
            setSigningDocument(null);

            // Check if all documents are signed
            const allSigned = documents.every(doc =>
                doc.id === docId || doc.status === 'signed'
            );

            if (allSigned) {
                setTimeout(() => {
                    onDocumentsSigned();
                    onClose();
                }, 1000);
            }
        }, 2000);
    };

    const allDocumentsSigned = documents.every(doc => doc.status === 'signed');
    const pendingCount = documents.filter(doc => doc.status !== 'signed').length;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-itera-blue-light/5 to-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-itera-blue-dark mb-2">
                                Complete Your Onboarding
                            </h2>
                            <p className="text-gray-600">
                                Please review and sign the following documents to activate your account
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                            aria-label="Close"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {!allDocumentsSigned && (
                        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                            <ClockIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-bold text-blue-900 mb-1">
                                    {pendingCount} document{pendingCount > 1 ? 's' : ''} pending signature
                                </p>
                                <p className="text-blue-700">
                                    You'll receive email notifications with signing links, or you can sign directly below.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Documents List */}
                <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className={`border-2 rounded-2xl p-6 transition-all ${doc.status === 'signed'
                                    ? 'border-green-200 bg-green-50/50'
                                    : 'border-gray-200 bg-white hover:border-itera-blue/30 hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.status === 'signed'
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-blue-50 text-itera-blue'
                                        }`}>
                                        {doc.status === 'signed' ? (
                                            <CheckCircleIcon className="w-6 h-6" />
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
                                                    Signed {doc.signedAt?.toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">
                                                    Sent to {userEmail}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {doc.status !== 'signed' && (
                                    <button
                                        onClick={() => handleSignDocument(doc.id)}
                                        disabled={signingDocument === doc.id}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all ${signingDocument === doc.id
                                                ? 'bg-gray-100 text-gray-400 cursor-wait'
                                                : 'bg-itera-blue text-white hover:bg-itera-blue-dark shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                            }`}
                                    >
                                        {signingDocument === doc.id ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Signing...
                                            </span>
                                        ) : (
                                            'Sign Now'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                {allDocumentsSigned && (
                    <div className="p-8 border-t border-gray-100 bg-green-50/50">
                        <div className="flex items-center gap-3 text-green-700">
                            <CheckCircleIcon className="w-6 h-6" />
                            <div>
                                <p className="font-bold">All documents signed!</p>
                                <p className="text-sm text-green-600">Your account is now fully activated.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentSigningModal;

import React, { useEffect } from 'react';
import { XIcon } from './IconComponents';

interface PandaDocModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionUrl: string;
    documentName: string;
    onComplete?: () => void;
}

const PandaDocModal: React.FC<PandaDocModalProps> = ({
    isOpen,
    onClose,
    sessionUrl,
    documentName,
    onComplete
}) => {
    useEffect(() => {
        if (!isOpen) return;

        // Listen for PandaDoc session completion messages
        const handleMessage = (event: MessageEvent) => {
            // Verify origin is from PandaDoc
            if (!event.origin.includes('pandadoc.com')) return;

            const data = event.data;

            // Handle session completion
            if (data.event === 'session_view.document.completed' ||
                data.type === 'session_view.document.completed') {
                console.log('PandaDoc document completed:', data);
                if (onComplete) {
                    onComplete();
                }
                // Close modal after a brief delay
                setTimeout(() => {
                    onClose();
                }, 1500);
            }

            // Handle session closure
            if (data.event === 'session_view.closed' ||
                data.type === 'session_view.closed') {
                console.log('PandaDoc session closed');
                onClose();
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [isOpen, onClose, onComplete]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-itera-blue-dark text-white p-4 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">Sign Document</h2>
                        <p className="text-blue-200 text-sm">{documentName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* PandaDoc Iframe */}
                <div className="flex-1 relative bg-gray-50">
                    <iframe
                        src={`https://app.pandadoc.com/s/${sessionUrl}`}
                        className="w-full h-full border-0"
                        title="PandaDoc Signing Session"
                        allow="camera; microphone"
                    />
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-4 text-center text-sm text-gray-600 shrink-0">
                    <p>Powered by PandaDoc • Secure Electronic Signature</p>
                </div>
            </div>
        </div>
    );
};

export default PandaDocModal;

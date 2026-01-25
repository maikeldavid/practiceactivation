
import React, { useState } from 'react';
import { XIcon, MailIcon, UserIcon, MessageSquareIcon, SendIcon, CheckCircleIcon } from './IconComponents';

interface EmailContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialName?: string;
    initialEmail?: string;
}

const EmailContactModal: React.FC<EmailContactModalProps> = ({ isOpen, onClose, initialName = '', initialEmail = '' }) => {
    const [formData, setFormData] = useState({
        name: initialName,
        email: initialEmail,
        subject: '',
        message: '',
        type: 'General Question'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Reset/Initialize form when modal opens or initial values change
    React.useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                name: initialName || prev.name,
                email: initialEmail || prev.email
            }));
        }
    }, [isOpen, initialName, initialEmail]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({ name: initialName, email: initialEmail, subject: '', message: '', type: 'General Question' });
            }, 2000);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-itera-blue-dark/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl z-10 overflow-hidden relative animate-in fade-in zoom-in duration-300">
                {isSuccess ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <CheckCircleIcon className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Message Sent!</h3>
                        <p className="text-gray-500">Thanks for reaching out. Our support team will get back to you shortly.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-6 bg-itera-blue-dark text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <MailIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Contact Support</h3>
                                    <p className="text-blue-200 text-xs">We typically reply within 24 hours.</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                                    <div className="relative">
                                        <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!!initialName}
                                            className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-itera-blue outline-none ${initialName ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <MailIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!!initialEmail}
                                            className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-itera-blue outline-none ${initialEmail ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Support Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-itera-blue outline-none bg-white"
                                >
                                    <option>General Question</option>
                                    <option>Technical Issue</option>
                                    <option>Billing Inquiry</option>
                                    <option>Feature Request</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</label>
                                <div className="relative">
                                    <MessageSquareIcon className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                    <textarea
                                        required
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-itera-blue outline-none resize-none"
                                        placeholder="How can we help you today?"
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-itera-orange text-white font-bold rounded-xl shadow-lg hover:bg-itera-orange-dark transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isSubmitting ? (
                                    <span>Sending...</span>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <SendIcon className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmailContactModal;

import React, { useState } from 'react';
import { XIcon, UserIcon, MailIcon, ShieldCheckIcon, PhoneCall } from '../IconComponents';

interface AddUserModalProps {
    onClose: () => void;
    onSave: (user: { name: string; email: string; role: string; personalPhone: string; iteraPhone: string }) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [personalPhone, setPersonalPhone] = useState('');
    const [iteraPhone, setIteraPhone] = useState('');
    const [role, setRole] = useState('Practice Staff');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!name || !email) {
            setError('Please fill in all required fields.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        onSave({ name, email, role, personalPhone, iteraPhone });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-itera-blue-dark text-white p-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold">Add New Team Member</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Dr. Jane Smith"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue/20 focus:border-itera-blue outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="jane.smith@practice.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue/20 focus:border-itera-blue outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Personal Phone</label>
                                <div className="relative">
                                    <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={personalPhone}
                                        onChange={(e) => setPersonalPhone(e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue/20 focus:border-itera-blue outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Itera Health Phone</label>
                                <div className="relative">
                                    <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={iteraPhone}
                                        onChange={(e) => setIteraPhone(e.target.value)}
                                        placeholder="+1 (800) ITERA-XX"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue/20 focus:border-itera-blue outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Portal Role</label>
                            <div className="relative">
                                <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue/20 focus:border-itera-blue outline-none transition-all appearance-none cursor-pointer font-medium"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Practice Staff">Practice Staff</option>
                                    <option value="Physician">Physician</option>
                                    <option value="Care Coordinator">Care Coordinator</option>
                                    <option value="Care Manager">Care Manager</option>
                                    <option value="Call Center">Call Center</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-6 py-3 bg-itera-blue text-white font-bold rounded-xl shadow-lg shadow-itera-blue/20 hover:bg-itera-blue-dark transition-all active:scale-95"
                        >
                            Save User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;

import React, { useState } from 'react';
import { XIcon, StethoscopeIcon, MailIcon, PhoneCall, MapPinIcon, ShieldCheckIcon } from '../IconComponents';
import type { RegisteredProvider } from '../../types';

interface AddProviderModalProps {
    onClose: () => void;
    onSave: (provider: Omit<RegisteredProvider, 'id'>) => void;
}

const AddProviderModal: React.FC<AddProviderModalProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        practiceName: '',
        npi: '',
        location: '',
        status: 'Active' as 'Active' | 'Pending' | 'Inactive'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Physician name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.practiceName) newErrors.practiceName = 'Practice name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        onSave({
            ...formData,
            registrationDate: new Date().toISOString()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-itera-blue p-6 text-white flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <StethoscopeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Register New Provider</h2>
                            <p className="text-itera-blue-light/80 text-xs font-medium uppercase tracking-wider">Manual Administrative Entry</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors relative z-10">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Practice Name *</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 bg-gray-50 border ${errors.practiceName ? 'border-red-300' : 'border-gray-200'} rounded-2xl focus:ring-2 focus:ring-itera-blue outline-none transition-all font-medium text-gray-700`}
                                placeholder="Valley Health Partners"
                                value={formData.practiceName}
                                onChange={(e) => setFormData({ ...formData, practiceName: e.target.value })}
                            />
                            {errors.practiceName && <p className="text-red-500 text-[10px] font-bold pl-1 uppercase">{errors.practiceName}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Physician Name *</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-2xl focus:ring-2 focus:ring-itera-blue outline-none transition-all font-medium text-gray-700`}
                                placeholder="Dr. Michael Smith"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            {errors.name && <p className="text-red-500 text-[10px] font-bold pl-1 uppercase">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address *</label>
                                <div className="relative">
                                    <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-2xl focus:ring-2 focus:ring-itera-blue outline-none transition-all font-medium text-gray-700`}
                                        placeholder="m.smith@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Individual NPI</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-itera-blue outline-none transition-all font-medium text-gray-700 font-mono"
                                    placeholder="1234567890"
                                    value={formData.npi}
                                    onChange={(e) => setFormData({ ...formData, npi: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Primary Location</label>
                            <div className="relative">
                                <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-itera-blue outline-none transition-all font-medium text-gray-700"
                                    placeholder="Miami, FL"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Account Status</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['Active', 'Pending', 'Inactive'] as const).map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: s })}
                                        className={`py-2 text-[10px] font-bold uppercase rounded-xl border transition-all ${formData.status === s
                                                ? (s === 'Active' ? 'bg-green-50 border-green-200 text-green-700' : s === 'Pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-red-50 border-red-200 text-red-700')
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-[2] py-3 bg-itera-blue text-white font-bold rounded-2xl shadow-lg shadow-itera-blue/20 hover:bg-itera-blue-dark transition-all flex items-center justify-center gap-2"
                    >
                        <ShieldCheckIcon className="w-5 h-5" />
                        Complete Registration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProviderModal;

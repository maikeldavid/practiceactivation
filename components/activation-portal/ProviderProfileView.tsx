import React, { useState } from 'react';
import { CheckCircleIcon, HomeIcon, MapPinIcon, MailIcon, UsersIcon, Trash2Icon } from '../IconComponents';

interface CareTeamMember {
    id: string;
    name: string;
    role: string;
    email: string;
}

interface ProviderProfileViewProps {
    initialData?: {
        providerName: string;
        providerAddress: string;
        providerPhone: string;
        providerEmail: string;
        providerNPI: string;
        careTeamMembers: CareTeamMember[];
    };
    onSave: (data: {
        providerName: string;
        providerAddress: string;
        providerPhone: string;
        providerEmail: string;
        providerNPI: string;
        careTeamMembers: CareTeamMember[];
    }) => void;
    onCancel?: () => void;
}

const ProviderProfileView: React.FC<ProviderProfileViewProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        providerName: initialData?.providerName || '',
        providerAddress: initialData?.providerAddress || '',
        providerPhone: initialData?.providerPhone || '',
        providerEmail: initialData?.providerEmail || '',
        providerNPI: initialData?.providerNPI || ''
    });

    const [careTeamMembers, setCareTeamMembers] = useState<CareTeamMember[]>(
        initialData?.careTeamMembers || []
    );

    const [newMember, setNewMember] = useState({ name: '', role: '', email: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.providerName.trim()) {
            newErrors.providerName = 'Provider name is required';
        }

        if (!formData.providerAddress.trim()) {
            newErrors.providerAddress = 'Provider address is required';
        }

        if (!formData.providerPhone.trim()) {
            newErrors.providerPhone = 'Provider phone is required';
        } else if (!/^[\d\s\-\(\)\+]{7,20}$/.test(formData.providerPhone)) {
            newErrors.providerPhone = 'Please enter a valid phone number';
        }

        if (!formData.providerEmail.trim()) {
            newErrors.providerEmail = 'Provider email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.providerEmail)) {
            newErrors.providerEmail = 'Please enter a valid email address';
        }

        if (!formData.providerNPI.trim()) {
            newErrors.providerNPI = 'Provider NPI is required';
        } else if (!/^\d{10}$/.test(formData.providerNPI.replace(/\s/g, ''))) {
            newErrors.providerNPI = 'NPI must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave({
                ...formData,
                careTeamMembers
            });
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleAddMember = () => {
        if (newMember.name && newMember.role && newMember.email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMember.email)) {
                alert('Please enter a valid email address');
                return;
            }

            const member: CareTeamMember = {
                id: Date.now().toString(),
                ...newMember
            };
            setCareTeamMembers(prev => [...prev, member]);
            setNewMember({ name: '', role: '', email: '' });
        }
    };

    const handleRemoveMember = (id: string) => {
        setCareTeamMembers(prev => prev.filter(m => m.id !== id));
    };

    const isFormValid = formData.providerName && formData.providerAddress && formData.providerPhone && formData.providerEmail && formData.providerNPI;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h2 className="text-3xl font-bold text-itera-blue-dark mb-2">Provider Profile</h2>
                <p className="text-gray-600">Complete your provider information to continue with the onboarding process</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
                {/* Provider Information Section */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">Provider Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        {/* Provider Name */}
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <HomeIcon className="w-4 h-4 text-itera-blue" />
                                Provider Name *
                            </label>
                            <input
                                type="text"
                                value={formData.providerName}
                                onChange={(e) => handleChange('providerName', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent transition-all ${errors.providerName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Enter provider or practice name"
                            />
                            {errors.providerName && (
                                <p className="mt-1 text-sm text-red-600">{errors.providerName}</p>
                            )}
                        </div>

                        {/* Provider Address */}
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPinIcon className="w-4 h-4 text-itera-blue" />
                                Provider Address *
                            </label>
                            <input
                                type="text"
                                value={formData.providerAddress}
                                onChange={(e) => handleChange('providerAddress', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent transition-all ${errors.providerAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Enter full address (street, city, state, zip)"
                            />
                            {errors.providerAddress && (
                                <p className="mt-1 text-sm text-red-600">{errors.providerAddress}</p>
                            )}
                        </div>

                        {/* Provider Phone */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="text-itera-blue">📞</span>
                                Provider Telephone *
                            </label>
                            <input
                                type="tel"
                                value={formData.providerPhone}
                                onChange={(e) => handleChange('providerPhone', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent transition-all ${errors.providerPhone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="(555) 123-4567"
                            />
                            {errors.providerPhone && (
                                <p className="mt-1 text-sm text-red-600">{errors.providerPhone}</p>
                            )}
                        </div>

                        {/* Provider Email */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <MailIcon className="w-4 h-4 text-itera-blue" />
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.providerEmail}
                                onChange={(e) => handleChange('providerEmail', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent transition-all ${errors.providerEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="provider@example.com"
                            />
                            {errors.providerEmail && (
                                <p className="mt-1 text-sm text-red-600">{errors.providerEmail}</p>
                            )}
                        </div>

                        {/* Provider NPI */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <span className="text-itera-blue">🏥</span>
                                Provider NPI (National Provider Identifier) *
                            </label>
                            <input
                                type="text"
                                value={formData.providerNPI}
                                onChange={(e) => handleChange('providerNPI', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent transition-all ${errors.providerNPI ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="1234567890 (10 digits)"
                                maxLength={10}
                            />
                            {errors.providerNPI && (
                                <p className="mt-1 text-sm text-red-600">{errors.providerNPI}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Care Team Section */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-itera-blue" />
                        Care Team Members (Optional)
                    </h3>

                    {/* Existing Members */}
                    {careTeamMembers.length > 0 && (
                        <div className="mb-6 space-y-3">
                            {careTeamMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800">{member.name}</p>
                                        <p className="text-sm text-gray-600">{member.role} • {member.email}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                                    >
                                        <Trash2Icon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add New Member Form */}
                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                        <p className="text-sm font-bold text-gray-700 mb-4">Add Care Team Member</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                value={newMember.name}
                                onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itera-blue focus:border-transparent"
                                placeholder="Full Name"
                            />
                            <input
                                type="text"
                                value={newMember.role}
                                onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itera-blue focus:border-transparent"
                                placeholder="Role (e.g., Care Coordinator)"
                            />
                            <input
                                type="email"
                                value={newMember.email}
                                onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itera-blue focus:border-transparent"
                                placeholder="Email"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddMember}
                            disabled={!newMember.name || !newMember.role || !newMember.email}
                            className="mt-4 flex items-center gap-2 px-4 py-2 bg-itera-blue text-white font-bold rounded-lg hover:bg-itera-blue-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <span className="text-xl">+</span>
                            Add Member
                        </button>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-bold mb-1">Why do we need this information?</p>
                        <p>This information will be used in your legal documents (BAA and Service Agreement) and for official communications. Your care team members will receive notifications and updates about patient care coordination.</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className="px-8 py-3 bg-itera-blue text-white font-bold rounded-xl shadow-lg hover:bg-itera-blue-dark transition-all transform hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        Save & Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProviderProfileView;

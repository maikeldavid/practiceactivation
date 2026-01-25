import React, { useState } from 'react';
import { UserIcon, MailIcon, CheckCircleIcon, MapPinIcon, PhoneCall, ShieldCheckIcon } from '../IconComponents';

interface UserProfileViewProps {
    initialData: {
        name: string;
        email: string;
        role: string;
        phone: string;
        address: string;
    };
    onSave: (data: { name: string; email: string; role: string; phone: string; address: string }) => void;
    onCancel?: () => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
        phone: initialData.phone,
        address: initialData.address,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up pb-10">
            <div>
                <h2 className="text-3xl font-bold text-itera-blue-dark mb-2">My Profile</h2>
                <p className="text-gray-600">Update your personal account information and contact details.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-itera-blue" />
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                            placeholder="Your full name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <ShieldCheckIcon className="w-4 h-4 text-itera-blue" />
                            Practice Role
                        </label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent transition-all"
                            placeholder="e.g. Practice Staff"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <MailIcon className="w-4 h-4 text-itera-blue" />
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                            placeholder="your.email@example.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <PhoneCall className="w-4 h-4 text-itera-blue" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent transition-all"
                            placeholder="(555) 000-0000"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4 text-itera-blue" />
                            Mailing Address
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent transition-all"
                            placeholder="Street, City, State, ZIP"
                        />
                    </div>


                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-bold mb-1">Account Security</p>
                        <p>Your personal information is used for portal notifications and secure access identification.</p>
                    </div>
                </div>

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
                        className="px-8 py-3 bg-itera-blue text-white font-bold rounded-xl shadow-lg hover:bg-itera-blue-dark transition-all transform hover:-translate-y-0.5"
                    >
                        Save Personal Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfileView;

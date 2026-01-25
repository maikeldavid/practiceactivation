
import React, { useState, FormEvent } from 'react';
import {
    PhoneCall,
    ClipboardListIcon,
    DollarSignIcon,
    RepeatIcon,
    CalendarIcon,
    CheckCircleIcon,
    UserPlusIcon,
    Edit3Icon,
    SaveIcon,
    XIcon,
    Trash2Icon
} from '../IconComponents';
import { ContactInfo } from '../../types';
import { DEFAULT_ROLES } from '../../constants';

interface TeamSettingsViewProps {
    roles: ContactInfo[];
    setRoles: React.Dispatch<React.SetStateAction<ContactInfo[]>>;
    onCancel?: () => void;
}

const TeamSettingsView: React.FC<TeamSettingsViewProps> = ({ roles, setRoles, onCancel }) => {
    const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
    const [newRole, setNewRole] = useState<ContactInfo | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    // Form state for the active edit/add
    const [activeForm, setActiveForm] = useState<ContactInfo>({ id: '', title: '', name: '', email: '', phone: '' });

    const startEditing = (role: ContactInfo) => {
        setEditingRoleId(role.id);
        setActiveForm({ ...role });
        setNewRole(null);
    };

    const cancelEditing = () => {
        setEditingRoleId(null);
        setNewRole(null);
    };

    const clearForm = () => {
        setActiveForm(prev => ({
            ...prev,
            name: '',
            email: '',
            phone: ''
        }));
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setActiveForm(prev => ({ ...prev, [name]: value }));
    };

    const validateEmail = (email: string) => {
        if (!email) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone: string) => {
        if (!phone) return true;
        // Basic phone validation (allowing digits, spaces, hyphens, parentheses)
        return /^[\d\s\-\(\)\+]{7,20}$/.test(phone);
    };

    const isEmailValid = validateEmail(activeForm.email);
    const isPhoneValid = validatePhone(activeForm.phone);

    const isDataEmpty = !activeForm.name && !activeForm.email && !activeForm.phone;
    const isFormValid = activeForm.title && (isDataEmpty || activeForm.name) && isEmailValid && isPhoneValid;

    const isRoleConfigured = (role: ContactInfo) => {
        return !!(role.name && role.email && role.phone && validateEmail(role.email) && validatePhone(role.phone));
    };

    const completedCount = roles.filter(isRoleConfigured).length;
    const totalCount = roles.length;

    const saveRole = () => {
        if (!isFormValid) return;
        if (newRole) {
            setRoles(prev => [...prev, { ...activeForm, id: Date.now().toString(), isCustom: true }]);
            setNewRole(null);
        } else {
            setRoles(prev => prev.map(r => r.id === editingRoleId ? activeForm : r));
            setEditingRoleId(null);
        }
    };

    const deleteRole = (id: string) => {
        setRoles(prev => prev.filter(r => r.id !== id));
    };

    const initiateAddRole = () => {
        const newEmptyRole = { id: 'temp', title: '', name: '', email: '', phone: '', isCustom: true };
        setNewRole(newEmptyRole);
        setActiveForm(newEmptyRole);
        setEditingRoleId(null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('Care Team Finalized:', roles);
        setIsComplete(true);
    };

    if (isComplete) {
        return (
            <div className="text-center bg-white p-12 rounded-lg border border-gray-200 animate-fade-in-up">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-itera-blue-dark mb-2">🎉 {completedCount} Roles Successfully Configured</h2>
                <p className="text-gray-600 mb-6">Your collaborative care setup for {completedCount} team members is ready. You can adjust any contact anytime.</p>
                <button
                    onClick={() => setIsComplete(false)}
                    className="bg-itera-blue text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors"
                >
                    View Team Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-itera-blue-dark">Care Team Setup</h2>
                    <p className="text-gray-500 mt-1">Define roles and contact information for your medical practice.</p>
                </div>
                <button
                    onClick={initiateAddRole}
                    className="flex items-center gap-2 bg-itera-blue-light text-itera-blue-dark font-semibold py-2 px-4 rounded-lg hover:bg-itera-blue hover:text-white transition-all transform hover:scale-105"
                >
                    <UserPlusIcon className="w-5 h-5" />
                    Add Custom Role
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Roles List */}
                <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {roles.map(role => (
                        <div
                            key={role.id}
                            onClick={() => startEditing(role)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${editingRoleId === role.id
                                ? 'border-itera-blue bg-itera-blue-light shadow-md'
                                : 'border-gray-100 bg-white hover:border-itera-blue/30 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`font-bold ${editingRoleId === role.id ? 'text-itera-blue-dark' : 'text-gray-800'}`}>
                                        {role.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {role.name || <span className="italic text-gray-400">Not assigned</span>}
                                    </p>
                                </div>
                                {role.isCustom && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteRole(role.id); }}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2Icon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {newRole && (
                        <div className="p-4 rounded-xl border-2 border-dashed border-itera-blue bg-itera-blue-light/30">
                            <h4 className="font-bold text-itera-blue">New Custom Role</h4>
                            <p className="text-sm text-gray-400 italic">Adding...</p>
                        </div>
                    )}
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    {(editingRoleId || newRole) ? (
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-itera-blue-dark flex items-center gap-2">
                                    {newRole ? <UserPlusIcon className="w-6 h-6" /> : <Edit3Icon className="w-6 h-6" />}
                                    {newRole ? 'Add New Role' : 'Edit Role Details'}
                                </h3>
                                <button
                                    onClick={cancelEditing}
                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <XIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={activeForm.title}
                                        onChange={handleFormChange}
                                        placeholder="e.g., Clinical Supervisor"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent outline-none transition-all"
                                    />
                                    {activeForm.description && (
                                        <p className="mt-2 text-sm text-itera-blue bg-itera-blue-light/20 p-3 rounded-lg border border-itera-blue-light/30">
                                            {activeForm.description}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={activeForm.name}
                                        onChange={handleFormChange}
                                        placeholder="e.g., Jane Smith"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={activeForm.email}
                                        onChange={handleFormChange}
                                        placeholder="jane@practice.com"
                                        className={`w-full px-4 py-3 bg-gray-50 border ${!isEmailValid ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-itera-blue'} rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                                    />
                                    {!isEmailValid && (
                                        <p className="mt-1 text-xs text-red-500">Please enter a valid email address.</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={activeForm.phone}
                                        onChange={handleFormChange}
                                        placeholder="(555) 000-0000"
                                        className={`w-full px-4 py-3 bg-gray-50 border ${!isPhoneValid ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-itera-blue'} rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all`}
                                    />
                                    {!isPhoneValid && (
                                        <p className="mt-1 text-xs text-red-500">Please enter a valid phone number.</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4">
                                <button
                                    onClick={saveRole}
                                    disabled={!isFormValid}
                                    className="flex-1 flex items-center justify-center gap-2 bg-itera-blue text-white font-bold py-4 rounded-xl shadow-lg hover:bg-itera-blue-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <SaveIcon className="w-5 h-5" />
                                    {newRole ? 'Add to Care Team' : 'Update Role'}
                                </button>
                                <button
                                    onClick={cancelEditing}
                                    className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={clearForm}
                                    className="px-6 py-4 bg-white text-gray-400 border border-gray-100 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-600 transition-all"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-12 rounded-2xl border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                <ClipboardListIcon className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-400 mb-2">Select a role to edit</h3>
                            <p className="text-gray-400 max-w-xs">
                                Select from the list on the left to update contact information or add a new role to your team.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Saved automatically
                    </div>
                    <p className="text-xs font-medium text-itera-blue-dark">
                        {completedCount} of {totalCount} roles configured
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-itera-orange text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-itera-orange-dark hover:scale-105 transition-all"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamSettingsView;
import React, { useState } from 'react';
import type { Role } from '../types';
import { XIcon, UsersIcon, Settings, UserIcon, MailIcon, Trash2Icon, PlusIcon, CalendarIcon, ShieldCheckIcon, CheckIcon, PencilIcon } from './IconComponents';
import AddUserModal from './activation-portal/AddUserModal';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: { name: string; email: string; practiceName: string };
    assignmentRules: ZohoAssignmentRule[];
    onRulesChange: (rules: ZohoAssignmentRule[]) => void;
    enableCustomRules: boolean;
    users: any[];
    onUsersChange: (users: any[]) => void;
    roles: Role[];
    onRolesChange: (roles: Role[]) => void;
}

type SettingsTab = 'users' | 'roles' | 'crm' | 'availability' | 'general';

interface ZohoAssignmentRule {
    id: string;
    field: 'NPI' | 'Practice Name' | 'Zip Code' | 'Always';
    operator: 'equals' | 'contains' | 'starts with';
    value: string;
    assignTo: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    personalPhone?: string;
    iteraPhone?: string;
    availability?: { day: string; startTime: string; endTime: string }[];
}



const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    currentUser,
    assignmentRules,
    onRulesChange,
    enableCustomRules,
    onEnableRulesChange,
    users,
    onUsersChange,
    roles,
    onRolesChange
}) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('users');
    const [selectedCMId, setSelectedCMId] = useState<string | null>(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    const handleSaveSchedule = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSaveSuccess(true);
            setTimeout(() => setShowSaveSuccess(false), 3000);
        }, 800);
    };

    const handleAddUser = (userData: { name: string; email: string; role: string; personalPhone: string; iteraPhone: string }) => {
        const newUser: User = {
            id: (users.length + 1).toString(),
            name: userData.name,
            email: userData.email,
            role: userData.role,
            personalPhone: userData.personalPhone,
            iteraPhone: userData.iteraPhone,
            status: 'active'
        };
        onUsersChange([...users, newUser]);
        setIsAddUserModalOpen(false);
    };

    const handleDeleteUser = (id: string) => {
        if (confirm('Are you sure you want to remove this user?')) {
            onUsersChange(users.filter(u => u.id !== id));
        }
    };

    const setUsers = (updater: (prev: User[]) => User[]) => {
        const newUsers = updater(users);
        onUsersChange(newUsers);
    };



    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [roleForm, setRoleForm] = useState<{ name: string; permissions: string[] }>({ name: '', permissions: [] });

    const AVAILABLE_PERMISSIONS = [
        'All Access',
        'Manage Users',
        'Manage Settings',
        'View Patients',
        'Enroll Patients',
        'Schedule Appointments',
        'Log Calls',
        'View Reports',
        'Approve Enrollments',
        'Edit Care Plans',
        'Daily Monitoring'
    ];

    const handleSaveRole = () => {
        if (!roleForm.name) return;

        if (editingRole) {
            onRolesChange(roles.map(r => r.id === editingRole.id ? { ...r, name: roleForm.name, permissions: roleForm.permissions } : r));
        } else {
            const newRole: Role = {
                id: Date.now().toString(),
                name: roleForm.name,
                permissions: roleForm.permissions,
                userCount: 0
            };
            onRolesChange([...roles, newRole]);
        }
        setIsRoleModalOpen(false);
        setEditingRole(null);
        setRoleForm({ name: '', permissions: [] });
    };

    const handleEditRole = (role: Role) => {
        setEditingRole(role);
        setRoleForm({ name: role.name, permissions: role.permissions });
        setIsRoleModalOpen(true);
    };

    const handleDeleteRole = (id: string) => {
        const role = roles.find(r => r.id === id);
        if (role && role.userCount > 0) {
            alert(`Cannot delete role "${role.name}" because it has ${role.userCount} active users.`);
            return;
        }
        if (confirm('Are you sure you want to delete this role?')) {
            onRolesChange(roles.filter(r => r.id !== id));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-itera-blue-dark text-white p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Settings className="w-7 h-7" />
                        <div>
                            <h2 className="text-2xl font-bold">Portal Settings</h2>
                            <p className="text-blue-200 text-sm">{currentUser.practiceName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'users'
                                    ? 'bg-itera-blue text-white'
                                    : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <UsersIcon className="w-5 h-5" />
                                User Management
                            </button>
                            <button
                                onClick={() => setActiveTab('roles')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'roles'
                                    ? 'bg-itera-blue text-white'
                                    : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <UsersIcon className="w-5 h-5" />
                                Roles & Permissions
                            </button>
                            <button
                                onClick={() => setActiveTab('crm')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'crm'
                                    ? 'bg-itera-blue text-white'
                                    : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Settings className="w-5 h-5" />
                                Zoho CRM
                            </button>
                            <button
                                onClick={() => setActiveTab('availability')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'availability'
                                    ? 'bg-itera-blue text-white'
                                    : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <CalendarIcon className="w-5 h-5" />
                                CM Availability
                            </button>
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'general'
                                    ? 'bg-itera-blue text-white'
                                    : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Settings className="w-5 h-5" />
                                General Settings
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {activeTab === 'users' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
                                        <p className="text-gray-600 mt-1">Manage team members and their access</p>
                                    </div>
                                    <button
                                        onClick={() => setIsAddUserModalOpen(true)}
                                        className="flex items-center gap-2 bg-itera-blue text-white px-4 py-2 rounded-lg hover:bg-itera-blue-dark transition-colors font-medium"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Add User
                                    </button>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">User</th>
                                                <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">Role</th>
                                                <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                                                <th className="text-right px-6 py-4 text-sm font-bold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {users.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-itera-blue/10 rounded-full flex items-center justify-center">
                                                                <UserIcon className="w-5 h-5 text-itera-blue" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {user.status === 'active' ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center gap-2">
                                                            {user.role === 'Care Manager' && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedCMId(user.id);
                                                                        setActiveTab('availability');
                                                                    }}
                                                                    className="text-itera-blue hover:text-itera-blue-dark transition-colors p-2"
                                                                    title="Plan Availability"
                                                                >
                                                                    <CalendarIcon className="w-5 h-5" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                                            >
                                                                <Trash2Icon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'roles' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Roles & Permissions</h3>
                                        <p className="text-gray-600 mt-1">Define roles and assign access levels</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingRole(null);
                                            setRoleForm({ name: '', permissions: [] });
                                            setIsRoleModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 bg-itera-blue text-white px-4 py-2 rounded-lg hover:bg-itera-blue-dark transition-colors font-medium"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        Create Role
                                    </button>
                                </div>

                                <div className="grid gap-4">
                                    {roles.map((role) => (
                                        <div key={role.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="text-lg font-bold text-gray-900">{role.name}</h4>
                                                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                                                            {role.userCount} Users
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {role.permissions.slice(0, 5).map(perm => (
                                                            <span key={perm} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 font-medium">
                                                                {perm}
                                                            </span>
                                                        ))}
                                                        {role.permissions.length > 5 && (
                                                            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded border border-gray-100 font-medium">
                                                                +{role.permissions.length - 5} more
                                                            </span>
                                                        )}
                                                        {role.permissions.length === 0 && (
                                                            <span className="text-gray-400 text-xs italic">No permissions assigned</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditRole(role)}
                                                        className="p-2 text-gray-400 hover:text-itera-blue hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRole(role.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2Icon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'crm' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Zoho CRM Assignment</h3>
                                        <p className="text-gray-600 mt-1">Configure how practice records are assigned to Zoho users</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-500">Enable Rules</span>
                                        <button
                                            onClick={() => onEnableRulesChange(!enableCustomRules)}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${enableCustomRules ? 'bg-itera-blue' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${enableCustomRules ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                                    <div className="flex gap-4">
                                        <div className="p-3 bg-white rounded-lg shadow-sm">
                                            <UsersIcon className="w-6 h-6 text-itera-blue" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-itera-blue-dark">Current Logic</h4>
                                            <p className="text-sm text-blue-800/80 mt-1">
                                                {enableCustomRules
                                                    ? "Records are assigned based on the conditional rules below. If no rule matches, the Default Owner is used."
                                                    : "All records are currently assigned to the primary account owner (Maikel)."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {enableCustomRules && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-gray-800">Assignment Rules</h4>
                                            <button
                                                onClick={() => {
                                                    const newRule: ZohoAssignmentRule = {
                                                        id: Date.now().toString(),
                                                        field: 'NPI',
                                                        operator: 'equals',
                                                        value: '',
                                                        assignTo: 'Select User...'
                                                    };
                                                    onRulesChange([...assignmentRules, newRule]);
                                                }}
                                                className="text-itera-blue hover:text-itera-blue-dark font-medium text-sm flex items-center gap-1"
                                            >
                                                <span>+</span> Add New Rule
                                            </button>
                                        </div>

                                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                            <table className="w-full">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Criteria (Field)</th>
                                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Operator</th>
                                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
                                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assign To</th>
                                                        <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {assignmentRules.map((rule) => (
                                                        <tr key={rule.id} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <select className="bg-transparent border-none text-sm font-medium text-gray-900 focus:ring-0 cursor-pointer">
                                                                    <option>{rule.field}</option>
                                                                    <option>NPI</option>
                                                                    <option>Practice Name</option>
                                                                    <option>Zip Code</option>
                                                                    <option>Always</option>
                                                                </select>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <select className="bg-transparent border-none text-sm text-gray-600 focus:ring-0 cursor-pointer">
                                                                    <option>{rule.operator}</option>
                                                                    <option>equals</option>
                                                                    <option>contains</option>
                                                                    <option>starts with</option>
                                                                </select>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <input
                                                                    type="text"
                                                                    defaultValue={rule.value}
                                                                    className="bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm focus:ring-1 focus:ring-itera-blue w-full"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <select className="bg-transparent border-none text-sm font-bold text-itera-blue focus:ring-0 cursor-pointer">
                                                                    <option>{rule.assignTo}</option>
                                                                    <option>Maikel (Admin)</option>
                                                                    <option>Florida Sales Team</option>
                                                                    <option>New User A</option>
                                                                    <option>New User B</option>
                                                                </select>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button
                                                                    onClick={() => onRulesChange(assignmentRules.filter(r => r.id !== rule.id))}
                                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2Icon className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'availability' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Care Manager Availability</h3>
                                        <p className="text-gray-600 mt-1">Configure weekly schedules for your Care Managers</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* CM List */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Care Managers</h4>
                                        {users.filter(u => u.role === 'Care Manager').length === 0 ? (
                                            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                                                No Care Managers found. Add a user with the CM role first.
                                            </div>
                                        ) : (
                                            users.filter(u => u.role === 'Care Manager').map(cm => (
                                                <button
                                                    key={cm.id}
                                                    onClick={() => setSelectedCMId(cm.id)}
                                                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCMId === cm.id
                                                        ? 'border-itera-blue bg-blue-50 shadow-sm'
                                                        : 'border-gray-200 bg-white hover:border-itera-blue/30'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${selectedCMId === cm.id ? 'bg-itera-blue text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                            {cm.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <p className={`font-bold ${selectedCMId === cm.id ? 'text-itera-blue-dark' : 'text-gray-800'}`}>{cm.name}</p>
                                                            <p className="text-xs text-gray-500">{cm.email}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>

                                    {/* Availability Editor */}
                                    <div className="lg:col-span-2">
                                        {selectedCMId ? (
                                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                                    <h4 className="font-bold text-gray-900">Configure Schedule: {users.find(u => u.id === selectedCMId)?.name}</h4>
                                                    <button
                                                        onClick={() => {
                                                            const cm = users.find(u => u.id === selectedCMId);
                                                            if (!cm) return;
                                                            const newSlot = { day: 'Monday', startTime: '09:00', endTime: '17:00' };
                                                            setUsers(prev => prev.map(u => u.id === selectedCMId ? { ...u, availability: [...(u.availability || []), newSlot] } : u));
                                                        }}
                                                        className="text-itera-blue hover:text-itera-blue-dark font-bold text-sm flex items-center gap-1"
                                                    >
                                                        <PlusIcon className="w-4 h-4" /> Add Slot
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    {(users.find(u => u.id === selectedCMId)?.availability || []).length === 0 ? (
                                                        <div className="p-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                                            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                            <p className="text-gray-400 font-medium">No availability slots defined for this CM.</p>
                                                            <p className="text-xs text-gray-400 mt-1">They won't be available for new patient appointments.</p>
                                                        </div>
                                                    ) : (
                                                        users.find(u => u.id === selectedCMId)?.availability?.map((slot, idx) => (
                                                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl group transition-all hover:bg-white hover:border hover:border-gray-200">
                                                                <select
                                                                    value={slot.day}
                                                                    onChange={(e) => {
                                                                        setUsers(prev => prev.map(u => u.id === selectedCMId ? {
                                                                            ...u,
                                                                            availability: u.availability?.map((s, i) => i === idx ? { ...s, day: e.target.value } : s)
                                                                        } : u));
                                                                    }}
                                                                    className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-itera-blue"
                                                                >
                                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                                                        <option key={d} value={d}>{d}</option>
                                                                    ))}
                                                                </select>
                                                                <div className="flex items-center gap-3">
                                                                    <input
                                                                        type="time"
                                                                        value={slot.startTime}
                                                                        onChange={(e) => {
                                                                            setUsers(prev => prev.map(u => u.id === selectedCMId ? {
                                                                                ...u,
                                                                                availability: u.availability?.map((s, i) => i === idx ? { ...s, startTime: e.target.value } : s)
                                                                            } : u));
                                                                        }}
                                                                        className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-itera-blue"
                                                                    />
                                                                    <span className="text-gray-400 font-medium">to</span>
                                                                    <input
                                                                        type="time"
                                                                        value={slot.endTime}
                                                                        onChange={(e) => {
                                                                            setUsers(prev => prev.map(u => u.id === selectedCMId ? {
                                                                                ...u,
                                                                                availability: u.availability?.map((s, i) => i === idx ? { ...s, endTime: e.target.value } : s)
                                                                            } : u));
                                                                        }}
                                                                        className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-itera-blue"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        setUsers(prev => prev.map(u => u.id === selectedCMId ? {
                                                                            ...u,
                                                                            availability: u.availability?.filter((_, i) => i !== idx)
                                                                        } : u));
                                                                    }}
                                                                    className="ml-auto p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                >
                                                                    <Trash2Icon className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end items-center gap-4">
                                                    {showSaveSuccess && (
                                                        <div className="text-sm font-bold text-green-500 animate-in fade-in slide-in-from-right-4">
                                                            ✓ Schedule Saved Successfully
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={handleSaveSchedule}
                                                        disabled={isSaving}
                                                        className={`flex items-center gap-2 bg-itera-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-itera-blue/20 hover:bg-itera-blue-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        {isSaving ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            'Save Schedule'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center text-center p-12">
                                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                                    <CalendarIcon className="w-10 h-10 text-gray-300" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-400 mb-2">Select a Care Manager</h3>
                                                <p className="text-gray-400 max-w-xs">
                                                    Choose a CM from the list on the left to configure their working hours and availability.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'general' && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h3>

                                <div className="space-y-6">
                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-4">Practice Information</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Practice Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={currentUser.practiceName}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itera-blue focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                                                <input
                                                    type="email"
                                                    defaultValue={currentUser.email}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itera-blue focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-4">Notifications</h4>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3">
                                                <input type="checkbox" defaultChecked className="w-5 h-5 text-itera-blue rounded focus:ring-itera-blue" />
                                                <span className="text-gray-700">Email notifications for new patients</span>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <input type="checkbox" defaultChecked className="w-5 h-5 text-itera-blue rounded focus:ring-itera-blue" />
                                                <span className="text-gray-700">Monthly billing reports</span>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <input type="checkbox" className="w-5 h-5 text-itera-blue rounded focus:ring-itera-blue" />
                                                <span className="text-gray-700">Weekly performance summaries</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                            Cancel
                                        </button>
                                        <button className="px-6 py-2 bg-itera-blue text-white rounded-lg hover:bg-itera-blue-dark transition-colors font-medium">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isAddUserModalOpen && (
                <AddUserModal
                    onClose={() => setIsAddUserModalOpen(false)}
                    onSave={handleAddUser}
                />
            )}

            {isRoleModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{editingRole ? 'Edit Role' : 'Create New Role'}</h3>
                            <button onClick={() => setIsRoleModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Role Name</label>
                                <input
                                    type="text"
                                    value={roleForm.name}
                                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-itera-blue outline-none"
                                    placeholder="e.g. Office Manager"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Permissions</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                    {AVAILABLE_PERMISSIONS.map(perm => (
                                        <label key={perm} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${roleForm.permissions.includes(perm) ? 'bg-itera-blue border-itera-blue' : 'border-gray-300 bg-white'}`}>
                                                {roleForm.permissions.includes(perm) && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={roleForm.permissions.includes(perm)}
                                                onChange={() => {
                                                    setRoleForm(prev => {
                                                        const newPerms = prev.permissions.includes(perm)
                                                            ? prev.permissions.filter(p => p !== perm)
                                                            : [...prev.permissions, perm];
                                                        return { ...prev, permissions: newPerms };
                                                    });
                                                }}
                                            />
                                            <span className="text-sm text-gray-700">{perm}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-auto">
                            <button
                                onClick={() => setIsRoleModalOpen(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveRole}
                                disabled={!roleForm.name}
                                className="px-6 py-2 bg-itera-blue text-white font-bold rounded-lg hover:bg-itera-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {editingRole ? 'Update Role' : 'Create Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsModal;

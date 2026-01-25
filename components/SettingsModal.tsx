import React, { useState } from 'react';
import { XIcon, UsersIcon, Settings, UserIcon, MailIcon, Trash2Icon } from './IconComponents';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: { name: string; email: string; practiceName: string };
    assignmentRules: ZohoAssignmentRule[];
    onRulesChange: (rules: ZohoAssignmentRule[]) => void;
    enableCustomRules: boolean;
    onEnableRulesChange: (enabled: boolean) => void;
}

type SettingsTab = 'users' | 'roles' | 'crm' | 'general';

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
}

interface Role {
    id: string;
    name: string;
    permissions: string[];
    userCount: number;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    currentUser,
    assignmentRules,
    onRulesChange,
    enableCustomRules,
    onEnableRulesChange
}) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('users');
    const [users, setUsers] = useState<User[]>([
        { id: '1', name: 'Admin User', email: 'admin@itera.health', role: 'Admin', status: 'active' },
        { id: '2', name: 'Call Center Agent', email: 'callcenter@itera.health', role: 'Call Center', status: 'active' },
        { id: '3', name: 'Practice Staff', email: 'practice@itera.health', role: 'Practice Staff', status: 'active' }
    ]);

    const [roles] = useState<Role[]>([
        { id: '1', name: 'Admin', permissions: ['All Access', 'Manage Users', 'Manage Settings'], userCount: 1 },
        { id: '2', name: 'Call Center', permissions: ['View Patients', 'Enroll Patients', 'Schedule Appointments', 'Log Calls'], userCount: 1 },
        { id: '3', name: 'Practice Staff', permissions: ['View Patients', 'View Reports', 'Approve Enrollments'], userCount: 1 },
        { id: '4', name: 'Physician', permissions: ['View Patients', 'Edit Care Plans', 'View Reports'], userCount: 0 },
        { id: '5', name: 'Care Coordinator', permissions: ['View Patients', 'Edit Care Plans'], userCount: 0 }
    ]);

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
                                    <button className="flex items-center gap-2 bg-itera-blue text-white px-4 py-2 rounded-lg hover:bg-itera-blue-dark transition-colors font-medium">
                                        <span>+</span>
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
                                                        <button className="text-gray-400 hover:text-red-600 transition-colors p-2">
                                                            <Trash2Icon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
        </div>
    );
};

export default SettingsModal;

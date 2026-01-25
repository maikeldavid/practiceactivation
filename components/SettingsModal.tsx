import React, { useState } from 'react';
import { XIcon, UsersIcon, Settings, UserIcon, MailIcon, Trash2Icon } from './IconComponents';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: { name: string; email: string; practiceName: string };
}

type SettingsTab = 'users' | 'roles' | 'general';

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

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentUser }) => {
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

                        {activeTab === 'roles' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Roles & Permissions</h3>
                                        <p className="text-gray-600 mt-1">Define access levels and permissions</p>
                                    </div>
                                    <button className="flex items-center gap-2 bg-itera-blue text-white px-4 py-2 rounded-lg hover:bg-itera-blue-dark transition-colors font-medium">
                                        <span>+</span>
                                        Create Role
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {roles.map((role) => (
                                        <div key={role.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900">{role.name}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">{role.userCount} user{role.userCount !== 1 ? 's' : ''}</p>
                                                </div>
                                                <UsersIcon className="w-6 h-6 text-itera-blue" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-700">Permissions:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {role.permissions.map((permission, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                            {permission}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
        </div>
    );
};

export default SettingsModal;

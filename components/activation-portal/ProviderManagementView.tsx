import React, { useState } from 'react';
import { SearchIcon, PlusIcon, Filter, MoreHorizontalIcon, MailIcon, PhoneCall, MapPinIcon, StethoscopeIcon } from '../IconComponents';
import type { RegisteredProvider } from '../../types';

interface ProviderManagementViewProps {
    providers: RegisteredProvider[];
    onAddProvider: (provider: Omit<RegisteredProvider, 'id'>) => void;
}

const ProviderManagementView: React.FC<ProviderManagementViewProps> = ({ providers, onAddProvider }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredProviders = providers.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.practiceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Registered Providers</h2>
                    <p className="text-gray-500 text-sm">Manage healthcare practices and physicians on the platform.</p>
                </div>
                <button
                    onClick={() => {/* TODO: Open AddProviderModal */ }}
                    className="flex items-center gap-2 bg-itera-blue text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-itera-blue/20 hover:bg-itera-blue-dark transition-all active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Provider
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Providers</p>
                    <p className="text-3xl font-bold text-gray-800">{providers.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-green-500 uppercase tracking-widest mb-1">Active</p>
                    <p className="text-3xl font-bold text-gray-800">{providers.filter(p => p.status === 'Active').length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-1">Pending</p>
                    <p className="text-3xl font-bold text-gray-800">{providers.filter(p => p.status === 'Pending').length}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, practice or email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-itera-blue"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Provider List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Provider / Practice</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">NPI</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Registration Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProviders.map(provider => (
                            <tr key={provider.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-itera-blue/10 rounded-xl flex items-center justify-center text-itera-blue">
                                            <StethoscopeIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{provider.name}</p>
                                            <p className="text-xs text-gray-500 font-medium">{provider.practiceName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                    {provider.npi || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(provider.registrationDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${provider.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            provider.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {provider.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-gray-400 hover:text-itera-blue hover:bg-white rounded-lg transition-all shadow-sm">
                                        <MoreHorizontalIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProviderManagementView;

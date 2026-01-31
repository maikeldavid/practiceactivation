
import React, { useState } from 'react';
import { DatabaseIcon, ShieldCheckIcon, SaveIcon, XIcon, CheckCircleIcon, ActivityIcon, AlertCircleIcon } from '../IconComponents';
import type { EHRConfig } from '../../types';

interface EHRAccessViewProps {
    config: EHRConfig | null;
    onSave: (config: EHRConfig) => void;
    onCancel: () => void;
}

const EHR_SYSTEMS = [
    'Epic', 'Cerner', 'Athenahealth', 'eClinicalWorks', 'NextGen Healthcare', 'Allscripts', 'DrChrono',
    'Meditech', 'Greenway Health', 'Practice Fusion', 'AdvancedMD', 'CareCloud', 'Kareo',
    'ECW (eClinicalWorks)', 'Centricity (GE Healthcare)', 'CPSI / TruBridge', 'Epic Community Connect',
    'RXNT', 'PrognoCIS', 'OpenEMR', 'Other'
];

const EHRAccessView: React.FC<EHRAccessViewProps> = ({ config, onSave, onCancel }) => {
    const [form, setForm] = useState<EHRConfig>(config || { ehrSystem: '', username: '', password: '', loginUrl: '' });
    const [manualEhrName, setManualEhrName] = useState('');



    const handleSave = () => {
        const finalEhrSystem = form.ehrSystem === 'Other' ? manualEhrName : form.ehrSystem;
        onSave({ ...form, ehrSystem: finalEhrSystem, lastConnected: new Date().toISOString() });
    };

    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm animate-fade-in-up max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-bold text-itera-blue-dark flex items-center gap-3">
                    <DatabaseIcon className="w-8 h-8 text-itera-blue" />
                    EHR Access & Security Setup
                </h3>
                <button
                    onClick={onCancel}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">EHR System</label>
                    <select
                        value={form.ehrSystem}
                        onChange={(e) => setForm({ ...form, ehrSystem: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent outline-none transition-all"
                    >
                        <option value="">Select your EHR system</option>
                        {EHR_SYSTEMS.map(sys => <option key={sys} value={sys}>{sys}</option>)}
                    </select>
                    {form.ehrSystem === 'Other' && (
                        <input
                            type="text"
                            value={manualEhrName}
                            onChange={(e) => setManualEhrName(e.target.value)}
                            className="mt-3 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent outline-none transition-all"
                            placeholder="Enter your EHR system name"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">EHR Login URL</label>
                    <input
                        type="url"
                        value={form.loginUrl || ''}
                        onChange={(e) => setForm({ ...form, loginUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent outline-none transition-all"
                        placeholder="https://ehr.example.com/login"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Username / API Key</label>
                        <input
                            type="text"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent outline-none transition-all"
                            placeholder="Provider ID or Username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password / Secret</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="bg-itera-blue-light/20 p-4 rounded-xl border border-itera-blue-light/30 flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-itera-blue mt-0.5" />
                    <p className="text-xs text-itera-blue-dark leading-relaxed">
                        Credentials are encrypted and used solely for authorizing access to eligibility data. ITERA HEALTH complies with HIPAA and SOC 2 security standards.
                    </p>
                </div>


            </div>

            <div className="mt-10 flex gap-4 border-t border-gray-100 pt-8">
                <button
                    onClick={handleSave}
                    disabled={!form.ehrSystem || !form.username || !form.loginUrl || (form.ehrSystem === 'Other' && !manualEhrName)}
                    className="flex-1 flex items-center justify-center gap-2 bg-itera-blue text-white font-bold py-4 rounded-xl shadow-lg hover:bg-itera-blue-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SaveIcon className="w-5 h-5" />
                    Save & Continue
                </button>
                <button
                    onClick={onCancel}
                    className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EHRAccessView;

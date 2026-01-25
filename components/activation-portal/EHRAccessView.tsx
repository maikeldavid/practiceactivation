
import React, { useState } from 'react';
import { DatabaseIcon, ShieldCheckIcon, SaveIcon, XIcon, CheckCircleIcon, ActivityIcon, AlertCircleIcon } from '../IconComponents';
import type { EHRConfig } from '../../types';

interface EHRAccessViewProps {
    config: EHRConfig | null;
    onSave: (config: EHRConfig) => void;
    onCancel: () => void;
}

const EHR_SYSTEMS = [
    'Epic', 'Cerner', 'Athenahealth', 'eClinicalWorks', 'NextGen Healthcare', 'Allscripts', 'DrChrono'
];

const EHRAccessView: React.FC<EHRAccessViewProps> = ({ config, onSave, onCancel }) => {
    const [form, setForm] = useState<EHRConfig>(config || { ehrSystem: '', username: '', password: '' });
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

    const handleTestConnection = () => {
        setIsTesting(true);
        setTestResult(null);
        // Mock connection test
        setTimeout(() => {
            setIsTesting(false);
            setTestResult('success');
        }, 1500);
    };

    const handleSave = () => {
        onSave({ ...form, lastConnected: new Date().toISOString() });
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

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={handleTestConnection}
                        disabled={isTesting || !form.ehrSystem || !form.username}
                        className="flex-1 flex items-center justify-center gap-2 bg-white text-itera-blue border border-itera-blue font-bold py-3 rounded-xl hover:bg-itera-blue-light transition-all disabled:opacity-50"
                    >
                        {isTesting ? (
                            <ActivityIcon className="w-5 h-5 animate-spin" />
                        ) : (
                            <ActivityIcon className="w-5 h-5" />
                        )}
                        {isTesting ? 'Verifying...' : 'Test Connection'}
                    </button>
                </div>

                {testResult === 'success' && (
                    <div className="p-5 bg-green-50 border border-green-200 rounded-xl animate-fade-in-up">
                        <div className="flex items-center gap-3 text-green-700 font-bold mb-2">
                            <CheckCircleIcon className="w-5 h-5" />
                            Connection Successful
                        </div>
                        <p className="text-sm text-green-600">
                            System verified. <strong>124 patients</strong> found eligible for Digital Care Management in your {form.ehrSystem} dashboard.
                        </p>
                    </div>
                )}

                {testResult === 'error' && (
                    <div className="p-5 bg-red-50 border border-red-200 rounded-xl animate-fade-in-up">
                        <div className="flex items-center gap-3 text-red-700 font-bold mb-2">
                            <AlertCircleIcon className="w-5 h-5" />
                            Connection Failed
                        </div>
                        <p className="text-sm text-red-600">
                            Could not verify credentials. Please check your username and password.
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-10 flex gap-4 border-t border-gray-100 pt-8">
                <button
                    onClick={handleSave}
                    disabled={testResult !== 'success'}
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

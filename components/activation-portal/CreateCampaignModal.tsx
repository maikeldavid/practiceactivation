import React, { useState, useMemo } from 'react';
import { XIcon, SaveIcon } from '../IconComponents';
import type { Campaign, MockPatient, PatientStatus } from '../../types';

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'stats'>) => void;
    editingCampaign?: Campaign | null;
    patients: MockPatient[];
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingCampaign,
    patients
}) => {
    const [name, setName] = useState(editingCampaign?.name || '');
    const [type, setType] = useState<'call' | 'email' | 'sms'>(editingCampaign?.type || 'call');
    const [status, setStatus] = useState<Campaign['status']>(editingCampaign?.status || 'draft');
    const [smsTemplate, setSmsTemplate] = useState(editingCampaign?.content?.smsTemplate || '');
    const [selectedStatuses, setSelectedStatuses] = useState<PatientStatus[]>(
        editingCampaign?.targetAudience.statusFilter || []
    );
    const [selectedConditions, setSelectedConditions] = useState<string[]>(
        editingCampaign?.targetAudience.conditionFilter || []
    );
    const [startDate, setStartDate] = useState(
        editingCampaign?.schedule?.startDate || new Date().toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(editingCampaign?.schedule?.endDate || '');

    const targetCount = useMemo(() => {
        return patients.filter(p => {
            if (selectedStatuses.length > 0 && !selectedStatuses.includes(p.status)) {
                return false;
            }
            if (selectedConditions.length > 0) {
                const hasCondition = p.chronicConditions?.some(c => selectedConditions.includes(c));
                if (!hasCondition) return false;
            }
            return true;
        }).length;
    }, [patients, selectedStatuses, selectedConditions]);

    const handleSave = () => {
        if (!name.trim()) return;

        const campaign: Omit<Campaign, 'id' | 'createdAt' | 'stats'> = {
            name: name.trim(),
            type,
            status,
            targetAudience: {
                statusFilter: selectedStatuses.length > 0 ? selectedStatuses : undefined,
                conditionFilter: selectedConditions.length > 0 ? selectedConditions : undefined
            },
            schedule: {
                startDate,
                endDate: endDate || undefined
            },
            content: type === 'sms' ? {
                smsTemplate: smsTemplate || undefined
            } : undefined,
            createdBy: 'Current User'
        };

        onSave(campaign);
        handleClose();
    };

    const handleClose = () => {
        setName('');
        setType('call');
        setStatus('draft');
        setSelectedStatuses([]);
        setSelectedConditions([]);
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate('');
        setSmsTemplate('');
        onClose();
    };

    const statusOptions: PatientStatus[] = [
        'Approved',
        'Active',
        'Outreach - 1st Attempt',
        'Outreach - 2nd Attempt',
        'Pending Approval'
    ];

    const toggleStatus = (stat: PatientStatus) => {
        if (selectedStatuses.includes(stat)) {
            setSelectedStatuses(selectedStatuses.filter(s => s !== stat));
        } else {
            setSelectedStatuses([...selectedStatuses, stat]);
        }
    };

    const conditionOptions = [
        'Diabetes',
        'Hypertension',
        'Heart Disease',
        'COPD',
        'Asthma',
        'Arthritis',
        'CKD'
    ];

    const toggleCondition = (condition: string) => {
        if (selectedConditions.includes(condition)) {
            setSelectedConditions(selectedConditions.filter(c => c !== condition));
        } else {
            setSelectedConditions([...selectedConditions, condition]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up">
                <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-itera-blue-dark">
                        {editingCampaign ? 'Edit Campaign' : 'New Campaign'}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
                    {/* Campaign Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Campaign Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., January CCM Outreach"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none"
                        />
                    </div>

                    {/* Campaign Type */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Campaign Type
                        </label>
                        <div className="flex gap-4">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value="call"
                                    checked={type === 'call'}
                                    onChange={(e) => setType(e.target.value as 'call')}
                                    className="sr-only peer"
                                />
                                <div className="px-4 py-3 border-2 border-gray-200 rounded-xl text-center font-bold peer-checked:border-itera-blue peer-checked:bg-itera-blue/5 peer-checked:text-itera-blue transition-all">
                                    📞 Call Campaign
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value="sms"
                                    checked={type === 'sms'}
                                    onChange={(e) => setType(e.target.value as 'sms')}
                                    className="sr-only peer"
                                />
                                <div className="px-4 py-3 border-2 border-gray-200 rounded-xl text-center font-bold peer-checked:border-itera-blue peer-checked:bg-itera-blue/5 peer-checked:text-itera-blue transition-all">
                                    💬 SMS Campaign
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value="email"
                                    checked={type === 'email'}
                                    onChange={(e) => setType(e.target.value as 'email')}
                                    className="sr-only peer"
                                />
                                <div className="px-4 py-3 border-2 border-gray-200 rounded-xl text-center font-bold peer-checked:border-itera-blue peer-checked:bg-itera-blue/5 peer-checked:text-itera-blue transition-all">
                                    📧 Email Campaign
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* SMS Template (only for SMS campaigns) */}
                    {type === 'sms' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                SMS Message Template
                            </label>
                            <textarea
                                value={smsTemplate}
                                onChange={(e) => setSmsTemplate(e.target.value)}
                                placeholder="Hello {patientName}, this is your care team from {practiceName}. We'd like to schedule an appointment..." rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none resize-none"
                            />
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500">
                                    Variables: {'{patientName}'}, {'{practiceName}'}, {'{appointmentDate}'}
                                </p>
                                <p className={`text-xs font-bold ${smsTemplate.length > 160 ? 'text-orange-600' : 'text-gray-500'
                                    }`}>
                                    {smsTemplate.length}/160 chars {smsTemplate.length > 160 && `(${Math.ceil(smsTemplate.length / 160)} messages)`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Campaign Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Campaign['status'])}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none"
                        >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Target Audience */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Target Audience (Patient Status)
                        </label>
                        <div className="space-y-2">
                            {statusOptions.map(stat => (
                                <label key={stat} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedStatuses.includes(stat)}
                                        onChange={() => toggleStatus(stat)}
                                        className="w-4 h-4 text-itera-blue border-gray-300 rounded focus:ring-itera-blue"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-itera-blue transition-colors">
                                        {stat}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Leave empty to target all patients
                        </p>
                    </div>

                    {/* Target by Chronic Conditions */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Target by Chronic Conditions
                        </label>
                        <div className="space-y-2">
                            {conditionOptions.map(condition => (
                                <label key={condition} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedConditions.includes(condition)}
                                        onChange={() => toggleCondition(condition)}
                                        className="w-4 h-4 text-itera-blue border-gray-300 rounded focus:ring-itera-blue"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-itera-blue transition-colors">
                                        {condition}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Leave empty to target all conditions
                        </p>
                    </div>

                    {/* Schedule */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                End Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-itera-blue outline-none"
                            />
                        </div>
                    </div>

                    {/* Target Preview */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm font-bold text-blue-900 mb-1">Target Audience Preview</p>
                        <p className="text-2xl font-bold text-blue-600">{targetCount}</p>
                        <p className="text-xs text-blue-700">patients will be targeted</p>
                    </div>
                </div>

                <div className="px-8 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className="px-6 py-2.5 bg-itera-blue text-white font-bold rounded-xl hover:bg-itera-blue-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <SaveIcon className="w-4 h-4" />
                        {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaignModal;

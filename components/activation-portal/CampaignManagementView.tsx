import React, { useState } from 'react';
import { MegaphoneIcon, PlusIcon, Edit3Icon, Trash2Icon, PlayIcon, PencilIcon } from '../IconComponents';
import type { Campaign } from '../../types';
import CreateCampaignModal from './CreateCampaignModal';
import type { MockPatient } from '../../types';

interface CampaignManagementViewProps {
    campaigns: Campaign[];
    patients: MockPatient[];
    onCreateCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'stats'>) => void;
    onUpdateCampaign: (id: string, updates: Partial<Campaign>) => void;
    onDeleteCampaign: (id: string) => void;
}

const CampaignManagementView: React.FC<CampaignManagementViewProps> = ({
    campaigns,
    patients,
    onCreateCampaign,
    onUpdateCampaign,
    onDeleteCampaign
}) => {
    const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    const getStatusBadge = (status: Campaign['status']) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-700',
            active: 'bg-green-100 text-green-700',
            paused: 'bg-yellow-100 text-yellow-700',
            completed: 'bg-blue-100 text-blue-700'
        };
        return styles[status];
    };

    const getTypeBadge = (type: Campaign['type']) => {
        return type === 'call' ? '📞 Call' : '📧 Email';
    };

    const handleEdit = (campaign: Campaign) => {
        setEditingCampaign(campaign);
        setIsCreatingCampaign(true);
    };

    const handleToggleStatus = (campaign: Campaign) => {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        onUpdateCampaign(campaign.id, { status: newStatus });
    };

    const handleSaveCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'stats'>) => {
        if (editingCampaign) {
            onUpdateCampaign(editingCampaign.id, campaignData);
            setEditingCampaign(null);
        } else {
            onCreateCampaign(campaignData);
        }
    };

    const handleCloseModal = () => {
        setIsCreatingCampaign(false);
        setEditingCampaign(null);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-itera-blue-dark flex items-center gap-3">
                        <MegaphoneIcon className="w-8 h-8 text-itera-blue" />
                        Campaign Management
                    </h2>
                    <p className="text-gray-500 mt-1">Design and manage patient enrollment campaigns.</p>
                </div>
                <button
                    onClick={() => setIsCreatingCampaign(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-itera-blue text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-itera-blue-dark transition-all transform hover:-translate-y-0.5"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Campaign
                </button>
            </header>

            {campaigns.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MegaphoneIcon className="w-10 h-10 text-itera-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Campaigns Active</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Start a new calling or email campaign to target specific patient populations for enrollment.
                    </p>
                    <button
                        onClick={() => setIsCreatingCampaign(true)}
                        className="px-6 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-itera-blue hover:text-itera-blue transition-all"
                    >
                        Create your first campaign
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{campaign.name}</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold">
                                            {getTypeBadge(campaign.type)}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-lg font-bold ${getStatusBadge(campaign.status)}`}>
                                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-medium">Total Targets</span>
                                    <span className="text-sm font-bold text-gray-800">{campaign.stats.totalTargets}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-medium">Contacted</span>
                                    <span className="text-sm font-bold text-blue-600">{campaign.stats.contacted}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-medium">Converted</span>
                                    <span className="text-sm font-bold text-green-600">{campaign.stats.converted}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(campaign)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    <PencilIcon className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleToggleStatus(campaign)}
                                    disabled={campaign.status === 'completed'}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-itera-blue border border-itera-blue rounded-lg hover:bg-itera-blue hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PlayIcon className="w-3.5 h-3.5" />
                                    {campaign.status === 'active' ? 'Pause' : 'Resume'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
                                            onDeleteCampaign(campaign.id);
                                        }
                                    }}
                                    className="px-3 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
                                >
                                    <Trash2Icon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CreateCampaignModal
                isOpen={isCreatingCampaign}
                onClose={handleCloseModal}
                onSave={handleSaveCampaign}
                editingCampaign={editingCampaign}
                patients={patients}
            />
        </div>
    );
};

export default CampaignManagementView;

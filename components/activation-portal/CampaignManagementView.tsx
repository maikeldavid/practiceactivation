import React from 'react';
import { MegaphoneIcon, PlusIcon } from '../IconComponents';

const CampaignManagementView: React.FC = () => {
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
                    className="flex items-center gap-2 px-6 py-3 bg-itera-blue text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-itera-blue-dark transition-all transform hover:-translate-y-0.5"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Campaign
                </button>
            </header>

            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MegaphoneIcon className="w-10 h-10 text-itera-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Campaigns Active</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Start a new calling or email campaign to target specific patient populations for enrollment.
                </p>
                <button
                    className="px-6 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-itera-blue hover:text-itera-blue transition-all"
                >
                    Create your first campaign
                </button>
            </div>
        </div>
    );
};

export default CampaignManagementView;

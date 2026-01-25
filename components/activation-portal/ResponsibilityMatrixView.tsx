import React from 'react';
import { CheckCircleIcon, UsersIcon, ShieldCheckIcon, ClipboardListIcon, BarChart3, DatabaseIcon } from '../IconComponents';

interface Responsibility {
    task: string;
    practice: boolean;
    itera: boolean;
    detail: string;
}

interface Category {
    title: string;
    icon: React.ElementType;
    items: Responsibility[];
}

const ResponsibilityMatrixView: React.FC = () => {
    const categories: Category[] = [
        {
            title: 'Clinical Services (CCM, RPM, PCM)',
            icon: UsersIcon,
            items: [
                { task: 'Patient Identification & Selection', practice: true, itera: true, detail: 'Practice provides access to EHR; Itera identifies potential candidates using specialized analytics.' },
                { task: 'Clinical Care Plan Development', practice: true, itera: false, detail: 'Physician reviews and approves the initial care plan for each patient.' },
                { task: 'Monthly Clinical Monitoring', practice: false, itera: true, detail: 'Itera Care Managers conduct 20+ minutes of clinical interaction and monitoring per month.' },
                { task: 'Urgent Clinical Escalations', practice: true, itera: false, detail: 'Itera escalates urgent findings; Practice handles immediate clinical interventions.' },
                { task: 'Medication Reconciliation', practice: true, itera: true, detail: 'Itera reviews current meds; Physician makes any necessary clinical adjustments.' },
            ]
        },
        {
            title: 'Administrative & Governance',
            icon: ShieldCheckIcon,
            items: [
                { task: 'Regulatory Compliance (HIPAA, etc.)', practice: true, itera: true, detail: 'Both parties maintain strict adherence to healthcare privacy and security standards.' },
                { task: 'Patient Consent Collection', practice: true, itera: true, detail: 'Itera manages the digital signing process; Practice assists with in-office signatures when needed.' },
                { task: 'Program Documentation Maintenance', practice: false, itera: true, detail: 'Itera maintains comprehensive audit logs for all clinical interactions.' },
            ]
        },
        {
            title: 'Billing & Financials',
            icon: BarChart3,
            items: [
                { task: 'Monthly Billing Reporting', practice: false, itera: true, detail: 'Itera generates a ready-to-bill report with all qualified CPT codes.' },
                { task: 'Claim Submission to Payers', practice: true, itera: false, detail: 'Practice submits the claims to Medicare/Insurance through their billing system.' },
                { task: 'Reimbursement Guarantee Support', practice: false, itera: true, detail: 'Itera provides all necessary documentation to defend claims in case of audits.' },
            ]
        },
        {
            title: 'Technology & Data',
            icon: DatabaseIcon,
            items: [
                { task: 'EHR Access & Integration', practice: true, itera: false, detail: 'Practice provides necessary access rights to their Electronic Health Record system.' },
                { task: 'Real-time Dashboarding', practice: false, itera: true, detail: 'Itera provides the portal with real-time analytics of practice performance.' },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            <div>
                <h2 className="text-3xl font-bold text-itera-blue-dark mb-2">Responsibility Matrix</h2>
                <p className="text-gray-600">Visual mapping of duties between the Practice and Itera Health.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 px-8 py-5">
                    <div className="col-span-6 lg:col-span-7">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Service Task / Responsibility</span>
                    </div>
                    <div className="col-span-3 lg:col-span-2 text-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Practice</span>
                    </div>
                    <div className="col-span-3 lg:col-span-3 text-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Itera Health</span>
                    </div>
                </div>

                {/* Categories */}
                <div className="divide-y divide-gray-100">
                    {categories.map((category, catIdx) => (
                        <div key={catIdx}>
                            {/* Category Subheader */}
                            <div className="bg-itera-blue-light/5 px-8 py-4 flex items-center gap-3">
                                <category.icon className="w-5 h-5 text-itera-blue" />
                                <h3 className="font-bold text-itera-blue-dark">{category.title}</h3>
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-gray-50">
                                {category.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="grid grid-cols-12 px-8 py-3 hover:bg-gray-50/50 transition-colors gap-4">
                                        <div className="col-span-6 lg:col-span-7">
                                            <p className="font-bold text-gray-800 text-sm mb-1">{item.task}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed font-normal">{item.detail}</p>
                                        </div>

                                        <div className="col-span-3 lg:col-span-2 flex justify-center items-start pt-1">
                                            {item.practice ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <CheckCircleIcon className="w-6 h-6 text-itera-blue" />
                                                    <span className="text-[10px] font-bold text-itera-blue uppercase">Responsible</span>
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200"></div>
                                            )}
                                        </div>

                                        <div className="col-span-3 lg:col-span-3 flex justify-center items-start pt-1">
                                            {item.itera ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                                    <div className="px-3 py-1 bg-green-50 rounded-full border border-green-100">
                                                        <span className="text-[10px] font-bold text-green-600 uppercase">Managed by Itera</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Footer */}
            <div className="bg-itera-blue-dark text-white p-8 rounded-[2rem] shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="max-w-xl">
                    <h4 className="text-xl font-bold mb-2 italic">A True Partnership Model</h4>
                    <p className="text-itera-blue-light/80 text-sm leading-relaxed">
                        Itera Health functions as an extension of your existing clinical team. While you maintain ultimate authority and clinical oversight of your patients, we handle the intensive, day-to-day coordination and documentation that high-touch care programs require.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <button className="px-6 py-3 bg-white text-itera-blue-dark font-bold rounded-xl hover:bg-itera-blue-light transition-all shadow-md">
                        Download PDF Matrix
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResponsibilityMatrixView;

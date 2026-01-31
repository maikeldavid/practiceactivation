import React from 'react';
import { UsersIcon, ShieldCheckIcon, BarChart3, DatabaseIcon, InfoIcon } from '../IconComponents';

type RACIValue = 'R' | 'A' | 'C' | 'I' | '-';
type Ownership = 'ITERA-LED' | 'PRACTICE-LED';

interface RACIItem {
    task: string;
    description: string;
    ownership: Ownership;
    roles: {
        physician: RACIValue;
        staff: RACIValue;
        iteraManager: RACIValue;
    };
}

interface RACICategory {
    title: string;
    icon: React.ElementType;
    items: RACIItem[];
}

const OwnershipBadge: React.FC<{ ownership: Ownership }> = ({ ownership }) => {
    const isItera = ownership === 'ITERA-LED';
    return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-tighter ${isItera
            ? 'bg-green-50 text-green-700 border-green-100'
            : 'bg-itera-blue-light/30 text-itera-blue border-itera-blue-light/50'}`}>
            {ownership}
        </span>
    );
};

const RACIBadge: React.FC<{ value: RACIValue }> = ({ value }) => {
    if (value === '-') return <span className="text-gray-200">-</span>;

    const styles = {
        'R': 'bg-blue-50 text-blue-700 border-blue-200',
        'A': 'bg-purple-50 text-purple-700 border-purple-200',
        'C': 'bg-orange-50 text-orange-700 border-orange-200',
        'I': 'bg-teal-50 text-teal-700 border-teal-200'
    };

    const labels = {
        'R': 'Responsible',
        'A': 'Accountable',
        'C': 'Consulted',
        'I': 'Informed'
    };

    return (
        <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full border font-bold text-[10px] uppercase tracking-tight shadow-sm transition-transform hover:scale-105 ${styles[value]}`}>
                {labels[value]}
            </span>
        </div>
    );
};

const ResponsibilityMatrixView: React.FC = () => {
    const categories: RACICategory[] = [
        {
            title: 'Clinical Services',
            icon: UsersIcon,
            items: [
                {
                    task: 'Patient Selection & Approval',
                    description: 'Identifying and approving patients for program eligibility.',
                    ownership: 'ITERA-LED',
                    roles: { physician: 'A', staff: 'I', iteraManager: 'R' }
                },
                {
                    task: 'Care Plan Development',
                    description: 'Creation and physician approval of initial patient care plans.',
                    ownership: 'ITERA-LED',
                    roles: { physician: 'A', staff: 'C', iteraManager: 'R' }
                },
                {
                    task: 'Monthly Clinical Monitoring',
                    description: '20+ minutes of recursive clinical interaction per month.',
                    ownership: 'ITERA-LED',
                    roles: { physician: 'A', staff: 'I', iteraManager: 'R' }
                },
                {
                    task: 'Urgent Clinical Escalations',
                    description: 'Immediate notification and handling of critical health findings.',
                    ownership: 'PRACTICE-LED',
                    roles: { physician: 'R', staff: 'C', iteraManager: 'I' }
                }
            ]
        },
        {
            title: 'Administrative & Governance',
            icon: ShieldCheckIcon,
            items: [
                {
                    task: 'HIPAA & Compliance',
                    description: 'Ensuring data privacy and regulatory standards are met.',
                    ownership: 'ITERA-LED',
                    roles: { physician: 'I', staff: 'R', iteraManager: 'A' }
                },
                {
                    task: 'Patient Consent Management',
                    description: 'Managing digital and verbal consent for program participation.',
                    ownership: 'ITERA-LED',
                    roles: { physician: 'I', staff: 'C', iteraManager: 'R' }
                }
            ]
        },
        {
            title: 'Billing & Financials',
            icon: BarChart3,
            items: [
                {
                    task: 'Monthly Billing Reporting',
                    description: 'Generation of qualified CPT code reports for practice billing.',
                    ownership: 'ITERA-LED',
                    roles: { physician: 'I', staff: 'C', iteraManager: 'R' }
                },
                {
                    task: 'Claim Submission',
                    description: 'Submitting finalized claims to Medicare and private payers.',
                    ownership: 'PRACTICE-LED',
                    roles: { physician: 'I', staff: 'R', iteraManager: 'I' }
                }
            ]
        },
        {
            title: 'Technology & Data',
            icon: DatabaseIcon,
            items: [
                {
                    task: 'EHR Access Maintenance',
                    description: 'Providing and maintaining secure read/write access to practice EHR.',
                    ownership: 'PRACTICE-LED',
                    roles: { physician: 'A', staff: 'R', iteraManager: 'I' }
                }
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-itera-blue-dark">RACI Responsibility Matrix</h2>
                    <p className="text-gray-600 mt-1">Operational roles and accountability mapping for Itera Health partnership.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500"></div><span className="text-[10px] font-bold text-gray-500">R: Responsible</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-purple-500"></div><span className="text-[10px] font-bold text-gray-500">A: Accountable</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-500"></div><span className="text-[10px] font-bold text-gray-500">C: Consulted</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-teal-500"></div><span className="text-[10px] font-bold text-gray-500">I: Informed</span></div>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-8 py-6 font-bold text-xs text-gray-400 uppercase tracking-widest w-1/4">Project Task / Service</th>
                            <th className="px-4 py-6 font-bold text-xs text-gray-400 uppercase tracking-widest text-center">Ownership</th>
                            <th className="px-4 py-6 font-bold text-xs text-gray-400 uppercase tracking-widest text-center">Physician</th>
                            <th className="px-4 py-6 font-bold text-xs text-gray-400 uppercase tracking-widest text-center">Practice Staff</th>
                            <th className="px-4 py-6 font-bold text-xs text-gray-400 uppercase tracking-widest text-center">Itera Care Manager</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((category) => (
                            <React.Fragment key={category.title}>
                                <tr className="bg-itera-blue-light/5">
                                    <td colSpan={5} className="px-8 py-3">
                                        <div className="flex items-center gap-2 text-itera-blue">
                                            <category.icon className="w-4 h-4" />
                                            <span className="font-bold text-sm tracking-wide">{category.title}</span>
                                        </div>
                                    </td>
                                </tr>
                                {category.items.map((item) => (
                                    <tr key={item.task} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="space-y-1">
                                                <p className="font-bold text-gray-800 text-sm group-hover:text-itera-blue transition-colors">{item.task}</p>
                                                <p className="text-xs text-gray-500 leading-relaxed max-w-md">{item.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 text-center"><OwnershipBadge ownership={item.ownership} /></td>
                                        <td className="px-4 py-5"><RACIBadge value={item.roles.physician} /></td>
                                        <td className="px-4 py-5"><RACIBadge value={item.roles.staff} /></td>
                                        <td className="px-4 py-5"><RACIBadge value={item.roles.iteraManager} /></td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-itera-blue-dark text-white p-8 rounded-[2.5rem] shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="max-w-2xl">
                        <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                            <InfoIcon className="w-5 h-5 text-itera-blue-light" />
                            Clinical Oversight Reminder
                        </h4>
                        <p className="text-itera-blue-light/80 text-sm leading-relaxed">
                            Under CMS guidelines, the **Practice Physician** remains ultimately Accountable (A) for clinical decisions and patient care plans. Itera Health serves as the Responsible (R) execution arm, ensuring every requirement is met with clinical precision, while the platform provides the necessary data-driven transparency.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsibilityMatrixView;



import React from 'react';
import type { MockPatient, PatientStatus } from '../../types';

interface AnalyticsViewProps {
  patients: MockPatient[];
}

const EnrollmentFunnel: React.FC<{ patients: MockPatient[] }> = ({ patients }) => {
    const funnelSteps: { name: PatientStatus[], label: string }[] = [
        { name: ['Pending Approval', 'Approved', 'Outreach - 1st Attempt', 'Outreach - 2nd Attempt', 'Consent Sent', 'Device Shipped', 'Active', 'Not Enrolled'], label: 'Eligible' },
        { name: ['Approved', 'Outreach - 1st Attempt', 'Outreach - 2nd Attempt', 'Consent Sent', 'Device Shipped', 'Active', 'Not Enrolled'], label: 'Approved' },
        { name: ['Outreach - 1st Attempt', 'Outreach - 2nd Attempt', 'Consent Sent', 'Device Shipped', 'Active', 'Not Enrolled'], label: 'Outreach' },
        { name: ['Consent Sent', 'Device Shipped', 'Active'], label: 'Consented' },
        { name: ['Active'], label: 'Active' },
    ];
    
    const totalEligible = patients.length;

    const funnelData = funnelSteps.map(step => {
        const count = patients.filter(p => step.name.includes(p.status)).length;
        return {
            label: step.label,
            count: count,
            percentage: totalEligible > 0 ? (count / totalEligible) * 100 : 0
        };
    });

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-itera-blue-dark mb-4">Enrollment Funnel</h3>
            <div className="space-y-2">
                {funnelData.map((step, index) => {
                    const prevCount = index > 0 ? funnelData[index - 1].count : totalEligible;
                    const conversionRate = prevCount > 0 ? ((step.count / prevCount) * 100).toFixed(0) : '0';
                    return(
                    <div key={step.label} className="group">
                        <div className="flex items-center justify-between text-sm mb-1">
                           <span className="font-semibold text-gray-700">{step.label}</span>
                           <span className="font-bold text-itera-blue-dark">{step.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-itera-blue h-4 rounded-full" style={{ width: `${step.percentage}%` }}></div>
                        </div>
                        {index > 0 && 
                            <p className="text-right text-xs text-gray-500 mt-1">
                                {conversionRate}% conversion from previous step
                            </p>
                        }
                    </div>
                )})}
            </div>
        </div>
    );
};

const ProgramDistribution: React.FC<{ patients: MockPatient[] }> = ({ patients }) => {
    // FIX: The initial value for reduce was an untyped empty object, causing TypeScript
    // to infer the accumulator's values as `any`. By casting the initial value to
    // `Record<string, number>`, we ensure that `count` is correctly typed as a number,
    // resolving the arithmetic errors in the sort function and style calculation.
    const programCounts = patients.reduce((acc, p) => {
        p.eligiblePrograms.forEach(prog => {
            acc[prog] = (acc[prog] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const sortedPrograms = Object.entries(programCounts).sort(([, countA], [, countB]) => countB - countA);

    const programColors: { [key: string]: string } = {
        'CCM': 'bg-itera-blue',
        'RPM': 'bg-itera-orange-dark',
        'TCM': 'bg-teal-500',
        'APCM': 'bg-indigo-500',
        'PCM': 'bg-sky-500',
        'RTM': 'bg-emerald-500',
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-itera-blue-dark mb-4">Patients by Program</h3>
            <div className="space-y-3">
                {sortedPrograms.map(([program, count]) => (
                    <div key={program}>
                        <div className="flex justify-between text-sm mb-1">
                            <div className="flex items-center">
                                <span className={`w-3 h-3 rounded-full mr-2 ${programColors[program] || 'bg-gray-400'}`}></span>
                                <span className="font-medium text-gray-600">{program}</span>
                            </div>
                            <span className="text-gray-500">{count} Patients</span>
                        </div>
                         <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`${programColors[program] || 'bg-gray-400'} h-2 rounded-full`} style={{ width: `${(count / patients.length) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};


const AnalyticsView: React.FC<AnalyticsViewProps> = ({ patients }) => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-itera-blue-dark">Enrollment Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EnrollmentFunnel patients={patients} />
                <ProgramDistribution patients={patients} />
            </div>

        </div>
    );
};

export default AnalyticsView;
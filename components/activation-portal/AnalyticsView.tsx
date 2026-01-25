
import React from 'react';
import type { MockPatient, PatientStatus } from '../../types';

interface AnalyticsViewProps {
    patients: MockPatient[];
}

const EnrollmentFunnel: React.FC<{ patients: MockPatient[] }> = ({ patients }) => {
    const funnelSteps: { name: PatientStatus[], label: string }[] = [
        { name: ['Pending Approval', 'Approved', 'Outreach - 1st Attempt', 'Outreach - 2nd Attempt', 'Consent Sent', 'Device Shipped', 'Active'], label: 'Eligible' },
        { name: ['Approved', 'Outreach - 1st Attempt', 'Outreach - 2nd Attempt', 'Consent Sent', 'Device Shipped', 'Active'], label: 'Approved' },
        { name: ['Outreach - 1st Attempt', 'Outreach - 2nd Attempt', 'Consent Sent', 'Device Shipped', 'Active'], label: 'Outreach' },
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
                    return (
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
                    )
                })}
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

    const sortedPrograms = (Object.entries(programCounts) as [string, number][]).sort(([, countA], [, countB]) => countB - countA);

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



const calculateAge = (dob: string) => {
    const birthday = new Date(dob);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const ConditionsDistribution: React.FC<{ patients: MockPatient[] }> = ({ patients }) => {
    const conditionCounts = patients.reduce((acc, p) => {
        p.chronicConditions?.forEach(cond => {
            acc[cond] = (acc[cond] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const sortedConditions = (Object.entries(conditionCounts) as [string, number][]).sort(([, countA], [, countB]) => countB - countA);

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-itera-blue-dark mb-4">Patients by Condition</h3>
            <div className="space-y-3">
                {sortedConditions.map(([condition, count]) => (
                    <div key={condition}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-600">{condition}</span>
                            <span className="text-gray-500">{count} Patients</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-itera-blue h-2 rounded-full" style={{ width: `${(count / patients.length) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
                {sortedConditions.length === 0 && <p className="text-sm text-gray-400 italic">No condition data available</p>}
            </div>
        </div>
    );
};

const AgeDistribution: React.FC<{ patients: MockPatient[] }> = ({ patients }) => {
    const ranges = [
        { label: '< 50', min: 0, max: 49 },
        { label: '50 - 64', min: 50, max: 64 },
        { label: '65 - 74', min: 65, max: 74 },
        { label: '75 +', min: 75, max: 150 },
    ];

    const ageCounts = ranges.map(range => ({
        ...range,
        count: patients.filter(p => {
            const age = calculateAge(p.dob);
            return age >= range.min && age <= range.max;
        }).length
    }));

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-itera-blue-dark mb-4">Patients by Age Range</h3>
            <div className="space-y-3">
                {ageCounts.map(range => (
                    <div key={range.label}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-600">{range.label}</span>
                            <span className="text-gray-500">{range.count} Patients</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-itera-blue-dark h-2 rounded-full" style={{ width: `${(range.count / patients.length) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GenderDistribution: React.FC<{ patients: MockPatient[] }> = ({ patients }) => {
    const genderCounts = patients.reduce((acc, p) => {
        const g = p.gender || 'Unknown';
        acc[g] = (acc[g] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-itera-blue-dark mb-4">Patients by Gender</h3>
            <div className="flex items-center gap-8 h-full pb-4">
                {Object.entries(genderCounts).map(([gender, count]) => {
                    const percentage = ((count / patients.length) * 100).toFixed(0);
                    return (
                        <div key={gender} className="flex-1 text-center">
                            <div className="relative inline-flex items-center justify-center mb-2">
                                <svg className="w-20 h-20 transform -rotate-90">
                                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent"
                                        strokeDasharray={2 * Math.PI * 34}
                                        strokeDashoffset={2 * Math.PI * 34 * (1 - Number(percentage) / 100)}
                                        className={gender === 'female' ? 'text-purple-500' : gender === 'male' ? 'text-itera-blue' : 'text-gray-400'}
                                    />
                                </svg>
                                <span className="absolute text-sm font-bold text-gray-700">{percentage}%</span>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{gender}</p>
                            <p className="text-sm font-bold text-itera-blue-dark">{count}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const AnalyticsView: React.FC<AnalyticsViewProps> = ({ patients }) => {
    // We focus on "Active" patients to represent those already "Enrolled"
    const enrolledPatients = patients.filter(p => p.status === 'Active');

    return (
        <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-itera-blue-dark">Enrollment Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EnrollmentFunnel patients={patients} />
                <ProgramDistribution patients={patients} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ConditionsDistribution patients={enrolledPatients.length > 0 ? enrolledPatients : patients} />
                <AgeDistribution patients={enrolledPatients.length > 0 ? enrolledPatients : patients} />
                <GenderDistribution patients={enrolledPatients.length > 0 ? enrolledPatients : patients} />
            </div>
        </div>
    );
};

export default AnalyticsView;

import React, { useState, useEffect } from 'react';
import {
    FileTextIcon,
    ClipboardListIcon,
    Laptop,
    PillIcon,
    UsersIcon,
    HomeIcon,
    CheckCircleIcon,
    ArrowRightIcon
} from './IconComponents';

type ProgramType = 'CCM' | 'PCM' | 'RPM' | 'RTM' | 'BHI' | 'APCM';

interface ProgramContent {
    title: string;
    description: string;
    quickFacts: {
        time: string;
        conditions: string;
        focus: string;
    };
    overview: string;
    benefits: string[];
    workflow: string[];
    eligibility: string[];
    verification: string[]; // for "Eligibility & Billing Requirements" specifically? Screenshot implies simple list
    roles: {
        practice: string[];
        itera: string[];
    };
    resources: { title: string; url?: string }[];
}

const ProgramDocumentationPage: React.FC = () => {
    const [selectedProgram, setSelectedProgram] = useState<ProgramType | null>(null);
    const [activeTab, setActiveTab] = useState<'Overview' | 'Workflow' | 'Eligibility' | 'Roles' | 'Resources'>('Overview');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const programs: { id: ProgramType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { id: 'CCM', label: 'Chronic Care Management (CCM)', description: 'Structured monthly care coordination for patients with multiple chronic conditions.', icon: FileTextIcon },
        { id: 'PCM', label: 'Principal Care Management (PCM)', description: 'Focused management for a single complex chronic condition.', icon: ClipboardListIcon },
        { id: 'RPM', label: 'Remote Patient Monitoring (RPM)', description: 'Device-enabled physiologic monitoring and interventions.', icon: Laptop },
        { id: 'RTM', label: 'Remote Therapeutic Monitoring (RTM)', description: 'Monitoring of therapy adherence and response for MSK/respiratory.', icon: PillIcon },
        { id: 'BHI', label: 'Behavioral Health Integration (BHI)', description: 'Collaborative care workflows for behavioral health needs.', icon: UsersIcon },
        { id: 'APCM', label: 'Advanced Primary Care (APCM)', description: 'Team-based, value-driven primary care enablement.', icon: HomeIcon },
    ];

    // Placeholder content generators for non-CCM programs
    const getGenericProgramContent = (id: string, label: string): ProgramContent => ({
        title: label,
        description: 'Detailed documentation coming soon.',
        quickFacts: { time: 'Varies', conditions: 'Varies', focus: 'Patient Care' },
        overview: `${id} helps improve patient outcomes through targeted care interventions. Detailed overview coming soon.`,
        benefits: ['Improved Outcomes', 'Better Coordination', 'Patient Satisfaction'],
        workflow: ['Identify Patients', 'Enroll', 'Monitor', 'Bill'],
        eligibility: ['Standard eligibility criteria apply.'],
        verification: [],
        roles: {
            practice: ['Identify patients'],
            itera: ['Support documentation']
        },
        resources: []
    });

    const PROGRAM_CONTENT: Record<ProgramType, ProgramContent> = {
        'CCM': {
            title: 'Chronic Care Management (CCM)',
            description: 'Structured monthly care coordination for patients with multiple chronic conditions',
            quickFacts: {
                time: '20+ minutes',
                conditions: '2+ chronic conditions',
                focus: 'Comprehensive care coordination'
            },
            overview: `CCM provides non-face-to-face care coordination services for patients with two or more chronic conditions expected to last at least 12 months. The program focuses on comprehensive care planning, medication management, and coordination between providers to improve patient outcomes and reduce healthcare costs.`,
            benefits: [
                'Improved patient outcomes and satisfaction',
                'Reduced hospital readmissions',
                'Enhanced care coordination'
            ],
            workflow: [
                'Patient identification and eligibility screening',
                'Obtain verbal consent and document in ITERA Platform',
                'Create comprehensive care plan with patient input',
                'Provide 20+ minutes of non-face-to-face care coordination monthly',
                'Document all interactions and time spent',
                'Bill appropriate CPT codes at month-end'
            ],
            eligibility: [
                'Patients must have 2+ chronic conditions expected to last 12+ months or until death, placing them at significant risk of functional decline or death',
                'Verbal consent is required and must be documented',
                'Services are billed monthly when 20+ minutes of qualifying time is reached'
            ],
            verification: [],
            roles: {
                practice: [
                    'Identify eligible patients',
                    'Obtain and document patient consent',
                    'Provide clinical oversight and care plan approval',
                    'Review monthly reports and patient progress'
                ],
                itera: [
                    'Conduct patient outreach and engagement',
                    'Provide care coordination services',
                    'Document all interactions and time spent',
                    'Generate monthly billing reports',
                    'Monitor program metrics and outcomes'
                ]
            },
            resources: [
                { title: 'CCM Quick Start Guide' },
                { title: 'Care Plan Example' },
                { title: 'Monthly Report' }
            ]
        },
        'PCM': getGenericProgramContent('PCM', 'Principal Care Management (PCM)'),
        'RPM': getGenericProgramContent('RPM', 'Remote Patient Monitoring (RPM)'),
        'RTM': getGenericProgramContent('RTM', 'Remote Therapeutic Monitoring (RTM)'),
        'BHI': getGenericProgramContent('BHI', 'Behavioral Health Integration (BHI)'),
        'APCM': getGenericProgramContent('APCM', 'Advanced Primary Care (APCM)'),
    }

    const currentProgramContent = selectedProgram ? PROGRAM_CONTENT[selectedProgram] : null;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-itera-blue-dark mb-6">Program Documentation</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Comprehensive educational and operational reference for partner practices.
                        Each program provides structured explanations of goals, workflows, and responsibilities.
                    </p>
                </div>

                {/* Grid or Details View */}
                {!selectedProgram ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        {programs.map(program => (
                            <button
                                key={program.id}
                                onClick={() => setSelectedProgram(program.id)}
                                className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-xl hover:border-itera-blue/30 transition-all text-left group flex flex-col h-full transform hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 bg-itera-blue-light/10 rounded-2xl flex items-center justify-center text-itera-blue mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                    <program.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-itera-blue transition-colors">
                                    {program.label}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                                    {program.description}
                                </p>
                                <div className="mt-6 flex items-center text-itera-blue text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                                    View Guide
                                </div>
                            </button>
                        ))}
                    </div>
                ) : currentProgramContent && (
                    <div className="animate-in fade-in zoom-in-95 duration-300 max-w-7xl mx-auto">
                        <button
                            onClick={() => setSelectedProgram(null)}
                            className="flex items-center gap-2 text-gray-500 hover:text-itera-blue font-medium mb-8 transition-colors"
                        >
                            ← Back to Programs
                        </button>

                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden p-8 md:p-12">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                                {/* Left Main Column */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Program Header Info */}
                                    <div>
                                        <div className="flex items-center gap-4 mb-4">
                                            {/* Optional Badge/Icon if needed */}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-itera-blue-dark mb-4">{currentProgramContent.title}</h2>
                                        <p className="text-gray-600 text-lg max-w-3xl">{currentProgramContent.description}</p>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide border-b border-gray-100">
                                        {['Overview', 'Workflow', 'Eligibility', 'Roles', 'Resources'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab as any)}
                                                className={`px-6 py-3 rounded-t-xl text-sm font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === tab
                                                    ? 'text-white bg-itera-blue border-itera-blue shadow-sm'
                                                    : 'text-gray-500 hover:text-itera-blue border-transparent hover:bg-gray-50'
                                                    }`}
                                                style={{ marginBottom: '-1px' }}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Tab Content Area */}
                                    <div className="min-h-[400px] pt-4">
                                        {activeTab === 'Overview' && (
                                            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                                                <p className="mb-6">{currentProgramContent.overview}</p>
                                            </div>
                                        )}
                                        {activeTab === 'Workflow' && (
                                            <div className="space-y-8">
                                                <h3 className="text-xl font-bold text-gray-800 mb-6">Key Workflow Steps</h3>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100"></div>
                                                    <div className="space-y-8">
                                                        {currentProgramContent.workflow.map((step, idx) => (
                                                            <div key={idx} className="relative flex gap-6">
                                                                <div className="w-8 h-8 rounded-full bg-itera-blue text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md ring-4 ring-white z-10">
                                                                    {idx + 1}
                                                                </div>
                                                                <div className="pt-1">
                                                                    <h4 className="font-medium text-lg text-gray-700">{step}</h4>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {activeTab === 'Eligibility' && (
                                            <div className="space-y-8">
                                                <h3 className="text-xl font-bold text-gray-800 mb-6">Eligibility & Billing Requirements</h3>
                                                <div className="space-y-6">
                                                    {currentProgramContent.eligibility.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4 items-start">
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-itera-blue flex items-center justify-center shrink-0 mt-0.5">
                                                                <CheckCircleIcon className="w-4 h-4" />
                                                            </div>
                                                            <p className="text-gray-600 text-lg leading-relaxed">{item}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {activeTab === 'Roles' && (
                                            <div className="space-y-10">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                                        <HomeIcon className="w-6 h-6 text-gray-400" />
                                                        Practice Responsibilities
                                                    </h3>
                                                    <ul className="space-y-4 list-disc pl-6 text-gray-600 marker:text-itera-blue">
                                                        {currentProgramContent.roles.practice.map((item, idx) => (
                                                            <li key={idx}>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                                        <UsersIcon className="w-6 h-6 text-gray-400" />
                                                        ITERA Responsibilities
                                                    </h3>
                                                    <ul className="space-y-4 list-disc pl-6 text-gray-600 marker:text-itera-blue">
                                                        {currentProgramContent.roles.itera.map((item, idx) => (
                                                            <li key={idx}>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                        {activeTab === 'Resources' && (
                                            <div className="space-y-8">
                                                <h3 className="text-xl font-bold text-gray-800 mb-6">Available Resources</h3>
                                                <div className="space-y-4">
                                                    {currentProgramContent.resources.map((resource, idx) => (
                                                        <button key={idx} className="w-full bg-white p-6 rounded-xl border border-gray-200 hover:border-itera-blue hover:shadow-md transition-all flex items-center justify-between group">
                                                            <span className="font-bold text-gray-700 group-hover:text-itera-blue transition-colors text-lg">
                                                                {resource.title}
                                                            </span>
                                                        </button>
                                                    ))}
                                                    {currentProgramContent.resources.length === 0 && (
                                                        <p className="text-gray-500 italic">No resources available yet.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Sidebar Column */}
                                <div className="space-y-8">
                                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-8 text-lg">Quick Facts</h4>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-itera-blue font-bold bg-blue-50 px-3 py-1.5 rounded-lg text-sm">
                                                        {currentProgramContent.quickFacts.time}
                                                    </div>
                                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Monthly Time</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-itera-blue font-bold bg-blue-50 px-3 py-1.5 rounded-lg text-sm">
                                                        {currentProgramContent.quickFacts.conditions}
                                                    </div>
                                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Conditions</div>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-3 text-center">Focus Area</div>
                                                <div className="text-gray-700 font-medium bg-gray-50 p-4 rounded-lg text-center">
                                                    {currentProgramContent.quickFacts.focus}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-6 text-lg">Key Benefits</h4>
                                        <ul className="space-y-4">
                                            {currentProgramContent.benefits.map((benefit, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                                    <CheckCircleIcon className="w-5 h-5 text-itera-blue shrink-0 mt-0.5" />
                                                    <span className="leading-snug">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgramDocumentationPage;

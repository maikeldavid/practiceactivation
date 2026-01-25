import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const CPTCodeCard: React.FC<{ code: string; title: string; requirements: string; eligiblePatients: string }> = ({ code, title, requirements, eligiblePatients }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-3xl font-bold text-itera-blue/80">{code}</h3>
            <span className="bg-itera-blue text-white px-3 py-1 rounded-md text-xs font-semibold">Active 2025</span>
        </div>
        <p className="text-gray-800 font-medium mb-6">{title}</p>

        <div className="space-y-4">
            <div>
                <h4 className="font-bold text-sm text-gray-700 mb-1">Requirements:</h4>
                <p className="text-gray-600 text-sm">{requirements}</p>
            </div>
            <div>
                <h4 className="font-bold text-sm text-gray-700 mb-1">Eligible Patients:</h4>
                <p className="text-gray-600 text-sm">{eligiblePatients}</p>
            </div>
        </div>
    </div>
);

const CPTCodesPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const categories = [
        {
            title: "Chronic Care Management (CCM)",
            codes: [
                {
                    code: "99490",
                    title: "CCM services, first 20 minutes",
                    requirements: "≥20 minutes of clinical staff time per month",
                    eligiblePatients: "Patients with ≥2 chronic conditions"
                },
                {
                    code: "99439",
                    title: "CCM services, each additional 20 minutes",
                    requirements: "Additional 20-minute increments beyond initial 20 minutes",
                    eligiblePatients: "Patients enrolled in CCM program"
                },
                {
                    code: "99491",
                    title: "CCM services provided personally by a physician or QHP",
                    requirements: "≥30 minutes of physician/QHP time per month",
                    eligiblePatients: "Patients with ≥2 chronic conditions"
                }
            ]
        },
        {
            title: "Principal Care Management (PCM)",
            codes: [
                {
                    code: "99424",
                    title: "PCM services, first 30 minutes",
                    requirements: "≥30 minutes of physician/QHP time per month",
                    eligiblePatients: "Patients with one high-risk chronic condition"
                },
                {
                    code: "99425",
                    title: "PCM services, each additional 30 minutes",
                    requirements: "Additional 30-minute increments",
                    eligiblePatients: "Patients enrolled in PCM program"
                },
                {
                    code: "99426",
                    title: "PCM services (clinical staff), first 30 minutes",
                    requirements: "≥30 minutes of clinical staff time per month",
                    eligiblePatients: "Patients with one high-risk chronic condition"
                }
            ]
        },
        {
            title: "Remote Patient Monitoring (RPM)",
            codes: [
                {
                    code: "99453",
                    title: "RPM Setup & Patient Education",
                    requirements: "Initial set-up and patient education on use of equipment",
                    eligiblePatients: "New RPM patients (one-time billing)"
                },
                {
                    code: "99454",
                    title: "RPM Device Supply",
                    requirements: "Supply of device(s) with daily recording or programmed alerts",
                    eligiblePatients: "At least 16 days of readings in a 30-day period"
                },
                {
                    code: "99457",
                    title: "RPM Treatment Management",
                    requirements: "First 20 minutes of clinical staff/physician time",
                    eligiblePatients: "Patients using RPM devices"
                }
            ]
        },
        {
            title: "Behavioral Health Integration (BHI)",
            codes: [
                {
                    code: "99484",
                    title: "General BHI services",
                    requirements: "≥20 minutes of clinical staff time per month",
                    eligiblePatients: "Patients with behavioral health conditions"
                }
            ]
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <Link to="/" className="text-itera-blue hover:underline text-sm font-medium">← Back to Portal</Link>
                    </div>

                    <div className="mb-16">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-itera-blue-dark">CPT Codes & Billing</h1>
                        <p className="text-gray-600 max-w-3xl">
                            Comprehensive reference for all active CPT codes and billing requirements for CCM, PCM, RPM, RTM, BHI, and APCM programs.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {categories.map((category, idx) => (
                            <section key={idx}>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {category.codes.map((codeItem, cIdx) => (
                                        <CPTCodeCard key={cIdx} {...codeItem} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    <div className="mt-20 bg-blue-50 border border-blue-100 rounded-xl p-8 text-center bg-white shadow-sm">
                        <h3 className="text-2xl font-bold text-itera-blue-dark mb-4">Ready to optimize your billing?</h3>
                        <p className="text-gray-700 mb-6">
                            ITERA HEALTH automates the time tracking, billing report generation, and audit trails for all these codes.
                        </p>
                        <Link to="/" className="inline-block bg-itera-orange text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-itera-orange-dark transition-colors">
                            Explore Our Platform
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CPTCodesPage;

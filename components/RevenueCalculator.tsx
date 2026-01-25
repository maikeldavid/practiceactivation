import React, { useState, useMemo } from 'react';
import { TrendingUpIcon, ActivityIcon, HeartPulseIcon, ClipboardListIcon, BarChart3 } from './IconComponents';

const REVENUE_RATES = {
    CCM: 62, // Monthly per patient
    RPM: 100, // Monthly per patient (Supply + Monitoring)
    TCM: 200, // Per encounter (avg 15% of population annually)
};

const ITEARA_FEE_PERCENT = 0.40; // 40% fee for management

const RevenueCalculator: React.FC = () => {
    const [patientCount, setPatientCount] = useState(500);
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>(['CCM', 'RPM']);

    const results = useMemo(() => {
        const ccmCount = selectedPrograms.includes('CCM') ? patientCount : 0;
        const rpmCount = selectedPrograms.includes('RPM') ? patientCount * 0.8 : 0; // Assume 80% eligibility for RPM
        const tcmCount = selectedPrograms.includes('TCM') ? (patientCount * 0.15) / 12 : 0; // 15% annual encounters monthly

        const grossMonthly = (ccmCount * REVENUE_RATES.CCM) +
            (rpmCount * REVENUE_RATES.RPM) +
            (tcmCount * REVENUE_RATES.TCM);

        const iteraFee = grossMonthly * ITEARA_FEE_PERCENT;
        const providerNet = grossMonthly - iteraFee;

        return {
            grossMonthly,
            providerNet,
            grossAnnual: grossMonthly * 12,
            providerNetAnnual: providerNet * 12
        };
    }, [patientCount, selectedPrograms]);

    const toggleProgram = (prog: string) => {
        setSelectedPrograms(prev =>
            prev.includes(prog) ? prev.filter(p => p !== prog) : [...prev, prog]
        );
    };

    return (
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-itera-blue/10 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Inputs Side */}
                <div className="p-8 lg:p-12 bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-itera-blue/10 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-itera-blue" />
                        </div>
                        <h3 className="text-xl font-bold text-itera-blue-dark uppercase tracking-tight">Configuration</h3>
                    </div>

                    <div className="space-y-10">
                        {/* Patient Count Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Patient Database</label>
                                <span className="text-3xl font-black text-itera-blue-dark">{patientCount}</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                step="50"
                                value={patientCount}
                                onChange={(e) => setPatientCount(parseInt(e.target.value))}
                                className="w-full h-2 bg-itera-blue/20 rounded-lg appearance-none cursor-pointer accent-itera-blue transition-all"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                <span>100 PATIENTS</span>
                                <span>5,000 PATIENTS</span>
                            </div>
                        </div>

                        {/* Programs grid */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select Managed Programs</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'CCM', label: 'Chronic Care', icon: HeartPulseIcon },
                                    { id: 'RPM', label: 'Remote Monitoring', icon: ActivityIcon },
                                    { id: 'TCM', label: 'Transitions', icon: ClipboardListIcon },
                                ].map((prog) => (
                                    <button
                                        key={prog.id}
                                        onClick={() => toggleProgram(prog.id)}
                                        className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${selectedPrograms.includes(prog.id)
                                            ? 'border-itera-blue bg-white shadow-lg'
                                            : 'border-transparent bg-white/50 text-gray-400 hover:border-gray-200'
                                            }`}
                                    >
                                        <prog.icon className={`w-5 h-5 ${selectedPrograms.includes(prog.id) ? 'text-itera-blue' : 'text-gray-300'}`} />
                                        <span className={`text-xs font-bold uppercase tracking-tight ${selectedPrograms.includes(prog.id) ? 'text-itera-blue-dark' : ''}`}>
                                            {prog.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Side */}
                <div className="p-8 lg:p-12 bg-itera-blue-dark text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <TrendingUpIcon className="w-5 h-5 text-itera-blue" />
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-tight">Est. Practice ROI</h3>
                        </div>

                        <div className="space-y-8 flex-grow">
                            <div>
                                <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Monthly Practice Net Profit</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black italic tracking-tighter">
                                        ${Math.round(results.providerNet).toLocaleString()}
                                    </span>
                                    <span className="text-itera-blue font-bold text-sm">/mo</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                                <div>
                                    <p className="text-white/40 text-[9px] font-bold uppercase mb-1">Gross Annual Revenue</p>
                                    <p className="text-xl font-bold">${Math.round(results.grossAnnual).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-itera-blue text-[9px] font-bold uppercase mb-1">Practice Net Annual</p>
                                    <p className="text-xl font-bold text-itera-blue-light">${Math.round(results.providerNetAnnual).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-xs text-white/70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-itera-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                    <p>Itera handles 100% of enrollment & management staffing.</p>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-white/70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-itera-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                    <p>Practice oversight limited to ~4 hours monthly.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10">
                            <button className="w-full py-4 bg-white text-itera-blue-dark rounded-2xl font-black uppercase tracking-widest hover:bg-itera-blue hover:text-white transition-all transform active:scale-95 shadow-xl shadow-black/20">
                                Request Custom Validation
                            </button>
                        </div>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-itera-blue/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-itera-blue/10 rounded-full blur-[80px]"></div>
                </div>
            </div>
        </div>
    );
};

export default RevenueCalculator;

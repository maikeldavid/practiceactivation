
import React, { useState, useMemo } from 'react';
import type { MockPatient, PatientStatus, ContactInfo } from '../../types';
import { Filter, UserCheckIcon, UsersIcon, MoreHorizontalIcon, CheckCircleIcon, XIcon, FileTextIcon, RepeatIcon, CalendarIcon, PhoneCall, PlusIcon, UploadIcon, DownloadIcon, HistoryIcon } from '../IconComponents';
import PatientDetailsModal from './PatientDetailsModal';
import LogCallModal from './LogCallModal';
import AddPatientModal from './AddPatientModal';
import CallHistoryModal from './CallHistoryModal';

import { evaluatePatientEligibility, EligibilityResult, PROGRAM_NAMES } from '../../utils/eligibilityEngine';

type SubView = 'eligibility' | 'tracking';

const getStatusColor = (status: PatientStatus) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
        case 'Approved':
        case 'Scheduled with CM':
            return 'bg-blue-100 text-blue-800';
        case 'Not Approved': return 'bg-red-50 text-red-600 border border-red-100';
        case 'Consent Sent':
        case 'Device Shipped':
            return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const ProgramBadge: React.FC<{ program: string; patient: MockPatient }> = ({ program, patient }) => {
    const reason = React.useMemo(() => {
        if (!patient.eligibilityAnalysis) return "Eligibility criteria met based on clinical profile.";
        const detail = patient.eligibilityAnalysis.eligible_programs?.find((ep: any) => ep.program === program);
        return detail?.tooltip || "Condition matches program requirements.";
    }, [program, patient]);

    return (
        <div className="relative group cursor-help">
            <span className="text-xs font-semibold bg-itera-blue-light text-itera-blue-dark px-2 py-0.5 rounded-full border border-itera-blue/20">
                {program}
            </span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-yellow-50 text-yellow-900 text-[10px] leading-tight rounded-lg shadow-lg z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-yellow-200/50">
                {reason}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-yellow-200/50"></div>
            </div>
        </div>
    );
};

const calculateAge = (dob: string) => {
    const birthday = new Date(dob);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const PatientIdentity: React.FC<{ patient: MockPatient }> = ({ patient }) => {
    const initials = patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const age = calculateAge(patient.dob);

    return (
        <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs shrink-0 border border-gray-50 shadow-sm">
                {initials}
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-itera-blue-dark uppercase leading-none mb-1 text-[13px]">
                    {patient.name}
                </span>
                <span className="text-[11px] text-gray-500 font-medium lowercase">
                    {age}y {patient.gender || ''} {patient.zipCode || ''}
                </span>
            </div>
        </div>
    );
};

const PatientActionsMenu: React.FC<{
    patient: MockPatient,
    context: 'eligibility' | 'tracking',
    onApprove: (id: number) => void,
    onReject: (id: number) => void,
    onReset: (id: number) => void,
    onLogCall: (id: number) => void,
    onSchedule: (id: number, date: string, time: string) => void,
    onViewDetails: (id: number) => void,
    onViewHistory: (id: number) => void
}> = ({ patient, context, onApprove, onReject, onReset, onLogCall, onSchedule, onViewDetails, onViewHistory }) => {
    const [isOpen, setIsOpen] = useState(false);

    const isPending = patient.status === 'Pending Approval';
    const isApproved = patient.status === 'Approved';
    const isNotApproved = patient.status === 'Not Approved';
    const canOutreach = context === 'tracking' && (isApproved || patient.status.includes('Outreach') || patient.status === 'Consent Sent');

    const handleQuickSchedule = () => {
        setIsOpen(false);
        // Simple demo: schedule for tomorrow at 10:00 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        onSchedule(patient.id, dateStr, "10:00");
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-gray-400 hover:text-itera-blue-dark active:scale-90"
            >
                <MoreHorizontalIcon className="w-5 h-5 transition-transform" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-40 overflow-hidden transform origin-top-right animate-in fade-in zoom-in duration-150">
                        <div className="py-2">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{context === 'eligibility' ? 'Provider Actions' : 'Activation Actions'}</p>
                            </div>
                            {context === 'eligibility' && (isPending || isNotApproved) && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); onApprove(patient.id); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors font-semibold justify-start text-left"
                                >
                                    <CheckCircleIcon className="w-4 h-4 mr-3 shrink-0" />
                                    <span>Approve for Outreach</span>
                                </button>
                            )}
                            {context === 'eligibility' && (isPending || isApproved) && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); onReject(patient.id); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold justify-start text-left"
                                >
                                    <XIcon className="w-4 h-4 mr-3 shrink-0" />
                                    <span>Do Not Approve</span>
                                </button>
                            )}
                            {context === 'tracking' && (isApproved || isNotApproved || patient.status.includes('Outreach')) && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); onReset(patient.id); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-itera-blue hover:bg-itera-blue-light/10 transition-colors font-semibold justify-start text-left"
                                >
                                    <RepeatIcon className="w-4 h-4 mr-3 shrink-0" />
                                    <span>Move to Pending</span>
                                </button>
                            )}
                            {context === 'tracking' && canOutreach && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); onLogCall(patient.id); }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-itera-blue-dark hover:bg-gray-50 transition-colors font-semibold justify-start text-left"
                                    >
                                        <PhoneCall className="w-4 h-4 mr-3 shrink-0" />
                                        <span>Log Call Attempt</span>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleQuickSchedule(); }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-itera-blue-dark hover:bg-gray-50 transition-colors font-semibold justify-start text-left"
                                    >
                                        <CalendarIcon className="w-4 h-4 mr-3 shrink-0" />
                                        <span>Quick Schedule</span>
                                    </button>
                                </>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); onViewHistory(patient.id); }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-semibold border-t border-gray-50 mt-1 justify-start text-left"
                            >
                                <HistoryIcon className="w-4 h-4 mr-3 shrink-0" />
                                <span>View Call History</span>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); onViewDetails(patient.id); }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-semibold border-t border-gray-50 mt-1 justify-start text-left"
                            >
                                <FileTextIcon className="w-4 h-4 mr-3 shrink-0" />
                                <span>View Full Profile</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const PatientTable: React.FC<{
    patients: MockPatient[],
    onApprove: (ids: number[]) => void,
    onReject: (id: number) => void,
    onReset: (id: number) => void,
    onLogCall: (id: number) => void,
    onSchedule: (id: number, date: string, time: string) => void,
    onViewDetails: (id: number) => void,
    onViewHistory: (id: number) => void
}> = ({ patients, onApprove, onReject, onReset, onLogCall, onSchedule, onViewDetails, onViewHistory }) => {
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const handleSelect = (id: number) => {
        setSelected(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const pendingIds = patients.filter(p => p.status === 'Pending Approval').map(p => p.id);
            setSelected(new Set(pendingIds));
        } else {
            setSelected(new Set());
        }
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <button
                    disabled={selected.size === 0}
                    onClick={() => {
                        onApprove(Array.from(selected));
                        setSelected(new Set());
                    }}
                    className="bg-itera-blue text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-itera-blue-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <UserCheckIcon className="w-5 h-5" />
                    Approve ({selected.size}) for Outreach
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg border">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="p-4">
                                <input type="checkbox" onChange={handleSelectAll} />
                            </th>
                            <th scope="col" className="px-6 py-3">Patient</th>
                            <th scope="col" className="px-6 py-3">Eligible Programs</th>
                            <th scope="col" className="px-6 py-3">Insurance</th>
                            <th scope="col" className="px-6 py-3">Chronic Conditions</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(p => (
                            <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="w-4 p-4">
                                    {p.status === 'Pending Approval' && <input type="checkbox" checked={selected.has(p.id)} onChange={() => handleSelect(p.id)} />}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <PatientIdentity patient={p} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {p.eligiblePrograms.length > 0 ? (
                                            p.eligiblePrograms.map(prog => (
                                                <ProgramBadge key={prog} program={prog} patient={p} />
                                            ))
                                        ) : (
                                            <div className="relative group cursor-help">
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-500 px-2 py-0.5 rounded border border-red-100">
                                                    Not Eligible
                                                </span>
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-[10px] leading-tight rounded-lg shadow-xl z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    {p.eligibilityAnalysis?.not_eligible_reason || "Not eligible because Medicare eligibility criteria are not met."}
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest bg-gray-50 border border-gray-100 px-2 py-1 rounded">
                                        {p.insurance || 'Other'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {p.chronicConditions?.map(condition => (
                                            <span key={condition} className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                {condition}
                                            </span>
                                        )) || <span className="text-gray-400 italic">None</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(p.status)}`}>{p.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <PatientActionsMenu
                                        patient={p}
                                        context="eligibility"
                                        onApprove={(id) => onApprove([id])}
                                        onReject={onReject}
                                        onReset={onReset}
                                        onLogCall={onLogCall}
                                        onSchedule={onSchedule}
                                        onViewDetails={onViewDetails}
                                        onViewHistory={onViewHistory}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const TrackingDashboard: React.FC<{
    patients: MockPatient[],
    onApprove: (ids: number[]) => void,
    onReject: (id: number) => void,
    onReset: (id: number) => void,
    onLogCall: (id: number) => void,
    onSchedule: (id: number, date: string, time: string) => void,
    onViewDetails: (id: number) => void,
    onViewHistory: (id: number) => void
}> = ({ patients, onApprove, onReject, onReset, onLogCall, onSchedule, onViewDetails, onViewHistory }) => {
    const activePatients = patients.filter(p => p.status !== 'Pending Approval');
    return (
        <div className="overflow-x-auto bg-white rounded-lg border">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Patient</th>
                        <th scope="col" className="px-6 py-3">Programs</th>
                        <th scope="col" className="px-6 py-3">Insurance</th>
                        <th scope="col" className="px-6 py-3">Care Connection</th>
                        <th scope="col" className="px-6 py-3">Status / Appt</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activePatients.map(p => (
                        <tr key={p.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <PatientIdentity patient={p} />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {p.eligiblePrograms.map(prog => (
                                        <ProgramBadge key={prog} program={prog} patient={p} />
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest bg-gray-50 border border-gray-100 px-2 py-1 rounded">
                                    {p.insurance || 'Other'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-[11px] font-bold text-gray-700 uppercase leading-tight">{p.careManager || 'Unassigned'}</p>
                                <div className="mt-1 space-y-0.5">
                                    <p className="text-[10px] text-gray-400 font-medium">Last: {p.lastCallOutcome || 'No attempts'}</p>
                                    {p.nextCallDate && (
                                        <p className="text-[10px] text-itera-blue font-bold flex items-center gap-1">
                                            <RepeatIcon className="w-2.5 h-2.5" />
                                            Follow-up: {p.nextCallDate.split('T')[0]}
                                        </p>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase w-fit mb-1 ${getStatusColor(p.status)}`}>{p.status}</span>
                                    {p.appointmentDate && (
                                        <span className="text-[10px] font-bold text-itera-blue flex items-center gap-1">
                                            <CalendarIcon className="w-3 h-3" />
                                            {p.appointmentDate.split('T')[0]}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <PatientActionsMenu
                                    patient={p}
                                    context="tracking"
                                    onApprove={(id) => onApprove([id])}
                                    onReject={onReject}
                                    onReset={onReset}
                                    onLogCall={onLogCall}
                                    onSchedule={onSchedule}
                                    onViewDetails={onViewDetails}
                                    onViewHistory={onViewHistory}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface PatientManagementViewProps {
    patients: MockPatient[];
    careManagers: ContactInfo[];
    onApprove: (ids: number[]) => void;
    onReject: (id: number) => void;
    onReset: (id: number) => void;
    onSaveLogCall: (id: number, outcome: string, notes: string, nextAction?: { type: 'appointment' | 'followup', date: string, time: string, careManagerId?: string }) => void;
    onSchedule: (id: number, date: string, time: string) => void;
    onAddPatient: (patient: Omit<MockPatient, 'id' | 'status'>) => void;
    onAssignCareManager: (id: number, manager: string) => void;
}

const PatientManagementView: React.FC<PatientManagementViewProps> = ({
    patients,
    careManagers,
    onApprove,
    onReject,
    onReset,
    onSaveLogCall,
    onSchedule,
    onAddPatient,
    onAssignCareManager
}) => {
    const [activeView, setActiveView] = useState<SubView>('eligibility');
    const [viewingPatientId, setViewingPatientId] = useState<number | null>(null);
    const [viewingHistoryPatientId, setViewingHistoryPatientId] = useState<number | null>(null);
    const [loggingCallPatientId, setLoggingCallPatientId] = useState<number | null>(null);
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Filtering State
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProgram, setFilterProgram] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterInsurance, setFilterInsurance] = useState('All');

    const filteredPatients = useMemo(() => {
        return patients.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.mrn?.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesProgram = filterProgram === 'All' ||
                p.eligiblePrograms.includes(filterProgram) ||
                p.enrolledPrograms?.includes(filterProgram as any);

            const matchesStatus = filterStatus === 'All' || p.status === filterStatus;

            const matchesInsurance = filterInsurance === 'All' || p.insurance === filterInsurance;

            return matchesSearch && matchesProgram && matchesStatus && matchesInsurance;
        });
    }, [patients, searchTerm, filterProgram, filterStatus, filterInsurance]);

    const insuranceOptions = useMemo(() => {
        const unique = new Set(patients.map(p => p.insurance).filter(Boolean));
        return ['All', ...Array.from(unique)];
    }, [patients]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const csvData = event.target?.result as string;
            // Simple parsing: skip header, read lines
            // Regex to match CSV fields: quoted strings or unquoted terms
            const parseCSVLine = (text: string) => {
                const re_value = /(?!\s*$)\s*(?:'([^']*)'|"([^"]*)"|([^,'"]*))\s*(?:,|$)/g;
                const a = [];
                text.replace(re_value, (m0, m1, m2, m3) => {
                    if (m1 !== undefined) a.push(m1.replace(/''/g, "'"));
                    else if (m2 !== undefined) a.push(m2.replace(/""/g, '"'));
                    else if (m3 !== undefined) a.push(m3);
                    return '';
                });
                if (/,\s*$/.test(text)) a.push('');
                return a;
            };

            const lines = csvData.split('\n');
            const newPatients: Omit<MockPatient, 'id' | 'status'>[] = [];

            // Assuming CSV Format: Name, DOB, Gender, ZipCode, Insurance, ICD10_Codes
            // Skipping row 0 (Header)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const cols = parseCSVLine(line);
                if (cols.length < 8) continue; // Allow optional last cols

                const [mrn, name, dob, gender, zipCode, insurance, providerNpi, lastVisitDate, icd10, email, phone, homePhone] = cols;

                // Run Robust Engine
                const analysis = evaluatePatientEligibility({
                    id: mrn,
                    name, dob, gender, zip: zipCode, insurance, icd10_codes: icd10 || '',
                    last_visit_date: lastVisitDate
                });

                const eligiblePrograms = analysis.eligible_programs.map(ep => ep.program);

                newPatients.push({
                    mrn: mrn,
                    name: name,
                    dob: dob,
                    gender: (gender?.toLowerCase() === 'male' || gender?.toLowerCase() === 'female') ? gender.toLowerCase() as 'male' | 'female' : undefined,
                    zipCode: zipCode,
                    insurance: (insurance as any) || 'Other',
                    email: email,
                    phone: phone,
                    homePhone: homePhone,
                    providerNpi: providerNpi,
                    lastVisitDate: lastVisitDate,
                    chronicConditions: analysis.identified_conditions && analysis.identified_conditions.length > 0
                        ? analysis.identified_conditions
                        : (icd10 ? [icd10] : []), // Fallback to raw if logic finds nothing but input exists
                    eligiblePrograms: eligiblePrograms,
                    eligibilityAnalysis: analysis // Store full analysis
                });
            }

            // Batch add patients (one by one through prop for now, or could batch if API supported)
            newPatients.forEach(p => onAddPatient(p));

            // Clear input
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    const handleDownloadTemplate = () => {
        const headers = ['MRN,Name,DOB,Gender,ZipCode,Insurance,Provider_NPI,Last_Visit_Date,ICD10_Codes,Email,Phone,Home_Phone'];
        const rows = [
            'PAT1001,John Doe,1980-05-15,Male,33101,Medicare,1234567890,2023-10-15,"I10, E11",john@example.com,(555) 123-4444,(555) 123-5555',
            'PAT1002,Jane Smith,1975-11-20,Female,10012,Aetna,1234567890,2024-01-20,"J44, I50",jane@example.com,(555) 666-7777,',
            'PAT1003,Robert Jones,1990-03-10,Male,90210,Cigna,9876543210,2022-05-10,"M16"'
        ];
        const csvContent = headers.concat(rows).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'patient_import_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const selectedPatient = useMemo(() =>
        patients.find(p => p.id === viewingPatientId) || null
        , [viewingPatientId, patients]);

    const loggingPatient = useMemo(() =>
        patients.find(p => p.id === loggingCallPatientId) || null
        , [loggingCallPatientId, patients]);

    const handleLogCall = (id: number) => {
        setLoggingCallPatientId(id);
    };

    const historyPatient = useMemo(() =>
        patients.find(p => p.id === viewingHistoryPatientId) || null
        , [viewingHistoryPatientId, patients]);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-itera-blue-dark">Patient Management</h2>
                        <p className="text-gray-500 mt-1">Review clinical cohorts and manage activation workflows.</p>
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200">
                        <button
                            onClick={() => setActiveView('eligibility')}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeView === 'eligibility' ? 'bg-white text-itera-blue-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Eligibility Review
                        </button>
                        <button
                            onClick={() => setActiveView('tracking')}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeView === 'tracking' ? 'bg-white text-itera-blue-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Activation Tracking
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".csv"
                            className="hidden"
                        />
                        <button
                            onClick={handleDownloadTemplate}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95 text-sm"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            Template
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-itera-blue border border-itera-blue/20 font-bold rounded-xl shadow-sm hover:bg-itera-blue-light/30 transition-all active:scale-95 text-sm"
                        >
                            <UploadIcon className="w-4 h-4" />
                            Import CSV
                        </button>
                    </div>
                    <button
                        onClick={() => setIsAddPatientModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-itera-blue text-white font-bold rounded-xl shadow-lg shadow-itera-blue/20 hover:bg-itera-blue-dark transition-all active:scale-95 text-sm"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Register New Patient
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-semibold text-itera-blue-dark">{activeView === 'eligibility' ? 'Patient Eligibility List' : 'Patient Activation Status'}</h3>
                        <p className="text-sm text-gray-500">
                            {activeView === 'eligibility' ? 'Review and approve patients for program outreach.' : 'Monitor the progress of approved patients.'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 text-sm font-semibold border px-3 py-1.5 rounded-lg transition-all ${showFilters ? 'bg-itera-blue text-white border-itera-blue shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? 'Hide Filters' : 'Filter'}
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Search Patient</label>
                            <input
                                type="text"
                                placeholder="Name or MRN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-itera-blue/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Program</label>
                            <select
                                value={filterProgram}
                                onChange={(e) => setFilterProgram(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-itera-blue/20 outline-none transition-all"
                            >
                                <option value="All">All Programs</option>
                                <option value="CCM">CCM</option>
                                <option value="RPM">RPM</option>
                                <option value="APCM">APCM</option>
                                <option value="PCM">PCM</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-itera-blue/20 outline-none transition-all"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Pending Approval">Pending Approval</option>
                                <option value="Approved">Approved</option>
                                <option value="Outreach - 1st Attempt">1st Attempt</option>
                                <option value="Outreach - 2nd Attempt">2nd Attempt</option>
                                <option value="Consent Sent">Consent Sent</option>
                                <option value="Active">Active</option>
                                <option value="Not Approved">Not Approved</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Insurance</label>
                            <select
                                value={filterInsurance}
                                onChange={(e) => setFilterInsurance(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-itera-blue/20 outline-none transition-all"
                            >
                                {insuranceOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt === 'All' ? 'All Insurances' : opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {activeView === 'eligibility' ? (
                    <PatientTable
                        patients={filteredPatients.filter(p => p.status === 'Pending Approval')}
                        onApprove={onApprove}
                        onReject={onReject}
                        onReset={onReset}
                        onLogCall={handleLogCall}
                        onSchedule={onSchedule}
                        onViewDetails={(id) => setViewingPatientId(id)}
                        onViewHistory={(id) => setViewingHistoryPatientId(id)}
                    />
                ) : (
                    <TrackingDashboard
                        patients={filteredPatients.filter(p => p.status !== 'Pending Approval' && p.status !== 'Not Approved')}
                        onApprove={onApprove}
                        onReject={onReject}
                        onReset={onReset}
                        onLogCall={handleLogCall}
                        onSchedule={onSchedule}
                        onViewDetails={(id) => setViewingPatientId(id)}
                        onViewHistory={(id) => setViewingHistoryPatientId(id)}
                    />
                )}
            </div>

            {selectedPatient && (
                <PatientDetailsModal
                    patient={selectedPatient}
                    onClose={() => setViewingPatientId(null)}
                    onLogCall={handleLogCall}
                    onViewHistory={(id) => setViewingHistoryPatientId(id)}
                    onSchedule={onSchedule}
                    onAssignCareManager={onAssignCareManager}
                />
            )}

            {loggingPatient && (
                <LogCallModal
                    patient={loggingPatient}
                    careManagers={careManagers}
                    allPatients={patients}
                    onClose={() => setLoggingCallPatientId(null)}
                    onSave={(outcome, notes, nextAction) => {
                        onSaveLogCall(loggingPatient.id, outcome, notes, nextAction);
                        setLoggingCallPatientId(null);
                    }}
                />
            )}
            {isAddPatientModalOpen && (
                <AddPatientModal
                    onClose={() => setIsAddPatientModalOpen(false)}
                    onSave={(newPatient) => {
                        onAddPatient(newPatient);
                        setIsAddPatientModalOpen(false);
                    }}
                />
            )}
            {historyPatient && (
                <CallHistoryModal
                    patient={historyPatient}
                    onClose={() => setViewingHistoryPatientId(null)}
                />
            )}
        </div>
    );
};

export default PatientManagementView;

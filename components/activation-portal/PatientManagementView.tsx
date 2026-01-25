
import React, { useState, useMemo } from 'react';
import type { MockPatient, PatientStatus } from '../../types';
import { Filter, UserCheckIcon, UsersIcon, MoreHorizontalIcon, CheckCircleIcon, XIcon, FileTextIcon, RepeatIcon, CalendarIcon, PhoneCall } from '../IconComponents';
import PatientDetailsModal from './PatientDetailsModal';
import LogCallModal from './LogCallModal';

type SubView = 'eligibility' | 'tracking';

const getStatusColor = (status: PatientStatus) => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
        case 'Approved': return 'bg-blue-100 text-blue-800';
        case 'Not Approved': return 'bg-red-50 text-red-600 border border-red-100';
        case 'Consent Sent':
        case 'Device Shipped':
            return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
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
    onViewDetails: (id: number) => void
}> = ({ patient, context, onApprove, onReject, onReset, onLogCall, onSchedule, onViewDetails }) => {
    const [isOpen, setIsOpen] = useState(false);

    const isPending = patient.status === 'Pending Approval';
    const isApproved = patient.status === 'Approved';
    const isNotApproved = patient.status === 'Not Approved';
    const canOutreach = context === 'tracking' && (isApproved || patient.status.includes('Outreach') || patient.status === 'Consent Sent');

    const handleQuickSchedule = () => {
        // Simple demo: schedule for tomorrow at 10:00 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        onSchedule(patient.id, dateStr, "10:00");
        setIsOpen(false);
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
                                    onClick={() => { onApprove(patient.id); setIsOpen(false); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-green-600 hover:bg-green-50 transition-colors font-semibold justify-start text-left"
                                >
                                    <CheckCircleIcon className="w-4 h-4 mr-3 shrink-0" />
                                    <span>Approve for Outreach</span>
                                </button>
                            )}
                            {context === 'eligibility' && (isPending || isApproved) && (
                                <button
                                    onClick={() => { onReject(patient.id); setIsOpen(false); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold justify-start text-left"
                                >
                                    <XIcon className="w-4 h-4 mr-3 shrink-0" />
                                    <span>Do Not Approve</span>
                                </button>
                            )}
                            {context === 'tracking' && (isApproved || isNotApproved || patient.status.includes('Outreach')) && (
                                <button
                                    onClick={() => { onReset(patient.id); setIsOpen(false); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-itera-blue hover:bg-itera-blue-light/10 transition-colors font-semibold justify-start text-left"
                                >
                                    <RepeatIcon className="w-4 h-4 mr-3 shrink-0" />
                                    <span>Move to Pending</span>
                                </button>
                            )}
                            {context === 'tracking' && canOutreach && (
                                <>
                                    <button
                                        onClick={() => { onLogCall(patient.id); setIsOpen(false); }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-itera-blue-dark hover:bg-gray-50 transition-colors font-semibold justify-start text-left"
                                    >
                                        <PhoneCall className="w-4 h-4 mr-3 shrink-0" />
                                        <span>Log Call Attempt</span>
                                    </button>
                                    <button
                                        onClick={handleQuickSchedule}
                                        className="flex items-center w-full px-4 py-3 text-sm text-itera-blue-dark hover:bg-gray-50 transition-colors font-semibold justify-start text-left"
                                    >
                                        <CalendarIcon className="w-4 h-4 mr-3 shrink-0" />
                                        <span>Quick Schedule</span>
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => { onViewDetails(patient.id); setIsOpen(false); }}
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
    onViewDetails: (id: number) => void
}> = ({ patients, onApprove, onReject, onReset, onLogCall, onSchedule, onViewDetails }) => {
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
                                        {p.eligiblePrograms.map(prog => <span key={prog} className="text-xs font-semibold bg-itera-blue-light text-itera-blue-dark px-2 py-0.5 rounded-full">{prog}</span>)}
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
    onViewDetails: (id: number) => void
}> = ({ patients, onApprove, onReject, onReset, onLogCall, onSchedule, onViewDetails }) => {
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
                                    {p.eligiblePrograms.map(prog => <span key={prog} className="text-xs font-semibold bg-itera-blue-light text-itera-blue-dark px-2 py-0.5 rounded-full">{prog}</span>)}
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
    onApprove: (ids: number[]) => void;
    onReject: (id: number) => void;
    onReset: (id: number) => void;
    onSaveLogCall: (id: number, outcome: string, notes: string, nextAction?: { type: 'appointment' | 'followup', date: string, time: string }) => void;
    onSchedule: (id: number, date: string, time: string) => void;
}

const PatientManagementView: React.FC<PatientManagementViewProps> = ({
    patients,
    onApprove,
    onReject,
    onReset,
    onSaveLogCall,
    onSchedule
}) => {
    const [activeView, setActiveView] = useState<SubView>('eligibility');
    const [viewingPatientId, setViewingPatientId] = useState<number | null>(null);
    const [loggingCallPatientId, setLoggingCallPatientId] = useState<number | null>(null);

    const selectedPatient = useMemo(() =>
        patients.find(p => p.id === viewingPatientId) || null
        , [viewingPatientId, patients]);

    const loggingPatient = useMemo(() =>
        patients.find(p => p.id === loggingCallPatientId) || null
        , [loggingCallPatientId, patients]);

    const handleLogCall = (id: number) => {
        setLoggingCallPatientId(id);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-itera-blue-dark">Patient Management</h2>
                <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
                    <button onClick={() => setActiveView('eligibility')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${activeView === 'eligibility' ? 'bg-white shadow' : 'text-gray-600'}`}>Eligibility Review</button>
                    <button onClick={() => setActiveView('tracking')} className={`px-4 py-1.5 text-sm font-semibold rounded-md ${activeView === 'tracking' ? 'bg-white shadow' : 'text-gray-600'}`}>Activation Tracking</button>
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
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 border px-3 py-1.5 rounded-lg hover:bg-gray-100">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                {activeView === 'eligibility' ? (
                    <PatientTable
                        patients={patients.filter(p => p.status === 'Pending Approval')}
                        onApprove={onApprove}
                        onReject={onReject}
                        onReset={onReset}
                        onLogCall={handleLogCall}
                        onSchedule={onSchedule}
                        onViewDetails={(id) => setViewingPatientId(id)}
                    />
                ) : (
                    <TrackingDashboard
                        patients={patients.filter(p => p.status !== 'Pending Approval' && p.status !== 'Not Approved')}
                        onApprove={onApprove}
                        onReject={onReject}
                        onReset={onReset}
                        onLogCall={handleLogCall}
                        onSchedule={onSchedule}
                        onViewDetails={(id) => setViewingPatientId(id)}
                    />
                )}
            </div>

            {selectedPatient && (
                <PatientDetailsModal
                    patient={selectedPatient}
                    onClose={() => setViewingPatientId(null)}
                    onLogCall={handleLogCall}
                    onSchedule={onSchedule}
                />
            )}

            {loggingPatient && (
                <LogCallModal
                    patient={loggingPatient}
                    onClose={() => setLoggingCallPatientId(null)}
                    onSave={(outcome, notes, nextAction) => {
                        onSaveLogCall(loggingPatient.id, outcome, notes, nextAction);
                        setLoggingCallPatientId(null);
                    }}
                />
            )}
        </div>
    );
};

export default PatientManagementView;

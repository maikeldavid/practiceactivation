import React, { useState, useMemo } from 'react';
import type { MockPatient, PatientStatus } from '../../types';
import {
    PhoneCall,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    UserIcon,
    SearchIcon,
    Filter,
    BarChart3,
    ArrowRightIcon,
    HistoryIcon,
    HeadsetIcon,
    MoreHorizontalIcon,
    RepeatIcon
} from '../IconComponents';
import LogCallModal from './LogCallModal';
import PatientDetailsModal from './PatientDetailsModal';

interface OutreachWorkspaceViewProps {
    patients: MockPatient[];
    onSaveLogCall: (id: number, outcome: string, notes: string, nextAction?: { type: 'appointment' | 'followup', date: string, time: string }) => void;
}

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

const OutreachWorkspaceView: React.FC<OutreachWorkspaceViewProps> = ({
    patients,
    onSaveLogCall
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewingPatientId, setViewingPatientId] = useState<number | null>(null);
    const [loggingCallPatientId, setLoggingCallPatientId] = useState<number | null>(null);

    const filteredPatients = useMemo(() => {
        const filtered = patients.filter(p => {
            // Include patients planned for selectedDate OR Approved patients (if selectedDate is today)
            const isToday = selectedDate === new Date().toISOString().split('T')[0];
            const isPlannedForDate = p.nextCallDate?.startsWith(selectedDate);
            const wasManagedOnDate = p.callAttemptDate?.startsWith(selectedDate);
            const isNewlyApproved = isToday && p.status === 'Approved';

            const matchesDate = isPlannedForDate || wasManagedOnDate || isNewlyApproved;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.phone?.includes(searchQuery);

            return matchesDate && matchesSearch;
        });

        return [...filtered].sort((a, b) => {
            const aIsCompleted = a.callAttemptDate?.startsWith(selectedDate);
            const bIsCompleted = b.callAttemptDate?.startsWith(selectedDate);

            // Completed calls always at the bottom
            if (aIsCompleted && !bIsCompleted) return 1;
            if (!aIsCompleted && bIsCompleted) return -1;

            // Prioritization for non-completed
            const getPriority = (p: MockPatient) => {
                // 1. Planned for today
                if (p.nextCallDate?.startsWith(selectedDate)) return 1;
                // 2. Newly approved and never called
                if (p.status === 'Approved' && !p.callAttemptDate) return 2;
                // 3. Pending re-management (everyone else in the list)
                return 3;
            };

            const priorityA = getPriority(a);
            const priorityB = getPriority(b);

            if (priorityA !== priorityB) return priorityA - priorityB;

            // Secondary sort by name if priorities are the same
            return a.name.localeCompare(b.name);
        });
    }, [patients, selectedDate, searchQuery]);

    const stats = useMemo(() => {
        const planned = filteredPatients.length;
        const completed = filteredPatients.filter(p => p.callAttemptDate?.startsWith(selectedDate)).length;
        const pending = planned - completed;

        return { planned, completed, pending };
    }, [filteredPatients, selectedDate]);

    const selectedPatient = useMemo(() =>
        patients.find(p => p.id === viewingPatientId) || null
        , [viewingPatientId, patients]);

    const loggingPatient = useMemo(() =>
        patients.find(p => p.id === loggingCallPatientId) || null
        , [loggingCallPatientId, patients]);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-itera-blue-dark flex items-center gap-3">
                        <HeadsetIcon className="w-8 h-8 text-itera-blue" />
                        Outreach Workspace
                    </h2>
                    <p className="text-gray-500 mt-1">Manage daily call plans and track activation progress.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-itera-blue-dark focus:ring-2 focus:ring-itera-blue outline-none shadow-sm"
                        />
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Planned Today</span>
                        <div className="w-8 h-8 rounded-lg bg-itera-blue-light/30 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-itera-blue" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-itera-blue-dark">{stats.planned}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calls Completed</span>
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Outreach</span>
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                            <ClockIcon className="w-4 h-4 text-orange-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:max-w-md">
                        <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-itera-blue outline-none transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <Filter className="w-4 h-4" />
                        Advanced Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Patient Identity</th>
                                <th className="px-6 py-4">Current Status</th>
                                <th className="px-6 py-4">Last Interaction</th>
                                <th className="px-6 py-4">Management Outcome</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredPatients.length > 0 ? filteredPatients.map(p => {
                                const isCompleted = p.callAttemptDate?.startsWith(selectedDate);
                                return (
                                    <tr key={p.id} className={`group hover:bg-gray-50/80 transition-all ${isCompleted ? 'opacity-60' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-itera-blue-light/20 flex items-center justify-center text-itera-blue font-bold text-xs">
                                                    {p.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-itera-blue-dark text-sm lowercase">{p.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium">{p.phone || 'No phone'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(p.status)}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {p.callAttemptDate ? (
                                                <div className="space-y-1">
                                                    <p className="text-gray-700 font-medium">Last Interaction: {p.callAttemptDate.split('T')[0]}</p>
                                                    {p.careManager && <p className="text-itera-blue text-[10px] font-bold uppercase">{p.careManager}</p>}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">No previous calls</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.lastCallOutcome ? (
                                                <div className="max-w-xs">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-xs font-bold text-gray-700 leading-tight">{p.lastCallOutcome}</p>
                                                        {p.nextCallDate?.startsWith(selectedDate) && (
                                                            <span className="px-1.5 py-0.5 bg-itera-blue/10 text-itera-blue text-[9px] font-black uppercase rounded whitespace-nowrap">Planned Follow-up</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 line-clamp-1">{p.lastCallNotes}</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Waiting for outreach</span>
                                                    {p.status === 'Approved' && !p.callAttemptDate && (
                                                        <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-black uppercase rounded w-fit">New Assignment</span>
                                                    )}
                                                    {p.nextCallDate?.startsWith(selectedDate) && (
                                                        <span className="inline-block px-1.5 py-0.5 bg-itera-blue/10 text-itera-blue text-[9px] font-black uppercase rounded w-fit">Planned for Today</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {isCompleted ? (
                                                <div className="flex items-center justify-end gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    Managed
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setLoggingCallPatientId(p.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-itera-blue text-white text-xs font-bold rounded-xl shadow-md hover:bg-itera-blue-dark active:scale-95 transition-all"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5" />
                                                    Call Patient
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <HistoryIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 font-medium">No patients found for this date or criteria.</p>
                                        <button
                                            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                                            className="text-itera-blue text-sm font-bold mt-2 hover:underline"
                                        >
                                            Go to Today
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tip section (Now full width or better integrated) */}
            <div className="bg-itera-blue-dark p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2 italic">Call Center Tip</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Prioritize patients with <strong>newly approved eligibility</strong>. Early outreach within 24 hours increases conversion rates by up to <strong>40%</strong>. Patients managed in "Activation Tracking" will automatically appear here.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <BarChart3 className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Next Target</p>
                                <p className="text-xs font-bold">New Approvals</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Abstract design elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-itera-blue/20 rounded-full blur-2xl"></div>
            </div>

            {/* Modals */}
            {viewingPatientId && selectedPatient && (
                <PatientDetailsModal
                    patient={selectedPatient}
                    onClose={() => setViewingPatientId(null)}
                />
            )}

            {loggingCallPatientId && loggingPatient && (
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

export default OutreachWorkspaceView;

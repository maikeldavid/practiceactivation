import React, { useState, useMemo } from 'react';
import type { MockPatient, PatientStatus, ContactInfo } from '../../types';
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
    RepeatIcon,
    LayoutList,
    LayoutGrid,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDown,
    XIcon
} from '../IconComponents';
import LogCallModal from './LogCallModal';
import PatientDetailsModal from './PatientDetailsModal';
import CallHistoryModal from './CallHistoryModal';

interface OutreachWorkspaceViewProps {
    patients: MockPatient[];
    careManagers: ContactInfo[];
    onSaveLogCall: (id: number, outcome: string, notes: string, nextAction?: { type: 'appointment' | 'followup', date: string, time: string, careManagerId?: string }) => void;
    onSuggestPatient?: () => void;
}

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

const OutreachWorkspaceView: React.FC<OutreachWorkspaceViewProps> = ({
    patients,
    careManagers,
    onSaveLogCall,
    onSuggestPatient
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewingPatientId, setViewingPatientId] = useState<number | null>(null);
    const [loggingCallPatientId, setLoggingCallPatientId] = useState<number | null>(null);
    const [viewingHistoryPatientId, setViewingHistoryPatientId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [selectedCM, setSelectedCM] = useState<string>('all');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [taskTypeFilter, setTaskTypeFilter] = useState<'all' | 'appointment' | 'followup'>('all');

    const filteredPatients = useMemo(() => {
        const filtered = patients.filter(p => {
            // Include patients planned for selectedDate OR Approved patients (if selectedDate is today)
            const isToday = selectedDate === new Date().toISOString().split('T')[0];
            const isPlannedForDate = p.nextCallDate?.startsWith(selectedDate);
            const isAppointmentForDate = p.appointmentDate?.startsWith(selectedDate);
            const wasManagedOnDate = p.callAttemptDate?.startsWith(selectedDate);
            const isNewlyApproved = isToday && p.status === 'Approved';

            const matchesDate = isPlannedForDate || isAppointmentForDate || wasManagedOnDate || isNewlyApproved;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.phone?.includes(searchQuery);

            // Additional Filters
            const matchesCM = selectedCM === 'all' || p.careManager === selectedCM;
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
            const matchesTaskType = taskTypeFilter === 'all' ||
                (taskTypeFilter === 'appointment' && isAppointmentForDate) ||
                (taskTypeFilter === 'followup' && isPlannedForDate);

            return matchesDate && matchesSearch && matchesCM && matchesStatus && matchesTaskType;
        });

        return [...filtered].sort((a, b) => {
            const aIsCompleted = a.callAttemptDate?.startsWith(selectedDate);
            const bIsCompleted = b.callAttemptDate?.startsWith(selectedDate);

            // Completed calls always at the bottom
            if (aIsCompleted && !bIsCompleted) return 1;
            if (!aIsCompleted && bIsCompleted) return -1;

            // Prioritization for non-completed
            const getPriority = (p: MockPatient) => {
                // 1. Appointments for today (Highest Priority)
                if (p.appointmentDate?.startsWith(selectedDate)) return 0;
                // 2. Planned follow-ups for today
                if (p.nextCallDate?.startsWith(selectedDate)) return 1;
                // 3. Newly approved and never called
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

    const historyPatient = useMemo(() =>
        patients.find(p => p.id === viewingHistoryPatientId) || null
        , [viewingHistoryPatientId, patients]);

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

                <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-itera-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <LayoutList className="w-3.5 h-3.5" />
                        List
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-white text-itera-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Calendar
                    </button>
                </div>

                <div className="relative">
                    <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-itera-blue-dark focus:ring-2 focus:ring-itera-blue outline-none shadow-sm"
                    />
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
                    {stats.pending === 0 && onSuggestPatient && (
                        <button
                            onClick={onSuggestPatient}
                            className="mt-3 w-full py-2 bg-itera-blue/10 text-itera-blue text-xs font-bold rounded-lg hover:bg-itera-blue hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <RepeatIcon className="w-3.5 h-3.5" />
                            Suggest Next Patient
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            {viewMode === 'list' ? (
                <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-initial">
                                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select
                                    value={selectedCM}
                                    onChange={(e) => setSelectedCM(e.target.value)}
                                    className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-itera-blue outline-none appearance-none cursor-pointer shadow-sm hover:border-itera-blue/30 transition-all min-w-[160px]"
                                >
                                    <option value="all">All Care Managers</option>
                                    {careManagers.map(cm => (
                                        <option key={cm.id} value={cm.name}>{cm.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm ${showAdvancedFilters
                                    ? 'bg-itera-blue text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {(statusFilter !== 'all' || taskTypeFilter !== 'all') && (
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filter Panel */}
                    {showAdvancedFilters && (
                        <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/30 animate-in slide-in-from-top-4 duration-300">
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Patient Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="block w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:ring-2 focus:ring-itera-blue outline-none"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="Active">Active</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Scheduled with CM">Scheduled with CM</option>
                                        <option value="Consent Sent">Consent Sent</option>
                                        <option value="Device Shipped">Device Shipped</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Task Type</label>
                                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-inner">
                                        <button
                                            onClick={() => setTaskTypeFilter('all')}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${taskTypeFilter === 'all' ? 'bg-itera-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setTaskTypeFilter('appointment')}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${taskTypeFilter === 'appointment' ? 'bg-itera-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Appts
                                        </button>
                                        <button
                                            onClick={() => setTaskTypeFilter('followup')}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${taskTypeFilter === 'followup' ? 'bg-itera-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Follow-ups
                                        </button>
                                    </div>
                                </div>

                                <div className="ml-auto flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setStatusFilter('all');
                                            setTaskTypeFilter('all');
                                            setSelectedCM('all');
                                            setSearchQuery('');
                                        }}
                                        className="text-[10px] font-bold text-gray-400 hover:text-itera-blue transition-colors flex items-center gap-1.5"
                                    >
                                        <RepeatIcon className="w-3 h-3" />
                                        Reset All
                                    </button>
                                    <button
                                        onClick={() => setShowAdvancedFilters(false)}
                                        className="p-1 px-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                    >
                                        <XIcon className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                                    const isAppointment = p.appointmentDate?.startsWith(selectedDate);
                                    return (
                                        <tr key={p.id} className={`group hover:bg-gray-50/80 transition-all ${isCompleted ? 'opacity-60' : ''}`}>
                                            <td className="px-6 py-4 cursor-pointer" onClick={() => setViewingPatientId(p.id)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-itera-blue-light/20 flex items-center justify-center text-itera-blue font-bold text-xs group-hover:bg-itera-blue group-hover:text-white transition-all">
                                                        {p.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-itera-blue-dark text-sm lowercase group-hover:text-itera-blue transition-colors">{p.name}</p>
                                                            {isAppointment && (
                                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[8px] font-black uppercase rounded">Appt</span>
                                                            )}
                                                        </div>
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
                                                                <span className="px-1.5 py-0.5 bg-itera-blue/10 text-itera-blue text-[9px] font-black uppercase rounded whitespace-nowrap">Follow-up</span>
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
                                                            <span className="inline-block px-1.5 py-0.5 bg-itera-blue/10 text-itera-blue text-[9px] font-black uppercase rounded w-fit">Planned Task</span>
                                                        )}
                                                        {isAppointment && (
                                                            <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-black uppercase rounded w-fit">Scheduled Appt</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setViewingPatientId(p.id)}
                                                        className="p-2 text-gray-400 hover:text-itera-blue hover:bg-gray-100 rounded-xl transition-all"
                                                        title="View Profile"
                                                    >
                                                        <UserIcon className="w-4 h-4" />
                                                    </button>

                                                    {isCompleted ? (
                                                        <div className="flex items-center justify-end gap-2 text-green-600 font-bold text-xs uppercase tracking-widest px-2">
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                            Managed
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setLoggingCallPatientId(p.id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-itera-blue text-white text-xs font-bold rounded-xl shadow-md hover:bg-itera-blue-dark active:scale-95 transition-all"
                                                        >
                                                            <PhoneCall className="w-3.5 h-3.5" />
                                                            {isAppointment ? 'Start Appt' : 'Call Patient'}
                                                        </button>
                                                    )}
                                                </div>
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
            ) : (
                <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header with Filters */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                            <h3 className="text-xl font-bold text-itera-blue-dark">Workload Calendar</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const d = new Date(selectedDate);
                                        d.setMonth(d.getMonth() - 1);
                                        setSelectedDate(d.toISOString().split('T')[0]);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
                                </button>
                                <button
                                    onClick={() => {
                                        const d = new Date(selectedDate);
                                        d.setMonth(d.getMonth() + 1);
                                        setSelectedDate(d.toISOString().split('T')[0]);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
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
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-initial">
                                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <select
                                        value={selectedCM}
                                        onChange={(e) => setSelectedCM(e.target.value)}
                                        className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-itera-blue outline-none appearance-none cursor-pointer shadow-sm hover:border-itera-blue/30 transition-all min-w-[160px]"
                                    >
                                        <option value="all">All Care Managers</option>
                                        {careManagers.map(cm => (
                                            <option key={cm.id} value={cm.name}>{cm.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                                <button
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm ${showAdvancedFilters
                                        ? 'bg-itera-blue text-white'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Filter className="w-4 h-4" />
                                    Filters
                                    {(statusFilter !== 'all' || taskTypeFilter !== 'all') && (
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Filter Panel */}
                    {showAdvancedFilters && (
                        <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/30 animate-in slide-in-from-top-4 duration-300">
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Patient Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="block w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:ring-2 focus:ring-itera-blue outline-none"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="Active">Active</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Scheduled with CM">Scheduled with CM</option>
                                        <option value="Consent Sent">Consent Sent</option>
                                        <option value="Device Shipped">Device Shipped</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Task Type</label>
                                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-inner">
                                        <button
                                            onClick={() => setTaskTypeFilter('all')}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${taskTypeFilter === 'all' ? 'bg-itera-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setTaskTypeFilter('appointment')}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${taskTypeFilter === 'appointment' ? 'bg-itera-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Appts
                                        </button>
                                        <button
                                            onClick={() => setTaskTypeFilter('followup')}
                                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${taskTypeFilter === 'followup' ? 'bg-itera-blue text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Follow-ups
                                        </button>
                                    </div>
                                </div>

                                <div className="ml-auto flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setStatusFilter('all');
                                            setTaskTypeFilter('all');
                                            setSelectedCM('all');
                                            setSearchQuery('');
                                        }}
                                        className="text-[10px] font-bold text-gray-400 hover:text-itera-blue transition-colors flex items-center gap-1.5"
                                    >
                                        <RepeatIcon className="w-3 h-3" />
                                        Reset All
                                    </button>
                                    <button
                                        onClick={() => setShowAdvancedFilters(false)}
                                        className="p-1 px-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                    >
                                        <XIcon className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-6">

                        <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="bg-gray-50 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {day}
                                </div>
                            ))}

                            {Array.from({ length: 42 }).map((_, i) => {
                                const date = new Date(selectedDate);
                                date.setDate(1);
                                const firstDay = date.getDay();
                                const currentDay = new Date(date);
                                currentDay.setDate(i - firstDay + 1);
                                const dateStr = currentDay.toISOString().split('T')[0];
                                const isCurrentMonth = currentDay.getMonth() === new Date(selectedDate).getMonth();
                                const isToday = dateStr === new Date().toISOString().split('T')[0];
                                const isSelected = dateStr === selectedDate;

                                // Calculate daily work with filters
                                const dayPatients = patients.filter(p => {
                                    // 1. Must have work on this specific date
                                    const hasWorkOnDate = p.nextCallDate?.startsWith(dateStr) || p.appointmentDate?.startsWith(dateStr);
                                    if (!hasWorkOnDate) return false;

                                    // 2. Apply Global Filters
                                    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        p.phone?.includes(searchQuery);
                                    const matchesCM = selectedCM === 'all' || p.careManager === selectedCM;
                                    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

                                    // 3. Apply Contextual Task Filter
                                    const matchesTaskType = taskTypeFilter === 'all' ||
                                        (taskTypeFilter === 'appointment' && p.appointmentDate?.startsWith(dateStr)) ||
                                        (taskTypeFilter === 'followup' && p.nextCallDate?.startsWith(dateStr));

                                    return matchesSearch && matchesCM && matchesStatus && matchesTaskType;
                                });

                                const appointments = dayPatients.filter(p => p.appointmentDate?.startsWith(dateStr)).length;
                                const followups = dayPatients.filter(p => p.nextCallDate?.startsWith(dateStr)).length;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedDate(dateStr);
                                            setViewMode('list');
                                        }}
                                        className={`relative h-32 p-3 text-left transition-all hover:z-10 bg-white hover:bg-gray-50 flex flex-col gap-2 ${!isCurrentMonth ? 'opacity-30' : ''} ${isSelected ? 'ring-2 ring-inset ring-itera-blue bg-blue-50/30' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-bold ${isToday ? 'w-7 h-7 bg-itera-blue text-white rounded-full flex items-center justify-center -ml-1 -mt-1' : 'text-gray-900'}`}>
                                                {currentDay.getDate()}
                                            </span>
                                            {dayPatients.length > 0 && isCurrentMonth && (
                                                <span className="w-2 h-2 rounded-full bg-itera-blue animate-pulse" />
                                            )}
                                        </div>

                                        {isCurrentMonth && dayPatients.length > 0 && (
                                            <div className="mt-auto space-y-1">
                                                {appointments > 0 && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100">
                                                        <CalendarIcon className="w-3 h-3" />
                                                        <span className="text-[10px] font-bold">{appointments} Appt</span>
                                                    </div>
                                                )}
                                                {followups > 0 && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-itera-blue rounded-lg border border-blue-100">
                                                        <RepeatIcon className="w-3 h-3" />
                                                        <span className="text-[10px] font-bold">{followups} Task</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Tip section (Now full width or better integrated) */}
            < div className="bg-itera-blue-dark p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group" >
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
            </div >

            {/* Modals */}
            {
                viewingPatientId && selectedPatient && (
                    <PatientDetailsModal
                        patient={selectedPatient}
                        onClose={() => setViewingPatientId(null)}
                        onLogCall={(id) => {
                            setViewingPatientId(null);
                            setLoggingCallPatientId(id);
                        }}
                        onViewHistory={(id) => setViewingHistoryPatientId(id)}
                    />
                )
            }

            {
                loggingCallPatientId && loggingPatient && (
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
                )
            }

            {
                viewingHistoryPatientId && historyPatient && (
                    <CallHistoryModal
                        patient={historyPatient}
                        onClose={() => setViewingHistoryPatientId(null)}
                    />
                )
            }
        </div >
    );
};

export default OutreachWorkspaceView;

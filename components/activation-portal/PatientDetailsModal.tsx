
import React from 'react';
import { XIcon, UserIcon, HeartPulseIcon, ActivityIcon, ShieldCheckIcon, CalendarIcon, BriefcaseIcon, PhoneCall, CheckCircleIcon, MailIcon, MapPinIcon, PillIcon } from '../IconComponents';
import type { MockPatient } from '../../types';

interface PatientDetailsModalProps {
    patient: MockPatient;
    onClose: () => void;
    onLogCall?: (id: number) => void;
    onSchedule?: (id: number, date: string, time: string) => void;
}

const calculateAge = (dob: string) => {
    const birthday = new Date(dob);
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return dateString.split('T')[0];
};

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ patient, onClose, onLogCall, onSchedule }) => {
    const age = calculateAge(patient.dob);
    const [scheduleDate, setScheduleDate] = React.useState('');
    const [scheduleTime, setScheduleTime] = React.useState('');
    const [isScheduling, setIsScheduling] = React.useState(false);

    const handleLogCall = () => {
        if (onLogCall) onLogCall(patient.id);
    };

    const handleSchedule = () => {
        if (onSchedule && scheduleDate && scheduleTime) {
            onSchedule(patient.id, scheduleDate, scheduleTime);
            setIsScheduling(false);
        }
    };

    const isPendingOutreach = patient.status === 'Approved' || patient.status.includes('Outreach');

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 overflow-y-auto pt-10 sm:pt-20">
            <div className="absolute inset-0 bg-itera-blue-dark/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-itera-blue-dark p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-xl">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`}
                                alt={patient.name}
                                className="w-full h-full object-cover bg-itera-blue-light/20"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap mb-3">
                                <h2 className="text-3xl font-bold uppercase tracking-tight truncate">{patient.name}</h2>
                                <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-xs font-bold text-white/90 border border-white/10 uppercase tracking-widest">{patient.zipCode || '00000'}</span>
                                <span className="px-2 py-0.5 bg-blue-500/50 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-widest">{patient.gender || 'Unknown'}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-widest ${patient.status === 'Active' ? 'bg-green-500/50' : 'bg-gray-500/50'}`}>
                                    {patient.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-white/70 text-[11px] font-medium uppercase tracking-wider">
                                <span className="flex items-center gap-2">
                                    <CalendarIcon className="w-3.5 h-3.5" />
                                    {formatDate(patient.dob)} ({age}yr)
                                </span>
                                <span className="flex items-center gap-2 text-white/90 truncate">
                                    <MailIcon className="w-3.5 h-3.5" />
                                    {patient.email || 'Email not provided'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <PhoneCall className="w-3.5 h-3.5" />
                                    {patient.phone || 'Phone not provided'}
                                </span>
                                <span className="flex items-center gap-2 lg:col-span-1">
                                    <MapPinIcon className="w-3.5 h-3.5" />
                                    {patient.address || 'Address not provided'}
                                </span>
                                <span className="flex items-center gap-2 lg:col-span-2">
                                    <BriefcaseIcon className="w-3.5 h-3.5" />
                                    {patient.insurance || 'No Insurance Data'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Personal & Clinical */}
                        <div className="lg:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-itera-blue-dark mb-4 flex items-center gap-2">
                                    <HeartPulseIcon className="w-5 h-5 text-itera-blue" />
                                    Clinical Profile
                                </h3>
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Primary Chronic Conditions</span>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.chronicConditions?.map(condition => (
                                            <span key={condition} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-itera-blue-dark shadow-sm">
                                                {condition}
                                            </span>
                                        )) || <span className="text-gray-400 italic text-sm">No conditions reported</span>}
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-itera-blue-dark mb-4 flex items-center gap-2">
                                    <ActivityIcon className="w-5 h-5 text-itera-blue" />
                                    Program Eligibility
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {patient.eligiblePrograms.map(prog => (
                                        <div key={prog} className="flex items-center justify-between p-4 bg-itera-blue-light/20 border border-itera-blue-light/30 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-itera-blue text-white flex items-center justify-center text-xs font-bold">
                                                    {prog}
                                                </div>
                                                <span className="font-bold text-itera-blue-dark text-sm">{prog} Program</span>
                                            </div>
                                            <CheckCircleIcon className="w-5 h-5 text-itera-blue" />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-itera-blue-dark mb-4 flex items-center gap-2">
                                    <PillIcon className="w-5 h-5 text-itera-blue" />
                                    Current Medications
                                </h3>
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <div className="flex flex-wrap gap-2">
                                        {patient.medications?.map(med => (
                                            <span key={med} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 shadow-sm flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-itera-blue"></div>
                                                {med}
                                            </span>
                                        )) || <span className="text-gray-400 italic text-sm">No medications listed</span>}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Tracking & Actions */}
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-itera-blue-dark mb-4">Activation Status</h3>
                                <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-6">
                                    <div className="mb-6">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Current Milestone</label>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border block text-center ${patient.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                                            patient.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                'bg-gray-100 text-gray-700 border-gray-200'
                                            }`}>
                                            {patient.status}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Care Manager</span>
                                            <span className="text-sm font-bold text-itera-blue-dark">{patient.careManager || 'Not Assigned'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Call Attempt</span>
                                            <span className="text-sm font-bold text-gray-700">{formatDate(patient.callAttemptDate) || 'None recorded'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Manager Appointment</span>
                                            <span className="text-sm font-bold text-itera-blue">{patient.appointmentDate ? formatDate(patient.appointmentDate) : 'Not scheduled'}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="space-y-3">
                                {isPendingOutreach && (
                                    <>
                                        <button
                                            onClick={handleLogCall}
                                            className="w-full flex items-center justify-center gap-2 bg-white text-itera-blue border border-itera-blue font-bold py-3.5 rounded-xl hover:bg-itera-blue-light/20 transition-all active:scale-95"
                                        >
                                            <PhoneCall className="w-5 h-5" />
                                            Log Call Attempt
                                        </button>
                                        <button
                                            onClick={() => setIsScheduling(!isScheduling)}
                                            className="w-full flex items-center justify-center gap-2 bg-itera-blue text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-itera-blue-dark transition-all active:scale-95"
                                        >
                                            <CalendarIcon className="w-5 h-5" />
                                            {isScheduling ? 'Discard Scheduling' : 'Schedule Appointment'}
                                        </button>
                                    </>
                                )}

                                {isScheduling && (
                                    <div className="bg-gray-50 border border-itera-blue/20 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-itera-blue-dark uppercase tracking-widest">Appointment Date</label>
                                            <input
                                                type="date"
                                                value={scheduleDate}
                                                onChange={(e) => setScheduleDate(e.target.value)}
                                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-itera-blue outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-itera-blue-dark uppercase tracking-widest">Preferred Time</label>
                                            <input
                                                type="time"
                                                value={scheduleTime}
                                                onChange={(e) => setScheduleTime(e.target.value)}
                                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-itera-blue outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSchedule}
                                            disabled={!scheduleDate || !scheduleTime}
                                            className="w-full bg-itera-blue text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Confirm Appointment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Close Patient Record
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailsModal;

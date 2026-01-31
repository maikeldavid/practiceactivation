
import React, { useState } from 'react';
import { XIcon, PhoneCall, CalendarIcon, FileTextIcon, CheckCircleIcon, UserIcon, ArrowRightIcon, AlertTriangleIcon, ClockIcon } from '../IconComponents';
import type { MockPatient, ContactInfo } from '../../types';
import CustomDatePicker from './CustomDatePicker';

interface LogCallModalProps {
    patient: MockPatient;
    careManagers: ContactInfo[];
    allPatients: MockPatient[];
    onClose: () => void;
    onSave: (outcome: string, notes: string, nextAction?: { type: 'appointment' | 'followup', date: string, time: string, careManagerId?: string }) => void;
}

const OUTCOMES = [
    "Connected - Interested",
    "Connected - Not Interested",
    "Connected - Call Back Later",
    "No Answer / Voicemail",
    "Wrong Number",
    "DNC (Do Not Call)"
];

const LogCallModal: React.FC<LogCallModalProps> = ({ patient, careManagers, allPatients, onClose, onSave }) => {
    const [outcome, setOutcome] = useState('');
    const [notes, setNotes] = useState('');
    const [nextActionType, setNextActionType] = useState<'none' | 'appointment' | 'followup'>('none');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [selectedCMId, setSelectedCMId] = useState<string>(patient.careManager ? careManagers.find(cm => cm.name === patient.careManager)?.id || '' : '');
    const [scheduleError, setScheduleError] = useState<string | null>(null);

    const getAvailableSlots = (cmId: string, selectedDate: string) => {
        if (!cmId || !selectedDate) return [];

        const cm = careManagers.find(c => c.id === cmId);
        if (!cm || !cm.availability) return [];

        const [y, m, d] = selectedDate.split('-').map(Number);
        const dayOfWeek = new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long' });
        const dayAvailability = cm.availability.filter(s => s.day === dayOfWeek);

        const slots: { time: string, isReserved: boolean, reservedWith?: string }[] = [];

        dayAvailability.forEach(avail => {
            let current = avail.startTime;
            while (current < avail.endTime) {
                const [h, min] = current.split(':').map(Number);
                const endH = Math.floor((h * 60 + min + 45) / 60);
                const endM = (h * 60 + min + 45) % 60;
                const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

                if (endTime > avail.endTime) break;

                // Check for conflicts
                const [year, month, day] = selectedDate.split('-').map(Number);
                const [hours, minutes] = current.split(':').map(Number);
                const targetDate = new Date(year, month - 1, day, hours, minutes);
                // Use substring comparison to ignore milliseconds/timezone shifts precision issues
                // Comparing YYYY-MM-DDTHH:mm
                const targetIsoPrefix = targetDate.toISOString().slice(0, 16);

                const conflict = allPatients.find(p => {
                    if (p.id === patient.id) return false;
                    if (!p.appointmentDate || !p.careManager) return false;

                    // Robust comparison of date prefix and name
                    const apptIsoPrefix = p.appointmentDate.slice(0, 16);
                    return apptIsoPrefix === targetIsoPrefix && p.careManager === cm.name;
                });

                slots.push({
                    time: current,
                    isReserved: !!conflict,
                    reservedWith: conflict?.name
                });

                current = endTime;
            }
        });

        return slots;
    };

    const handleSave = () => {
        if (!outcome) return;

        if (nextActionType === 'appointment') {
            if (!selectedCMId || !date || !time) {
                setScheduleError('Please select a Care Manager, date, and time slot.');
                return;
            }
        }

        let nextAction;
        if (nextActionType !== 'none' && date && time) {
            nextAction = {
                type: nextActionType,
                date,
                time,
                careManagerId: nextActionType === 'appointment' ? selectedCMId : undefined
            };
        }

        onSave(outcome, notes, nextAction);
    };

    const slots = getAvailableSlots(selectedCMId, date);

    return (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 overflow-y-auto pt-2 sm:pt-8">
            <div className="absolute inset-0 bg-itera-blue-dark/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-4 bg-itera-blue-dark text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                            <PhoneCall className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold uppercase tracking-tight text-lg">{patient.name}</h3>
                            <div className="flex items-center gap-3 text-white/60 text-[10px] uppercase font-bold tracking-widest mt-0.5">
                                <span>DOB: {patient.dob}</span>
                                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                <span className="text-white/90">{patient.phone || 'No phone'}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Outcome Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            Management Outcome
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {OUTCOMES.map(option => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        setOutcome(option);
                                        // Reset next action if it was appointment and we switched away from Interested
                                        if (nextActionType === 'appointment' && option !== 'Connected - Interested') {
                                            setNextActionType('none');
                                        }
                                    }}
                                    className={`
                                        p-4 rounded-xl border text-sm font-bold transition-all text-left shadow-sm
                                        ${outcome === option
                                            ? 'bg-itera-blue border-itera-blue text-white ring-2 ring-itera-blue/20'
                                            : 'bg-white border-gray-100 text-gray-700 hover:border-itera-blue/30'}
                                    `}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <FileTextIcon className="w-3.5 h-3.5" />
                            Management Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add details about the conversation..."
                            className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-itera-blue outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Next Steps */}
                    <div className="space-y-4 pt-2 border-t border-gray-50">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Action Plan</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setNextActionType('none')}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${nextActionType === 'none' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}
                            >
                                No Action Needed
                            </button>
                            <button
                                onClick={() => outcome === 'Connected - Interested' && setNextActionType('appointment')}
                                disabled={outcome !== 'Connected - Interested'}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${nextActionType === 'appointment'
                                    ? 'bg-itera-blue text-white border-itera-blue shadow-md'
                                    : outcome === 'Connected - Interested'
                                        ? 'bg-white text-itera-blue border-itera-blue/20 hover:bg-itera-blue-light/10'
                                        : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                                    }`}
                                title={outcome !== 'Connected - Interested' ? 'Only available for Connected - Interested' : ''}
                            >
                                Schedule Appt with CM
                            </button>
                            <button
                                onClick={() => setNextActionType('followup')}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${nextActionType === 'followup' ? 'bg-itera-blue text-white border-itera-blue' : 'bg-white text-itera-blue border-itera-blue/20 hover:bg-itera-blue-light/10'}`}
                            >
                                Plan Follow-up Call
                            </button>
                        </div>

                        {nextActionType !== 'none' && (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                {nextActionType === 'appointment' && (
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">Select Care Manager</span>
                                        <select
                                            value={selectedCMId}
                                            onChange={(e) => setSelectedCMId(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-itera-blue"
                                        >
                                            <option value="">Select a Manager...</option>
                                            {careManagers.filter(cm => cm.isCareManager).map(cm => (
                                                <option key={cm.id} value={cm.id}>{cm.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">Select Date</span>
                                        <CustomDatePicker
                                            selectedDate={date}
                                            onChange={(newDate) => {
                                                setDate(newDate);
                                                setTime(''); // Reset time when date changes
                                            }}
                                            availableDays={nextActionType === 'appointment' ? careManagers.find(cm => cm.id === selectedCMId)?.availability?.map(a => a.day) : undefined}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                                            {nextActionType === 'appointment' ? 'Selected Slot' : 'Select Time'}
                                        </span>
                                        {nextActionType === 'appointment' ? (
                                            <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-itera-blue flex items-center gap-2">
                                                <ClockIcon className="w-3.5 h-3.5" />
                                                {time || '--:--'}
                                            </div>
                                        ) : (
                                            <input
                                                type="time"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-itera-blue"
                                            />
                                        )}
                                    </div>
                                </div>

                                {nextActionType === 'appointment' && selectedCMId && date && (
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-2">
                                            <ClockIcon className="w-3.5 h-3.5" />
                                            Available 45-Min Slots
                                        </span>
                                        {slots.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                                                {slots.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => !s.isReserved && setTime(s.time)}
                                                        disabled={s.isReserved}
                                                        className={`px-2 py-2 rounded-lg text-[10px] font-bold border transition-all ${time === s.time
                                                            ? 'bg-itera-blue border-itera-blue text-white shadow-sm'
                                                            : s.isReserved
                                                                ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed italic'
                                                                : 'bg-white border-gray-100 text-gray-600 hover:border-itera-blue/30'
                                                            }`}
                                                    >
                                                        {s.time}
                                                        {s.isReserved && <span className="block text-[8px] opacity-70">Reserved</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-600 flex items-center gap-3">
                                                <AlertTriangleIcon className="w-4 h-4" />
                                                <p className="text-[10px] font-bold leading-tight">No working hours configured for this day.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {scheduleError && (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-pulse text-red-600">
                                        <AlertTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <p className="text-[10px] font-bold leading-tight">{scheduleError}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!outcome}
                        className="flex-[2] py-3 bg-itera-blue text-white font-bold rounded-2xl shadow-lg hover:bg-itera-blue-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Record Management Activity
                        <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogCallModal;

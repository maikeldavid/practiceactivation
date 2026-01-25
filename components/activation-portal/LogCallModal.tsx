
import React, { useState } from 'react';
import { XIcon, PhoneCall, CalendarIcon, FileTextIcon, CheckCircleIcon, UserIcon, ArrowRightIcon } from '../IconComponents';
import type { MockPatient } from '../../types';

interface LogCallModalProps {
    patient: MockPatient;
    onClose: () => void;
    onSave: (outcome: string, notes: string, nextAction?: { type: 'appointment' | 'followup', date: string, time: string }) => void;
}

const OUTCOMES = [
    "Connected - Interested",
    "Connected - Not Interested",
    "Connected - Call Back Later",
    "No Answer / Voicemail",
    "Wrong Number",
    "DNC (Do Not Call)"
];

const LogCallModal: React.FC<LogCallModalProps> = ({ patient, onClose, onSave }) => {
    const [outcome, setOutcome] = useState('');
    const [notes, setNotes] = useState('');
    const [nextActionType, setNextActionType] = useState<'none' | 'appointment' | 'followup'>('none');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleSave = () => {
        if (!outcome) return;

        let nextAction;
        if (nextActionType !== 'none' && date && time) {
            nextAction = { type: nextActionType, date, time };
        }

        onSave(outcome, notes, nextAction);
    };

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
                            {OUTCOMES.map(ot => (
                                <button
                                    key={ot}
                                    onClick={() => setOutcome(ot)}
                                    className={`px-3 py-2.5 text-xs font-bold rounded-xl border transition-all text-left ${outcome === ot
                                        ? 'bg-itera-blue border-itera-blue text-white shadow-md shadow-itera-blue/20'
                                        : 'bg-white border-gray-100 text-gray-600 hover:border-itera-blue/30'
                                        }`}
                                >
                                    {ot}
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
                                onClick={() => setNextActionType('appointment')}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${nextActionType === 'appointment' ? 'bg-itera-blue text-white border-itera-blue' : 'bg-white text-itera-blue border-itera-blue/20 hover:bg-itera-blue-light/10'}`}
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
                            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">Select Date</span>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-itera-blue"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">Select Time</span>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-itera-blue"
                                    />
                                </div>
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

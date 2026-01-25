import React, { useState } from 'react';
import { CalendarClockIcon, XIcon, CheckCircleIcon, ArrowRightIcon } from '../IconComponents';
import type { TrainingMeeting } from '../../types';

interface TrainingSchedulingViewProps {
    meeting: TrainingMeeting | null;
    onSave: (meeting: TrainingMeeting) => void;
    onCancel: () => void;
}

const TrainingSchedulingView: React.FC<TrainingSchedulingViewProps> = ({ meeting, onSave, onCancel }) => {
    const [selectedDate, setSelectedDate] = useState(meeting?.date || '');
    const [selectedTime, setSelectedTime] = useState(meeting?.time || '');
    const [isScheduled, setIsScheduled] = useState(false);

    // Generate some example time slots
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const handleSchedule = () => {
        if (selectedDate && selectedTime) {
            onSave({
                date: selectedDate,
                time: selectedTime,
                status: 'scheduled',
                link: 'https://zoom.itera.health/j/123456789'
            });
            setIsScheduled(true);
        }
    };

    if (isScheduled) {
        return (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl text-center max-w-2xl mx-auto animate-fade-in-up">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-sm">
                    <CheckCircleIcon className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-itera-blue-dark mb-4">Training Successfully Scheduled!</h2>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                    Your staff training session is confirmed for <span className="text-itera-blue-dark font-bold font-mono px-2 py-1 bg-itera-blue-light/30 rounded">{selectedDate}</span> at <span className="text-itera-blue-dark font-bold font-mono px-2 py-1 bg-itera-blue-light/30 rounded">{selectedTime}</span>.
                </p>
                <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 mb-8 inline-block text-left">
                    <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Access Link</p>
                    <code className="text-itera-blue font-bold">zoom.itera.health/j/123456789</code>
                </div>
                <button
                    onClick={onCancel}
                    className="w-full flex items-center justify-center gap-2 bg-itera-blue text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-itera-blue-dark transition-all transform hover:scale-[1.02]"
                >
                    Return to Onboarding Journey
                    <ArrowRightIcon className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl max-w-4xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-itera-blue-light/30 rounded-2xl flex items-center justify-center text-itera-blue shadow-inner">
                        <CalendarClockIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-itera-blue-dark">Schedule Staff Training</h2>
                        <p className="text-gray-500 mt-1">Select a convenient time for your practice onboarding session.</p>
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    className="p-3 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm"
                >
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Choose Date</label>
                    <div className="relative group">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:border-itera-blue focus:bg-white outline-none transition-all text-gray-800 font-semibold shadow-inner group-hover:bg-gray-50"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="p-6 bg-itera-blue-light/10 rounded-2xl border border-itera-blue-light/30">
                        <h4 className="text-itera-blue-dark font-bold text-sm mb-3">What to expect:</h4>
                        <ul className="space-y-3">
                            {[
                                'Platform navigation walkthrough',
                                'Patient enrollment process',
                                'Alert & Task management',
                                'Billing & Reporting basics'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-itera-blue-dark/70">
                                    <div className="w-1.5 h-1.5 bg-itera-blue rounded-full"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-6">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Available Slots</label>
                    <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`py-4 px-3 rounded-2xl font-bold text-sm transition-all border-2 ${selectedTime === time
                                        ? 'bg-itera-blue border-itera-blue text-white shadow-md'
                                        : 'bg-white border-gray-100 text-gray-500 hover:border-itera-blue/30 hover:bg-gray-50 active:scale-95 shadow-sm'
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 flex items-center justify-between p-2 pl-6 bg-gray-50/50 border border-gray-100 rounded-[2.5rem]">
                <div className="text-sm">
                    {!selectedDate || !selectedTime ? (
                        <span className="text-gray-400 italic">Please select both a date and a time slot</span>
                    ) : (
                        <span className="text-itera-blue-dark font-medium">
                            Meeting on <span className="font-bold underline text-itera-blue">{selectedDate}</span> at <span className="font-bold underline text-itera-blue">{selectedTime}</span>
                        </span>
                    )}
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="px-8 py-4 text-gray-500 font-bold hover:text-gray-800 transition-all rounded-3xl"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSchedule}
                        disabled={!selectedDate || !selectedTime}
                        className="flex items-center gap-2 bg-itera-blue text-white font-bold py-4 px-10 rounded-3xl shadow-xl hover:bg-itera-blue-dark transition-all disabled:opacity-30 disabled:shadow-none hover:scale-105 active:scale-100 group"
                    >
                        Confirm Schedule
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrainingSchedulingView;

import React, { useState } from 'react';
import { CalendarClockIcon, XIcon, CheckCircleIcon, ArrowRightIcon, ActivityIcon, PhoneCall } from './IconComponents';

interface MeetingScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDuration?: number;
}

const MeetingScheduleModal: React.FC<MeetingScheduleModalProps> = ({ isOpen, onClose, initialDuration = 30 }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDuration, setSelectedDuration] = useState<number>(initialDuration);
    const [isScheduled, setIsScheduled] = useState(false);

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const durations = [15, 30, 45];

    const handleSchedule = () => {
        if (selectedDate && selectedTime) {
            setIsScheduled(true);
        }
    };

    if (!isOpen) return null;

    if (isScheduled) {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-itera-blue-dark/60 backdrop-blur-md" onClick={onClose}></div>
                <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl z-10 text-center max-w-xl w-full relative animate-in fade-in zoom-in duration-300">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-sm">
                        <CheckCircleIcon className="w-12 h-12 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-itera-blue-dark mb-4">Meeting Confirmed!</h2>
                    <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                        Your <span className="text-itera-blue-dark font-bold font-mono px-2 py-1 bg-itera-blue-light/30 rounded">{selectedDuration} min</span> session with an Itera Health representative is confirmed for <span className="text-itera-blue-dark font-bold font-mono px-2 py-1 bg-itera-blue-light/30 rounded">{selectedDate}</span> at <span className="text-itera-blue-dark font-bold font-mono px-2 py-1 bg-itera-blue-light/30 rounded">{selectedTime}</span>.
                    </p>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 mb-8 inline-block text-left w-full">
                        <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Access Details</p>
                        <p className="text-itera-blue-dark font-medium text-sm">A calendar invitation has been sent to your email with the Google Meet link.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 bg-itera-blue text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-itera-blue-dark transition-all transform hover:scale-[1.02] active:scale-100"
                    >
                        Done
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-itera-blue-dark/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>

            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl z-10 overflow-hidden relative animate-in fade-in zoom-in duration-300">
                <div className="p-10">
                    <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-itera-blue-light/30 rounded-2xl flex items-center justify-center text-itera-blue shadow-inner">
                                <CalendarClockIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-itera-blue-dark">Schedule a Meeting</h2>
                                <p className="text-gray-500 mt-1">Pick a time to meet with an ITERA representative.</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 shadow-sm"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Choose duration</label>
                                <div className="flex gap-2">
                                    {durations.map(duration => (
                                        <button
                                            key={duration}
                                            onClick={() => setSelectedDuration(duration)}
                                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${selectedDuration === duration ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                                        >
                                            {duration} min
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
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
                            </div>

                            <div className="p-6 bg-itera-blue-light/10 rounded-2xl border border-itera-blue-light/30">
                                <h4 className="text-itera-blue-dark font-bold text-sm mb-3 flex items-center gap-2">
                                    <PhoneCall className="w-4 h-4" />
                                    What to expect:
                                </h4>
                                <ul className="space-y-3">
                                    {[
                                        'Custom Practice ROI analysis',
                                        'Service workflow personalized evaluation',
                                        'Platform demonstration',
                                        'Billing & Compliance assessment'
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
                                onClick={onClose}
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
            </div>
        </div>
    );
};

export default MeetingScheduleModal;

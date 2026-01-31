import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, XIcon } from '../IconComponents';

interface CustomDatePickerProps {
    selectedDate: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    availableDays?: string[]; // ['Monday', 'Tuesday', ...]
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onChange, availableDays }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date());

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const calendarData = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const prevMonthDays = new Date(year, month, 0).getDate();
        const days = [];

        // Previous month padding
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                month: month - 1,
                year: month === 0 ? year - 1 : year,
                isCurrentMonth: false
            });
        }

        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                month: month,
                year,
                isCurrentMonth: true
            });
        }

        // Next month padding
        const remainingSlots = 42 - days.length;
        for (let i = 1; i <= remainingSlots; i++) {
            days.push({
                day: i,
                month: month + 1,
                year: month === 11 ? year + 1 : year,
                isCurrentMonth: false
            });
        }

        return days;
    }, [viewDate]);

    const isDateAvailable = (year: number, month: number, day: number) => {
        const date = new Date(year, month, day);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        // Don't allow past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return false;

        if (!availableDays || availableDays.length === 0) return true;
        return availableDays.includes(dayName);
    };

    const handleDateSelect = (year: number, month: number, day: number) => {
        if (!isDateAvailable(year, month, day)) return;

        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onChange(formattedDate);
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const isSelected = (year: number, month: number, day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return selectedDate === dateStr;
    };

    const isToday = (year: number, month: number, day: number) => {
        const today = new Date();
        return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    };

    const displayDate = selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US') : '';

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none cursor-pointer flex items-center justify-between group hover:border-itera-blue/30 transition-all"
            >
                <span className={selectedDate ? 'text-gray-800 font-bold' : 'text-gray-400 italic'}>
                    {displayDate || 'Select Date...'}
                </span>
                <CalendarIcon className="w-4 h-4 text-gray-400 group-hover:text-itera-blue transition-colors" />
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute left-0 bottom-full mb-2 z-20 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-[280px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-itera-blue-dark">
                                {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </h4>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => changeMonth(-1)}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                                >
                                    <ChevronLeftIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => changeMonth(1)}
                                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                                >
                                    <ChevronRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Weekdays */}
                        <div className="grid grid-cols-7 mb-2">
                            {daysOfWeek.map(d => (
                                <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarData.map((d, i) => {
                                const available = isDateAvailable(d.year, d.month, d.day);
                                const selected = isSelected(d.year, d.month, d.day);
                                const today = isToday(d.year, d.month, d.day);

                                return (
                                    <button
                                        key={i}
                                        disabled={!available}
                                        onClick={() => handleDateSelect(d.year, d.month, d.day)}
                                        className={`
                                            h-8 rounded-lg text-[11px] font-bold transition-all relative
                                            ${!d.isCurrentMonth ? 'text-gray-200' : ''}
                                            ${available && d.isCurrentMonth ? 'text-gray-700 hover:bg-itera-blue/10 hover:text-itera-blue' : ''}
                                            ${!available ? 'text-gray-200 cursor-not-allowed' : ''}
                                            ${selected ? 'bg-itera-blue text-white shadow-md shadow-itera-blue/20 hover:bg-itera-blue-dark hover:text-white' : ''}
                                            ${today && !selected ? 'border border-itera-blue/20 text-itera-blue' : ''}
                                        `}
                                    >
                                        {d.day}
                                        {today && !selected && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-itera-blue rounded-full"></div>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center px-1">
                            <button
                                onClick={() => {
                                    const now = new Date();
                                    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
                                }}
                                className="text-[10px] font-bold text-itera-blue hover:underline"
                            >
                                Back to Today
                            </button>
                            <button
                                onClick={() => {
                                    onChange('');
                                    setIsOpen(false);
                                }}
                                className="text-[10px] font-bold text-gray-400 hover:text-gray-600"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomDatePicker;

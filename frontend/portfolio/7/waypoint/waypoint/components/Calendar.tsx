
import React, { useState, useMemo } from 'react';

interface TimeSelectorProps {
    time: { hour: number; minute: number };
    setTime: (time: { hour: number; minute: number }) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ time, setTime }) => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];

    return (
        <div className="flex items-center space-x-2">
            <select
                value={time.hour.toString().padStart(2, '0')}
                onChange={(e) => setTime({ ...time, hour: parseInt(e.target.value) })}
                className="bg-gray-700 text-white p-2 rounded-md appearance-none text-center focus:outline-none focus:ring-2 focus:ring-waypoint-primary"
            >
                {hours.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <span className="font-bold">:</span>
            <select
                value={time.minute.toString().padStart(2, '0')}
                onChange={(e) => setTime({ ...time, minute: parseInt(e.target.value) })}
                className="bg-gray-700 text-white p-2 rounded-md appearance-none text-center focus:outline-none focus:ring-2 focus:ring-waypoint-primary"
            >
                {minutes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
        </div>
    );
};

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  departureTime: { hour: number; minute: number };
  setDepartureTime: (time: { hour: number; minute: number }) => void;
  returnTime: { hour: number; minute: number };
  setReturnTime: (time: { hour: number; minute: number }) => void;
  tripType: string;
}

export default function Calendar({
    isOpen, onClose, startDate, endDate, setStartDate, setEndDate,
    departureTime, setDepartureTime, returnTime, setReturnTime, tripType
}: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(startDate || new Date());
    const [selecting, setSelecting] = useState<'start' | 'end'>('start');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarGrid = useMemo(() => {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        
        return days;
    }, [year, month]);

    const handleDateClick = (day: Date) => {
        if (tripType === 'One-way') {
            setStartDate(day);
            setEndDate(null);
            onClose();
            return;
        }

        if (selecting === 'start' || (startDate && day < startDate)) {
            setStartDate(day);
            setEndDate(null);
            setSelecting('end');
        } else if (selecting === 'end') {
            setEndDate(day);
            setSelecting('start');
        }
    };

    const changeMonth = (amount: number) => {
        setCurrentDate(new Date(year, month + amount, 1));
    };

    return (
        <div className={`absolute z-30 top-full mt-2 bg-waypoint-darkest border border-gray-700 rounded-lg shadow-2xl p-4 w-full max-w-sm sm:max-w-md transform origin-top-right transition-all duration-300 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-white/10"><i className="fas fa-chevron-left"></i></button>
                <span className="font-bold text-lg">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-white/10"><i className="fas fa-chevron-right"></i></button>
            </div>
            <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7">
                {calendarGrid.map((day, index) => {
                    if (!day) return <div key={`pad-${index}`}></div>;

                    const isSelectedStart = startDate && day.toDateString() === startDate.toDateString();
                    const isSelectedEnd = endDate && day.toDateString() === endDate.toDateString();
                    const isInRange = startDate && endDate && day > startDate && day < endDate;

                    return (
                        <button
                            key={index}
                            onClick={() => handleDateClick(day)}
                            className={`p-1 m-px text-center text-sm rounded-full transition-colors duration-200 
                                ${isSelectedStart || isSelectedEnd ? 'bg-waypoint-primary text-white' : ''}
                                ${isInRange ? 'bg-waypoint-primary/30 rounded-none' : ''}
                                ${!isSelectedStart && !isSelectedEnd && !isInRange ? 'hover:bg-white/10' : ''}
                            `}
                        >
                            {day.getDate()}
                        </button>
                    );
                })}
            </div>

            <div className="border-t border-gray-700 mt-4 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Departure time</span>
                    <TimeSelector time={departureTime} setTime={setDepartureTime} />
                </div>
                {tripType === 'Round trip' && endDate && (
                     <div className="flex justify-between items-center">
                        <span className="font-semibold">Return time</span>
                        <TimeSelector time={returnTime} setTime={setReturnTime} />
                    </div>
                )}
            </div>
            <div className="flex justify-end mt-4">
                <button onClick={onClose} className="px-4 py-2 bg-waypoint-primary rounded-lg text-white font-semibold hover:bg-opacity-80 transition-colors">Done</button>
            </div>
        </div>
    );
}
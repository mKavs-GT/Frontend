
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { destinations } from '../constants/destinations';
import Calendar from './Calendar';

interface TabButtonProps {
  label: string;
  icon: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick, href }) => {
  const classNames = `flex items-center space-x-2 px-4 py-3 transition-colors duration-300 ${isActive
      ? 'text-white border-b-2 border-waypoint-primary'
      : 'text-gray-400 hover:text-white'
    }`;

  const content = (
    <>
      <i className={`fas ${icon}`}></i>
      <span className="font-semibold">{label}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classNames}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classNames}>
      {content}
    </button>
  );
};


export default function FlightBooking() {
  const [activeTab, setActiveTab] = useState<'flights'>('flights');
  const [from, setFrom] = useState('Mumbai');
  const [to, setTo] = useState('');
  const [tripType, setTripType] = useState('Round trip');
  const [passengers, setPassengers] = useState('Economy, 1 Traveller');
  const [nonstop, setNonstop] = useState(false);

  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [departureTime, setDepartureTime] = useState({ hour: 10, minute: 30 });
  const [returnTime, setReturnTime] = useState({ hour: 18, minute: 0 });
  const [isTripTypeOpen, setIsTripTypeOpen] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const tripTypeRef = useRef<HTMLDivElement>(null);

  const allCities = useMemo(() => {
    const citySet = new Set<string>();
    destinations.forEach(continent =>
      continent.categories.forEach(category =>
        category.hotspots.forEach(hotspot => {
          citySet.add(`${hotspot.city}, ${hotspot.country}`);
        })
      )
    );
    return Array.from(citySet).sort();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) setShowFromSuggestions(false);
      if (toRef.current && !toRef.current.contains(event.target as Node)) setShowToSuggestions(false);
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) setIsCalendarOpen(false);
      if (tripTypeRef.current && !tripTypeRef.current.contains(event.target as Node)) setIsTripTypeOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFrom(value);
    if (value.length > 0) {
      setFromSuggestions(allCities.filter(city => city.toLowerCase().includes(value.toLowerCase())));
      setShowFromSuggestions(true);
    } else {
      setShowFromSuggestions(false);
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTo(value);
    if (value.length > 0) {
      setToSuggestions(allCities.filter(city => city.toLowerCase().includes(value.toLowerCase())));
      setShowToSuggestions(true);
    } else {
      setShowToSuggestions(false);
    }
  };

  const handleSelectFrom = (city: string) => {
    setFrom(city);
    setShowFromSuggestions(false);
  };

  const handleSelectTo = (city: string) => {
    setTo(city);
    setShowToSuggestions(false);
  };

  const handleTripTypeChange = (type: string) => {
    setTripType(type);
    if (type === 'One-way') {
      setEndDate(null);
    }
    setIsTripTypeOpen(false);
  };

  const formattedDates = useMemo(() => {
    if (!startDate) return '';
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    let dateString = startDate.toLocaleDateString('en-US', options);
    if (endDate && tripType === 'Round trip') {
      dateString += ` - ${endDate.toLocaleDateString('en-US', options)}`;
    }
    return dateString;
  }, [startDate, endDate, tripType]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-waypoint-dark p-4 md:p-6 rounded-xl shadow-2xl border border-white/10">
      <div className="flex border-b border-gray-700">
        <TabButton label="Flights" icon="fa-plane" isActive={activeTab === 'flights'} onClick={() => setActiveTab('flights')} />
        <TabButton label="Rental Car" icon="fa-car" href="https://www.booking.com/cars/index.html" />
        <TabButton label="Hotel" icon="fa-bed" href="https://www.booking.com/index.html" />
      </div>

      <div className="flex flex-wrap items-center gap-4 md:gap-6 py-4">
        <div className="relative" ref={tripTypeRef}>
          <button onClick={() => setIsTripTypeOpen(!isTripTypeOpen)} className="text-gray-300 hover:text-white">{tripType} <i className="fas fa-chevron-down text-xs ml-1"></i></button>
          <div className={`absolute z-10 top-full mt-2 w-32 bg-waypoint-darkest border border-gray-700 rounded-lg shadow-lg transform origin-top transition-all duration-200 ease-out ${isTripTypeOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <button onClick={() => handleTripTypeChange('Round trip')} className="w-full text-left px-4 py-2 text-white hover:bg-waypoint-primary/50">Round trip</button>
            <button onClick={() => handleTripTypeChange('One-way')} className="w-full text-left px-4 py-2 text-white hover:bg-waypoint-primary/50">One-way</button>
          </div>
        </div>
        <div className="relative">
          <button className="text-gray-300 hover:text-white"><i className="fas fa-user-friends mr-2"></i> {passengers}</button>
        </div>
        <div className="flex items-center">
          <input id="nonstop" type="checkbox" checked={nonstop} onChange={() => setNonstop(!nonstop)} className="w-4 h-4 text-waypoint-primary bg-gray-700 border-gray-600 rounded focus:ring-waypoint-primary" />
          <label htmlFor="nonstop" className="ml-2 text-sm font-medium text-gray-300">Nonstop only</label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 items-end gap-4 mt-4">
        <div className="relative md:col-span-2 flex flex-col sm:flex-row items-end gap-4">
          <div className="relative flex-grow w-full" ref={fromRef}>
            <label className="text-xs text-gray-400" htmlFor="from">From</label>
            <input id="from" type="text" value={from} onChange={handleFromChange} onFocus={() => from.length > 0 && setShowFromSuggestions(true)} autoComplete="off" className="w-full bg-transparent border-b border-gray-500 py-2 text-lg text-white focus:outline-none focus:border-waypoint-primary transition-colors" />
            <div className={`absolute z-20 w-full mt-1 bg-waypoint-dark border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto transform origin-top transition-all duration-200 ease-out ${showFromSuggestions && fromSuggestions.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              {fromSuggestions.map(city => (<button key={city} onClick={() => handleSelectFrom(city)} className="w-full text-left px-4 py-2 text-white hover:bg-waypoint-primary/50 transition-colors">{city}</button>))}
            </div>
          </div>

          <button onClick={handleSwap} className="p-2 rounded-full hover:bg-white/10 transition-colors mb-2 mx-auto sm:mx-0 shrink-0">
            <i className="fas fa-exchange-alt text-gray-400 sm:rotate-0 rotate-90"></i>
          </button>

          <div className="relative flex-grow w-full" ref={toRef}>
            <label className="text-xs text-gray-400" htmlFor="to">To</label>
            <input id="to" type="text" value={to} onChange={handleToChange} onFocus={() => to.length > 0 && setShowToSuggestions(true)} placeholder="To" autoComplete="off" className="w-full bg-transparent border-b border-gray-500 py-2 text-lg text-white focus:outline-none focus:border-waypoint-primary transition-colors" />
            <div className={`absolute z-20 w-full mt-1 bg-waypoint-dark border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto transform origin-top transition-all duration-200 ease-out ${showToSuggestions && toSuggestions.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              {toSuggestions.map(city => (<button key={city} onClick={() => handleSelectTo(city)} className="w-full text-left px-4 py-2 text-white hover:bg-waypoint-primary/50 transition-colors">{city}</button>))}
            </div>
          </div>
        </div>

        <div className="relative md:col-span-2 w-full" ref={calendarRef}>
          <label className="text-xs text-gray-400" htmlFor="dates">Departure - Return</label>
          <div className="relative">
            <input id="dates" type="text" value={formattedDates} onFocus={() => setIsCalendarOpen(true)} readOnly placeholder="Select dates" className="w-full bg-transparent border-b border-gray-500 py-2 text-lg text-white focus:outline-none focus:border-waypoint-primary transition-colors pr-8 cursor-pointer" />
            <i className="fas fa-calendar-alt absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          {isCalendarOpen && (
            <Calendar
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
              departureTime={departureTime} setDepartureTime={setDepartureTime}
              returnTime={returnTime} setReturnTime={setReturnTime}
              tripType={tripType}
            />
          )}
        </div>

        <button className="w-full md:col-span-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors text-lg">
          Find flights
        </button>
      </div>
    </div>
  );
}
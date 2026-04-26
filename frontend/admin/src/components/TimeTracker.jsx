import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, AlertCircle } from 'lucide-react';

const weeklyData = [
  { name: 'Mon', hours: 6 },
  { name: 'Tue', hours: 8 },
  { name: 'Wed', hours: 5 },
  { name: 'Thu', hours: 9 },
  { name: 'Fri', hours: 7 },
  { name: 'Sat', hours: 2 },
  { name: 'Sun', hours: 0 },
];

export default function TimeTracker({ user, onTicketSubmit }) {
  const [view, setView] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  const [stats, setStats] = useState({ todayHours: 0, monthHours: 0 });
  const [history, setHistory] = useState({ dailyLogs: {} });
  const [manualEntry, setManualEntry] = useState({ hours: '', projectName: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStats = async () => {
    try {
      const host = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://mkavs-backend.onrender.com';
      const res = await fetch(`${host}/api/time-entries/stats`);
      const data = await res.json();
      setStats(data);
    } catch (e) { console.error("Stats fetch fail", e); }
  };

  const fetchHistory = async () => {
    try {
      const host = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://mkavs-backend.onrender.com';
      const res = await fetch(`${host}/api/time-entries/history`);
      const data = await res.json();
      setHistory(data);
    } catch (e) { console.error("History fetch fail", e); }
  };

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, []);

  const handleManualSubmit = async () => {
    if (!manualEntry.hours || !manualEntry.projectName || !manualEntry.reason) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const host = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://mkavs-backend.onrender.com';
      const entryDate = new Date();
      entryDate.setDate(selectedDate); // Simple logic for demo

      const res = await fetch(`${host}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: manualEntry.projectName, // Using name as ID for simplicity
          projectName: manualEntry.projectName,
          entryDate,
          requestedMinutes: parseFloat(manualEntry.hours) * 60,
          reason: manualEntry.reason
        })
      });

      if (res.ok) {
        setShowManualEntry(false);
        setManualEntry({ hours: '', projectName: '', reason: '' });
        if (onTicketSubmit) onTicketSubmit();
        alert("Request submitted for approval!");
      }
    } catch (e) {
      console.error("Submission failed", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert dailyLogs to chart data
  const chartData = Object.entries(history.dailyLogs).slice(-7).map(([date, hours]) => ({
    name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    hours
  }));

  const displayChartData = chartData.length > 0 ? chartData : weeklyData;

  // Generate heatmap data
  const getHeatmapColor = (hours) => {
    if (hours === 0) return 'bg-zinc-100 dark:bg-zinc-800/50';
    if (hours < 3) return 'bg-emerald-200 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100';
    if (hours < 6) return 'bg-emerald-400 dark:bg-emerald-700/60 text-white';
    if (hours < 9) return 'bg-emerald-500 dark:bg-emerald-500 text-white shadow-sm';
    return 'bg-emerald-600 dark:bg-emerald-400 text-white shadow-md';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Left Column - Analytics */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="absolute -bottom-4 -right-4 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all text-indigo-500 duration-500">
               <CalendarIcon size={120} />
             </div>
             <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3 relative z-10">Total Today</p>
             <p className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter relative z-10">{stats.todayHours}<span className="text-2xl font-semibold text-zinc-400 ml-2 tracking-normal">hrs</span></p>
          </div>
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
             <div className="absolute -bottom-4 -right-4 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all text-purple-500 duration-500">
               <Clock size={120} />
             </div>
             <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3 relative z-10">Monthly Total</p>
             <p className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter relative z-10">{stats.monthHours}<span className="text-2xl font-semibold text-zinc-400 ml-2 tracking-normal">hrs</span></p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex-1 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Working Hours</h3>
            <div className="flex gap-1.5 bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
              {['weekly', 'monthly', 'yearly'].map(v => (
                <button 
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    view === v 
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full min-h-0 relative -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 13, fontWeight: 500 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 13, fontWeight: 500 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)', radius: 8 }}
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '1rem', border: '1px solid #27272a', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }} 
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="hours" radius={[8, 8, 8, 8]} fill="url(#colorUv)" barSize={48} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column - Calendar Heatmap & Manual Entry */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col h-full relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Productivity Heatmap</h3>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-zinc-500 transition-colors border border-transparent hover:border-zinc-200 dark:border-zinc-700/50 dark:hover:border-zinc-700">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 rounded-xl hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-zinc-500 transition-colors border border-transparent hover:border-zinc-200 dark:border-zinc-700/50 dark:hover:border-zinc-700">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center mb-6">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
            <div key={i} className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{d}</div>
          ))}
          {Array.from({ length: 30 }).map((_, i) => {
            const date = i + 1;
            const isSelected = selectedDate === date;
            
            // Use live history for heatmap
            const dateObj = new Date();
            dateObj.setDate(date);
            const dateStr = dateObj.toISOString().split('T')[0];
            let hoursLogged = history.dailyLogs[dateStr] || 0;
            
            const isFuture = date > new Date().getDate();
            const heatColor = isFuture ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700/50 cursor-not-allowed border border-dashed border-zinc-200 dark:border-zinc-800' : getHeatmapColor(hoursLogged);
            
            return (
              <button
                key={date}
                onClick={() => !isFuture && setSelectedDate(date)}
                disabled={isFuture}
                className={`aspect-square rounded-[10px] flex items-center justify-center text-xs font-bold transition-all duration-300 ${heatColor} ${
                  isSelected && !isFuture ? 'ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-zinc-900 scale-110 z-10 shadow-lg' : 'hover:scale-105'
                }`}
                title={`${date} Apr: ${hoursLogged.toFixed(1)} hours`}
              >
                {date}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mb-8">
          <span className="text-[10px] font-semibold text-zinc-500 mr-1">Less</span>
          <div className="w-3 h-3 rounded-sm bg-zinc-100 dark:bg-zinc-800/50"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700/60"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-400"></div>
          <span className="text-[10px] font-semibold text-zinc-500 ml-1">More</span>
        </div>

        {/* Actions & Selected Day info */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-4 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Hours on Apr {selectedDate}</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
                {(history.dailyLogs[new Date(new Date().setDate(selectedDate)).toISOString().split('T')[0]] || 0).toFixed(1)} <span className="text-sm font-semibold text-zinc-400 tracking-normal ml-1">hrs</span>
              </p>
            </div>
            <button 
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white shadow-sm border border-zinc-200/50 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Manual Entry"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Manual Entry Form */}
          <AnimatePresence>
            {showManualEntry && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 mt-1">
                  <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-500">
                    <AlertCircle size={16} />
                    <p className="text-xs font-bold uppercase tracking-wider">Manual Entry</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        value={manualEntry.hours}
                        onChange={(e) => setManualEntry({...manualEntry, hours: e.target.value})}
                        placeholder="Hours" 
                        className="w-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
                      />
                      <input 
                        type="text" 
                        value={manualEntry.projectName}
                        onChange={(e) => setManualEntry({...manualEntry, projectName: e.target.value})}
                        placeholder="Project Name" 
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500" 
                      />
                    </div>
                    <textarea 
                      value={manualEntry.reason}
                      onChange={(e) => setManualEntry({...manualEntry, reason: e.target.value})}
                      placeholder="Reason for manual entry..." 
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[60px]"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] font-bold text-amber-600/70 dark:text-amber-500/70 uppercase tracking-widest">*Requires Admin Approval</span>
                    <button 
                      onClick={handleManualSubmit}
                      disabled={isSubmitting}
                      className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Clock, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download,
  History
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for time logs
interface TimeLog {
  date: string; // YYYY-MM-DD
  hours: number;
}

const mockLogs: TimeLog[] = [
  { date: '2026-04-18', hours: 6.5 },
  { date: '2026-04-19', hours: 8.2 },
  { date: '2026-04-20', hours: 4.0 },
  { date: '2026-04-21', hours: 7.8 },
  { date: '2026-04-22', hours: 5.5 },
];

export function TimeTrackerView() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [todayTotal, setTodayTotal] = useState(5.5); // Initial today total in hours
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'year'>('week');

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isClockedIn) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleClockToggle = () => {
    if (isClockedIn) {
      // Save work
      const addedHours = elapsedSeconds / 3600;
      setTodayTotal(prev => prev + addedHours);
      setElapsedSeconds(0);
    }
    setIsClockedIn(!isClockedIn);
  };

  // Calendar logic
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthTotal = useMemo(() => {
    return mockLogs.reduce((acc, log) => acc + log.hours, 0) + todayTotal;
  }, [todayTotal]);

  return (
    <div className="h-full flex flex-col bg-transparent p-8 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Time Analytics</h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Productivity Engine v1.0</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-6 border-white/5 bg-white/[0.02] text-zinc-400 font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-white/[0.05]">
             <Download className="w-3.5 h-3.5" /> Export PDF
          </Button>
          <Button className="h-11 px-6 bg-zinc-900 border border-white/5 text-zinc-100 font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-zinc-800">
             <Filter className="w-3.5 h-3.5" /> Date Range
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Stats Area */}
        <div className="col-span-8 space-y-8">
          
          {/* Active Tracker Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.25)] group">
             <div className="absolute top-0 right-0 p-10 opacity-10">
                <Clock className="w-32 h-32 text-white" />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className={cn("w-2 h-2 rounded-full", isClockedIn ? "bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" : "bg-white/20")} />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                     {isClockedIn ? "Live Work Session" : "Ready to Start"}
                   </span>
                </div>

                <div className="flex items-end gap-10">
                   <div className="space-y-1">
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">Elapsed Time</p>
                      <h2 className="text-[84px] font-black text-white leading-none tracking-tighter tabular-nums">
                        {formatTime(elapsedSeconds)}
                      </h2>
                   </div>
                   
                   <button 
                     onClick={handleClockToggle}
                     className={cn(
                       "mb-2 w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-95",
                       isClockedIn 
                        ? "bg-red-500 hover:bg-red-400 shadow-red-500/40" 
                        : "bg-white text-blue-600 hover:bg-blue-50 shadow-white/20"
                     )}
                   >
                     {isClockedIn ? <Square className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                   </button>
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 flex items-center gap-12">
                   <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Today's Progress</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-white">{todayTotal.toFixed(1)}h</span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[9px] font-black uppercase tracking-widest">+12% vs yest.</Badge>
                      </div>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Weekly Target</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-white">32.5 / 40h</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Graph Section */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-3xl shadow-2xl">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                   <BarChart3 className="w-5 h-5 text-blue-500" />
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">Productivity Graph</h3>
                </div>
                <div className="flex bg-black/40 p-1 rounded-xl">
                  {['week', 'month', 'year'].map((t) => (
                    <button 
                      key={t}
                      onClick={() => setActiveTab(t as any)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        activeTab === t ? "bg-zinc-800 text-blue-400 shadow-xl" : "text-zinc-600 hover:text-zinc-400"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
             </div>

             {/* Custom Bar Graph */}
             <div className="h-[240px] flex items-end justify-between gap-4 px-2">
                {mockLogs.map((log, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full flex flex-col items-center">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${log.hours * 20}px` }}
                         className={cn(
                           "w-full max-w-[40px] rounded-t-xl transition-all duration-500 relative",
                           i === mockLogs.length - 1 ? "bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.3)]" : "bg-zinc-800 group-hover:bg-zinc-700"
                         )}
                       >
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-blue-950 text-[10px] font-black px-2 py-1 rounded-md shadow-xl z-20">
                            {log.hours}h
                         </div>
                       </motion.div>
                    </div>
                    <span className="mt-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">{log.date.split('-')[2]}</span>
                  </div>
                ))}
                {/* Current Day Bar */}
                <div className="flex-1 flex flex-col items-center group">
                   <div className="relative w-full flex flex-col items-center">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${todayTotal * 20}px` }}
                        className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-400 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
                      />
                   </div>
                   <span className="mt-4 text-[9px] font-black text-blue-500 uppercase tracking-widest">Today</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div className="col-span-4 space-y-8">
           {/* Calendar Card */}
           <div className="bg-zinc-900/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[12px] font-black text-white uppercase tracking-widest">Calendar</h3>
                 <div className="flex gap-2">
                    <button className="p-2 bg-black/40 rounded-lg text-zinc-500 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="p-2 bg-black/40 rounded-lg text-zinc-500 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
                 </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {['M','T','W','T','F','S','S'].map(d => (
                  <span key={d} className="text-center text-[9px] font-black text-zinc-700">{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map(d => {
                  const dateStr = `2026-04-${d.toString().padStart(2, '0')}`;
                  const isSelected = selectedDate === dateStr;
                  const hasLog = mockLogs.some(l => l.date === dateStr);
                  
                  return (
                    <button 
                      key={d}
                      onClick={() => setSelectedDate(dateStr)}
                      className={cn(
                        "aspect-square rounded-xl flex items-center justify-center text-[11px] font-black transition-all relative",
                        isSelected 
                          ? "bg-blue-600 text-white shadow-lg" 
                          : "bg-black/20 text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                      )}
                    >
                      {d}
                      {hasLog && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 bg-blue-500 rounded-full" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Selected Day</p>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                       {mockLogs.find(l => l.date === selectedDate)?.hours || 0} Hours
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Month Total</p>
                    <span className="text-[12px] font-black text-blue-400 uppercase tracking-widest">
                       {monthTotal.toFixed(1)}h
                    </span>
                 </div>
              </div>
           </div>

           {/* Quick History List */}
           <div className="bg-zinc-900/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                 <History className="w-4 h-4 text-zinc-500" />
                 <h3 className="text-[12px] font-black text-white uppercase tracking-widest">Recent Sessions</h3>
              </div>
              <div className="space-y-4">
                 {[
                   { task: "UI Redesign", time: "4h 20m", date: "Today" },
                   { task: "API Debugging", time: "2h 10m", date: "Today" },
                   { task: "Sprint Planning", time: "5h 45m", date: "Yesterday" },
                 ].map((s, i) => (
                   <div key={i} className="p-4 bg-black/20 rounded-2xl border border-white/[0.02] flex items-center justify-between group cursor-pointer hover:bg-blue-600/5 hover:border-blue-500/20 transition-all">
                      <div className="flex flex-col">
                         <span className="text-[11px] font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{s.task}</span>
                         <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{s.date}</span>
                      </div>
                      <span className="text-[11px] font-black text-zinc-400 tabular-nums">{s.time}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

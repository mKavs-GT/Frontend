import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe as Chrome, 
  Activity,
  Wifi,
  CheckCircle,
  Clock,
  ListTodo,
  Medal,
  Trophy,
  Star
} from 'lucide-react';

export default function Profile({ user }) {
  const [speedTestRunning, setSpeedTestRunning] = useState(false);
  const [speedResult, setSpeedResult] = useState(null);

  const runSpeedTest = () => {
    setSpeedTestRunning(true);
    setSpeedResult(null);
    setTimeout(() => {
      setSpeedTestRunning(false);
      setSpeedResult(128.4);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Profile Header */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <img src={user?.avatar || "https://i.pravatar.cc/150?u=alex"} alt={user?.firstName || "Alex"} className="w-24 h-24 rounded-[1.5rem] object-cover shadow-xl border-2 border-white dark:border-zinc-800 z-10" />
        <div className="z-10">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{user?.name || "Alex Sterling"}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-3">
             <p className="text-zinc-500 font-semibold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg text-sm">@{user?.firstName?.toLowerCase() || 'alex'}_{user?.role?.toLowerCase() || 'dev'}</p>
             <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
             <p className="text-indigo-600 dark:text-indigo-400 font-mono text-sm bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-3 py-1 rounded-lg font-bold">{user?.uid || 'EMP-4921'}</p>
             <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
             <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-lg flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
             </p>
          </div>
        </div>
      </div>

      {/* 4 Bento Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        
        {/* 1. Work Hours Today */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between text-white relative overflow-hidden group hover:shadow-lg transition-shadow border border-white/10">
          <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
            <Clock size={160} />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-100 relative z-10 flex items-center gap-2">
            <Clock size={16} /> Work Hours Today
          </p>
          <div className="relative z-10 mt-8">
            <p className="text-6xl lg:text-7xl font-black tracking-tighter">6.5<span className="text-2xl font-semibold text-indigo-200 ml-2 tracking-normal">hrs</span></p>
            <div className="inline-flex items-center gap-2 mt-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-medium border border-white/10 shadow-inner">
              <span className="text-emerald-300 font-bold">+1.2 hrs</span> compared to yesterday
            </div>
          </div>
        </div>

        {/* 2. Pending Tasks */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col group hover:border-indigo-500/30 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <ListTodo size={16} /> Pending Tasks
            </p>
            <span className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold px-2.5 py-1 rounded-full">
              3 due
            </span>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {[
              { title: 'Fix authentication bug', time: 'Today' },
              { title: 'Update design tokens', time: 'Tomorrow' },
              { title: 'Review PR #42', time: 'In 2 days' }
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-sm">
                <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600 flex-shrink-0 group-hover:border-indigo-400 transition-colors"></div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">{task.title}</p>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">{task.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Browser Compatibility Test */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col group hover:border-indigo-500/30 transition-colors duration-300">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Activity size={16} /> Browser Status
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="flex justify-between items-center px-2 lg:px-4 flex-1">
            {/* Chrome */}
            <div className="flex flex-col items-center gap-4 group/item">
               <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shadow-sm group-hover/item:border-indigo-500/30 transition-colors">
                 <Chrome size={32} />
               </div>
               <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                 <CheckCircle size={14} /> OK
               </div>
            </div>
            {/* Safari */}
            <div className="flex flex-col items-center gap-4 group/item">
               <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shadow-sm group-hover/item:border-indigo-500/30 transition-colors">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
               </div>
               <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                 <CheckCircle size={14} /> OK
               </div>
            </div>
            {/* Firefox */}
            <div className="flex flex-col items-center gap-4 group/item">
               <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shadow-sm group-hover/item:border-indigo-500/30 transition-colors">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.5 8.5c-1 1.5-2.5 3-2.5 5.5 0 3.3 2.7 6 6 6s6-2.7 6-6c0-2.5-1.5-4-2.5-5.5"/><path d="M12 14v4"/><path d="M10 16h4"/></svg>
               </div>
               <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                 <CheckCircle size={14} /> OK
               </div>
            </div>
          </div>
        </div>

        {/* 4. Internet Speed Test */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Wifi size={16} /> Network Speed
            </p>
            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <div className={`w-2 h-2 rounded-full ${speedTestRunning ? 'bg-indigo-500 animate-ping' : 'bg-indigo-500'}`}></div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center flex-1 py-4 relative">
             {speedTestRunning ? (
               <div className="flex flex-col items-center">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                   className="w-16 h-16 border-[4px] border-zinc-100 dark:border-zinc-800 border-t-indigo-500 rounded-full mb-4"
                 />
                 <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest animate-pulse">Testing...</p>
               </div>
             ) : (
               <div className="text-center">
                 {speedResult ? (
                   <>
                     <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-end justify-center gap-2">
                       <p className="text-6xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">{speedResult}</p>
                       <p className="text-lg font-bold text-zinc-400 uppercase tracking-widest mb-1">Mbps</p>
                     </motion.div>
                     <p className="text-xs font-semibold text-emerald-500 mt-3 bg-emerald-50 dark:bg-emerald-500/10 inline-flex px-3 py-1 rounded-lg">Connection is stable</p>
                   </>
                 ) : (
                   <div className="flex flex-col items-center text-zinc-400 dark:text-zinc-600">
                     <Wifi size={48} className="mb-4 opacity-50" />
                     <p className="text-sm font-semibold uppercase tracking-widest">Ready to test</p>
                   </div>
                 )}
               </div>
             )}
          </div>
          
          <button 
            onClick={runSpeedTest}
            disabled={speedTestRunning}
            className="w-full py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-4 active:scale-[0.98]"
          >
            {speedTestRunning ? 'Testing Connection...' : 'Run Speed Test'}
          </button>
        </div>


        {/* 6. The Arena (Gamification) */}
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col group hover:border-amber-500/30 transition-colors duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-500 text-amber-500">
            <Trophy size={160} />
          </div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Trophy size={16} /> The Arena
            </p>
            <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">
              Level 12
            </span>
          </div>
          
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-amber-500/30 transition-colors cursor-pointer group/badge">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover/badge:scale-110 transition-transform">
                <Medal size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">Pixel Perfect</p>
                <p className="text-[11px] font-semibold text-zinc-500 mt-0.5 uppercase tracking-wider">0 Bugs in QA</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-purple-500/30 transition-colors cursor-pointer group/badge">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover/badge:scale-110 transition-transform">
                <Star size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">Night Owl</p>
                <p className="text-[11px] font-semibold text-zinc-500 mt-0.5 uppercase tracking-wider">Commits past midnight</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

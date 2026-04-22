import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Kanban, 
  Clock, 
  User, 
  Bell, 
  Sun, 
  Moon, 
  Play, 
  Square,
  MoreVertical,
  Briefcase,
  Zap,
  Coffee,
  Users,
  Database,
  Shield,
  MessageSquare
} from 'lucide-react';
import ProjectManager from './components/ProjectManager';
import TimeTracker from './components/TimeTracker';
import Profile from './components/Profile';
import Vault from './components/Vault';
import Login from './components/Login';
import TeamTracker from './components/TeamTracker';
import CRM from './components/CRM';
import GodMode from './components/GodMode';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('project'); // 'project', 'time', 'profile', 'vault'
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isZenMode, setIsZenMode] = useState(false);
  const [zenTime, setZenTime] = useState(25 * 60);
  const [standupCopied, setStandupCopied] = useState(false);
  const [specialMention, setSpecialMention] = useState(() => localStorage.getItem('mkavs_special_mention') || "The first 90% of code accounts for the first 90% of development time...");

  const handleSpecialMentionChange = (e) => {
    const val = e.target.value;
    setSpecialMention(val);
    localStorage.setItem('mkavs_special_mention', val);
  };
  
  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Notifications sync
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifs = () => {
      const saved = localStorage.getItem('mkavs_notifications');
      if (saved) setNotifications(JSON.parse(saved));
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 2000);
    return () => clearInterval(interval);
  }, []);

  // Right Panel Timer logic
  const [timerRunning, setTimerRunning] = useState(false);
  const [workedSeconds, setWorkedSeconds] = useState(0);
  
  useEffect(() => {
    const saved = localStorage.getItem('workedSeconds');
    if (saved) setWorkedSeconds(parseInt(saved, 10));
    
    const date = new Date().toDateString();
    const savedDate = localStorage.getItem('workDate');
    if (savedDate !== date) {
      setWorkedSeconds(0);
      localStorage.setItem('workDate', date);
      localStorage.setItem('workedSeconds', '0');
    }
  }, []);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setWorkedSeconds(prev => {
          const next = prev + 1;
          localStorage.setItem('workedSeconds', next.toString());
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const generateStandup = () => {
    const text = `*Standup Update:*\n- Yesterday: Fixed Auth Bug (2 hrs), Completed Sprint Planning.\n- Today: Building Bento UI, Code Review for PR #42.\n- Blockers: None.`;
    navigator.clipboard.writeText(text);
    setStandupCopied(true);
    setTimeout(() => setStandupCopied(false), 2000);
  };

  useEffect(() => {
    let interval;
    if (isZenMode) {
      interval = setInterval(() => {
        setZenTime(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isZenMode]);

  const formatZenTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isZenMode) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 transition-colors duration-700 font-sans relative overflow-hidden text-white">
        {/* Subtle animated background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-8">
          <div className="mb-12 flex items-center gap-4 text-zinc-400">
            <Zap size={24} className="text-amber-400" />
            <h2 className="text-xl font-bold tracking-widest uppercase">Deep Work Session</h2>
          </div>
          
          <div className="text-[8rem] font-black tracking-tighter tabular-nums leading-none mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
            {formatZenTime(zenTime)}
          </div>
          
          <div className="w-full bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-zinc-800 text-center mb-12">
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">Current Task</p>
            <p className="text-2xl font-semibold text-zinc-200">Building Bento UI components for Dashboard</p>
          </div>
          
          <button 
            onClick={() => setIsZenMode(false)}
            className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all backdrop-blur-md border border-white/10"
          >
            Exit Zen Mode
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-[#09090b] transition-colors duration-300 font-sans">
      
      {/* Left Sidebar */}
      <motion.aside 
        initial={{ width: 80 }}
        animate={{ width: 80 }}
        className="flex-shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center py-8 z-20 shadow-sm"
      >
        <div className="mb-12 w-12 h-12 flex items-center justify-center transition-transform hover:scale-105">
          <img src="/favicon.svg" alt="MKAVS" className="w-full h-full object-contain" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-4">
          <SidebarItem icon={<Kanban size={22} />} active={activeView === 'project'} onClick={() => setActiveView('project')} tooltip="Project Manager" />
          <SidebarItem icon={<Clock size={22} />} active={activeView === 'time'} onClick={() => setActiveView('time')} tooltip="Time Tracker" />
          <SidebarItem icon={<User size={22} />} active={activeView === 'profile'} onClick={() => setActiveView('profile')} tooltip="Profile" />
          <div className="w-8 h-px bg-zinc-200/50 dark:bg-zinc-800/50 my-2 mx-auto"></div>
          <SidebarItem icon={<Briefcase size={22} />} active={activeView === 'vault'} onClick={() => setActiveView('vault')} tooltip="The Vault" />
          {user.isExecutive && (
            <>
              <SidebarItem icon={<Users size={22} />} active={activeView === 'team'} onClick={() => setActiveView('team')} tooltip="Team Tracker" />
              <SidebarItem icon={<Database size={22} />} active={activeView === 'crm'} onClick={() => setActiveView('crm')} tooltip="Client Hub (CRM)" />
              <div className="w-8 h-px bg-rose-200/50 dark:bg-rose-900/50 my-2 mx-auto"></div>
              <SidebarItem icon={<Shield size={22} className="text-rose-600 dark:text-rose-500" />} active={activeView === 'godmode'} onClick={() => setActiveView('godmode')} tooltip="God Mode" />
            </>
          )}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Background gradient effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Header */}
        <header className="h-20 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between px-8 z-10 sticky top-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent flex items-center gap-2">
            MKAVS Dashboard
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors">
              <Bell className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-950"></div>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-72 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-700/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-700/50 flex justify-between items-center">
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">Notifications</h3>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">{notifications.length || 2} New</span>
                </div>
                <div className="p-2 max-h-[300px] overflow-y-auto hide-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="px-3 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl cursor-pointer transition-colors flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                          <MessageSquare size={14} className="text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{n.title}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-zinc-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="px-3 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl cursor-pointer transition-colors flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                          <Kanban size={14} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">New Task Assigned</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Design new landing page for client</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative z-0">
          <div className="max-w-7xl mx-auto w-full">
            {/* Bento Header Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Hero Block */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden border border-white/10 flex flex-col justify-between min-h-[200px]"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome Back {user.firstName}, Let's Code! 🚀</h2>
                  <p className="text-indigo-100 text-sm font-medium mb-6">Your dashboard is looking great today.</p>
                </div>
                <div className="relative z-10 mt-auto">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">Daily Goal</span>
                    <span className="text-sm font-bold text-white">3/5 tasks completed</span>
                  </div>
                  <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                    <motion.div initial={{width:0}} animate={{width:'60%'}} transition={{duration:1, delay:0.3}} className="h-full bg-white rounded-full"></motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Productivity Pulse */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-[2rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Pulse</p>
                  <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">2</p>
                  <p className="text-sm font-bold text-rose-500 mt-1">Blocked tickets</p>
                </div>
              </motion.div>

              {/* Special Mentions Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-[2rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col justify-between group hover:border-indigo-500/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Special Mentions</p>
                  <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                </div>
                <div className="mt-4 flex-1 flex flex-col">
                  {user?.isExecutive ? (
                    <textarea 
                      value={specialMention}
                      onChange={handleSpecialMentionChange}
                      className="w-full h-full bg-transparent resize-none text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg p-1 -ml-1 transition-all"
                      placeholder="Type a special mention here..."
                    />
                  ) : (
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed italic line-clamp-3 whitespace-pre-wrap">"{specialMention}"</p>
                  )}
                  <p className="text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">— Message from Admin</p>
                </div>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {activeView === 'project' && <motion.div key="project" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><ProjectManager user={user} /></motion.div>}
              {activeView === 'time' && <motion.div key="time" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><TimeTracker /></motion.div>}
              {activeView === 'profile' && <motion.div key="profile" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><Profile user={user} /></motion.div>}
              {activeView === 'vault' && <motion.div key="vault" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><Vault /></motion.div>}
              {activeView === 'team' && user.isExecutive && <motion.div key="team" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><TeamTracker /></motion.div>}
              {activeView === 'crm' && user.isExecutive && <motion.div key="crm" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><CRM /></motion.div>}
              {activeView === 'godmode' && user.isExecutive && <motion.div key="godmode" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><GodMode /></motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Right Persistent Sidebar */}
      <aside className="w-[320px] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-l border-zinc-200/50 dark:border-zinc-800/50 flex flex-col z-20 flex-shrink-0 overflow-y-auto shadow-sm">
        <div className="p-8 pb-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-6">Current Session</h3>
          
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="flex flex-col items-center relative z-10">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Total Today</p>
              <p className="text-[2.75rem] leading-none font-mono font-bold text-zinc-900 dark:text-white mb-8 tracking-tighter">
                {formatTime(workedSeconds)}
              </p>
              
              <button 
                onClick={() => setTimerRunning(!timerRunning)}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 font-semibold text-base transition-all duration-300 shadow-lg ${
                  timerRunning 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20 hover:shadow-rose-500/40 translate-y-0 hover:-translate-y-0.5' 
                    : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-zinc-900/10 dark:shadow-white/10 translate-y-0 hover:-translate-y-0.5'
                }`}
              >
                {timerRunning ? (
                  <><Square size={18} fill="currentColor" /> Pause Timer</>
                ) : (
                  <><Play size={18} fill="currentColor" /> Start Timer</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 mt-2 mb-2">
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Your Status</p>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-1.5 flex gap-1 mb-4">
             <button className="flex-1 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-500/20">🎧 Deep Work</button>
             <button className="flex-1 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-xs font-bold text-zinc-500 transition-colors">☕ Break</button>
             <button className="flex-1 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-xs font-bold text-zinc-500 transition-colors">🚀 Deploy</button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setIsZenMode(true)}
              className="py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Coffee size={14} /> Zen Mode
            </button>
            <button 
              onClick={generateStandup}
              className={`py-3 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 border ${
                standupCopied 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {standupCopied ? <><CheckCircle size={14} /> Copied</> : <><Copy size={14} /> Standup</>}
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Team Status</h3>
            <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
          
          <div className="space-y-2">
            <TeamMember name="Sarah Jenkins" role="Lead Designer" status="online" avatar="https://i.pravatar.cc/150?u=sarah" />
            <TeamMember name="Mike Ross" role="Frontend Dev" status="offline" avatar="https://i.pravatar.cc/150?u=mike" />
            <TeamMember name="Elena Gilbert" role="Backend Dev" status="online" avatar="https://i.pravatar.cc/150?u=elena" />
            <TeamMember name="David Chen" role="Product Manager" status="online" avatar="https://i.pravatar.cc/150?u=david" />
          </div>
        </div>
      </aside>

    </div>
  );
}

function SidebarItem({ icon, active, onClick, tooltip }) {
  return (
    <div className="relative group flex justify-center w-full px-4">
      <button 
        onClick={onClick}
        className={`w-full aspect-square flex items-center justify-center rounded-2xl transition-all duration-300 relative ${
          active 
            ? 'text-white' 
            : 'text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
        }`}
      >
        {active && (
          <motion.div 
            layoutId="active-sidebar"
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">{icon}</span>
      </button>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
        {tooltip}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-[6px] border-transparent border-r-zinc-900 dark:border-r-zinc-100"></div>
      </div>
    </div>
  );
}

function TeamMember({ name, role, status, avatar }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/50 transition-all cursor-pointer group shadow-sm hover:shadow-md">
      <div className="relative">
        <img src={avatar} alt={name} className="w-11 h-11 rounded-[1rem] object-cover ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all" />
        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-50 dark:border-zinc-950 ${
          status === 'online' ? 'bg-emerald-500' : 'bg-zinc-400'
        }`}></div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{name}</h4>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mt-0.5">{role}</p>
      </div>
    </div>
  );
}

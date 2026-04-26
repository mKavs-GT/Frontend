import { useState, useEffect, useRef } from 'react';
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
  Copy,
  CheckCircle,
  Users,
  Database,
  Shield,
  MessageSquare,
  LogOut
} from 'lucide-react';
import ProjectManager from './components/ProjectManager';
import TimeTracker from './components/TimeTracker';
import Profile from './components/Profile';
import Vault from './components/Vault';
import Login from './components/Login';
import TeamTracker from './components/TeamTracker';
import CRM from './components/CRM';
import GodMode from './components/GodMode';
import NotificationCenter from './components/NotificationCenter';
import { TEAM_MEMBERS } from './constants/users';

const STATUS_CONFIG = {
  focus: { label: 'FOCUS MODE', color: 'green', icon: <Zap size={14} /> },
  break: { label: 'BREAK', color: 'amber', icon: <Coffee size={14} /> },
  deepwork: { label: 'DEEP WORK', color: 'purple', icon: <CheckCircle size={14} /> },
  offline: { label: 'OFFLINE', color: 'gray', icon: <Moon size={14} /> }
};

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mkavs_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('mkavs_admin_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mkavs_admin_user');
  };

  const [activeView, setActiveView] = useState('project'); // 'project', 'time', 'profile', 'vault'
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('mkavs_theme');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isZenMode, setIsZenMode] = useState(false);
  const [zenTime, setZenTime] = useState(25 * 60);
  const [standupCopied, setStandupCopied] = useState(false);
  const [specialMention, setSpecialMention] = useState(() => localStorage.getItem('mkavs_special_mention') || "The first 90% of code accounts for the first 90% of development time...");

  const handleSpecialMentionChange = (e) => {
    const val = e.target.value;
    setSpecialMention(val);
    localStorage.setItem('mkavs_special_mention', val);
  };

  const [currentStatus, setCurrentStatus] = useState('focus');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const wsRef = useRef(null);
  
  // Apply dark mode and smooth transitions
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('mkavs_theme', JSON.stringify(isDarkMode));
    
    // Add global transition class to body for smooth switching
    document.body.classList.add('transition-colors', 'duration-500');
  }, [isDarkMode]);

  // Notifications sync
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifs = () => {
      const saved = localStorage.getItem('mkavs_notifications');
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse notifications", e);
        }
      }
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

  const [onlineStaff, setOnlineStaff] = useState([]);

  const fetchInitialStatus = async () => {
    try {
      const host = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://mkavs-backend.onrender.com';
      const res = await fetch(`${host}/api/staff-status`);
      const data = await res.json();
      if (data.staff) setOnlineStaff(data.staff);
    } catch (e) {
      console.warn("Failed to fetch initial staff status", e);
    }
  };

  useEffect(() => {
    fetchInitialStatus();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Use ws:// for local development and wss:// for production
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' ? 'localhost:3000' : 'mkavs-backend.onrender.com';
    const wsUrl = `${protocol}//${host}/staff`;
    
    let ws;
    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'staff_online', staffName: user.name, status: currentStatus }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'staff_list') {
            setOnlineStaff(data.staff);
            // Sync local status if changed by another device? (Optional)
            const me = data.staff.find(s => s.name === user.name);
            if (me && me.status !== currentStatus) {
              setCurrentStatus(me.status);
            }
          }
        } catch (e) {
          console.error("WS Message Error:", e);
        }
      };

      ws.onerror = (err) => console.warn("Presence WS Error:", err);
    } catch (e) {
      console.error("WS Connection failed:", e);
    }

    return () => {
      if (ws) {
        ws.close();
        wsRef.current = null;
      }
    };
  }, [user]);

  const handleStatusChange = async (status) => {
    if (statusLoading) return;
    
    const prevStatus = currentStatus;
    setCurrentStatus(status);
    setStatusLoading(true);
    setStatusError(null);

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'update_status',
          staffName: user.name,
          status: status
        }));
        
        // We'll assume success if WS is open, but we could wait for a confirmation message
        // For now, let's just clear loading after a short delay to simulate network
        setTimeout(() => setStatusLoading(false), 500);
      } else {
        throw new Error("Connection lost. Please try again.");
      }
    } catch (e) {
      setStatusError(e.message);
      setCurrentStatus(prevStatus); // Rollback
      setStatusLoading(false);
      setTimeout(() => setStatusError(null), 3000);
    }
  };

  const getStaffStatus = (name) => {
    if (name === user.name) return currentStatus; // Optimistic update
    const s = onlineStaff.find(s => s.name === name);
    return s ? s.status : 'offline';
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
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

        <div className="mt-auto pb-8 w-full px-4">
          <SidebarItem 
            icon={<LogOut size={22} className="text-rose-500" />} 
            active={false} 
            onClick={handleLogout} 
            tooltip="Logout" 
          />
        </div>
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
            <NotificationCenter user={user} />
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center gap-3 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">{user.name}</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{user.role}</p>
              </div>
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm"
              />
            </div>
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
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Your Status</p>
            <AnimatePresence>
              {statusError && (
                <motion.span 
                  initial={{ opacity: 0, x: 5 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-bold text-rose-500"
                >
                  {statusError}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-1.5 flex flex-wrap gap-1 mb-4">
             {Object.entries(STATUS_CONFIG).map(([key, config]) => {
               const isActive = currentStatus === key;
               const colors = {
                 green: isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-500',
                 purple: isActive ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-500',
                 amber: isActive ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-500',
                 gray: isActive ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-500'
               };
               
               return (
                 <button 
                   key={key}
                   disabled={statusLoading}
                   onClick={() => handleStatusChange(key)}
                   className={`flex-1 min-w-[80px] py-2 rounded-lg text-[10px] font-bold transition-all border ${colors[config.color]} ${isActive ? 'shadow-sm' : 'border-transparent'} ${statusLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                   <span className="flex items-center justify-center gap-1.5">
                     {config.icon}
                     {config.label}
                   </span>
                 </button>
               );
             })}
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
            {TEAM_MEMBERS.map(member => (
              <TeamMember 
                key={member.email}
                name={member.name} 
                role={member.role} 
                status={getStaffStatus(member.name)} 
                avatar={member.avatar} 
              />
            ))}
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
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.offline;
  
  const statusColors = {
    green: 'bg-emerald-500 shadow-emerald-500/20',
    purple: 'bg-purple-500 shadow-purple-500/20',
    amber: 'bg-amber-500 shadow-amber-500/20',
    gray: 'bg-zinc-400 shadow-zinc-400/20'
  };
  
  const badgeColors = {
    focus: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-500/20',
    break: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-500/20',
    deepwork: 'bg-purple-500 text-white border-purple-400 shadow-sm shadow-purple-500/20',
    offline: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'
  };

  const badgeClass = badgeColors[status] || badgeColors.offline;

  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/50 transition-all cursor-pointer group shadow-sm hover:shadow-md">
      <div className="relative">
        <img src={avatar} alt={name} className="w-11 h-11 rounded-[1rem] object-cover ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all" />
        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-50 dark:border-zinc-950 shadow-lg ${statusColors[config.color]}`}></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{name}</h4>
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${badgeClass} transition-all duration-300`}>
            {config.label}
          </span>
        </div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mt-0.5">{role}</p>
      </div>
    </div>
  );
}

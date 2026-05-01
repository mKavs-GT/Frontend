import { useState, useEffect, useRef, lazy, Suspense } from 'react';
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
  LogOut,
  Ticket as TicketIcon,
  CheckCircle2,
  XCircle,
  Search,
  Info,
  Menu,
  X,
  Folder
} from 'lucide-react';
import { API_BASE_URL, WS_URL } from './config';
import { usePresence } from './hooks/usePresence';
import socketService from './services/SocketService';
// Helper to handle lazy loading errors (e.g. when a new version is deployed and old chunks are gone)
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error("Chunk load failed:", error);
      // If the error is about a missing module, it usually means a new deployment happened
      // and the browser is trying to load a chunk from a previous build.
      // Reloading the page will fetch the latest index.html and chunk manifests.
      if (error.message.includes("Failed to fetch dynamically imported module") || 
          error.message.includes("loading chunk")) {
        window.location.reload();
      }
      throw error;
    }
  });

// Lazy-load all view components
const ProjectManager = lazyWithRetry(() => import('./components/ProjectManager'));
const TimeTracker = lazyWithRetry(() => import('./components/TimeTracker'));
const Profile = lazyWithRetry(() => import('./components/Profile'));
const Vault = lazyWithRetry(() => import('./components/Vault'));
const Login = lazyWithRetry(() => import('./components/Login'));
const TeamTracker = lazyWithRetry(() => import('./components/TeamTracker'));
const CRM = lazyWithRetry(() => import('./components/CRM'));
const GodMode = lazyWithRetry(() => import('./components/GodMode'));
const NotificationCenter = lazyWithRetry(() => import('./components/NotificationCenter'));
const TicketManager = lazyWithRetry(() => import('./components/TicketManager'));
const ProjectManagement = lazyWithRetry(() => import('./components/ProjectManagement'));
import { TEAM_MEMBERS } from './constants/users';
import { calculateDailyGoal } from './utils/taskMetrics';
const kaironIcon = '/kairon-icon.png';

const STATUS_CONFIG = {
  focus: { label: 'FOCUS MODE', color: 'green', icon: <Zap size={14} /> },
  break: { label: 'BREAK', color: 'amber', icon: <Coffee size={14} /> },
  deepwork: { label: 'DEEP WORK', color: 'purple', icon: <CheckCircle size={14} /> },
  offline: { label: 'OFFLINE', color: 'gray', icon: <Moon size={14} /> },
  zen: { label: 'ZEN MODE', color: 'purple', icon: <Coffee size={14} /> },
  standup: { label: 'STANDUP', color: 'green', icon: <Users size={14} /> }
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

  // Global 401 handler to clear session immediately when token is invalid
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('mkavs-unauthorized'));
      }
      return response;
    };

    const handleUnauthorized = () => {
      // Only log out if we actually have a user session to clear
      // This prevents interrupting the login process itself
      if (user) {
        console.warn("Unauthorized API call detected. Logging out...");
        handleLogout();
      }
    };
    
    window.addEventListener('mkavs-unauthorized', handleUnauthorized);
    return () => {
      window.fetch = originalFetch;
      window.removeEventListener('mkavs-unauthorized', handleUnauthorized);
    };
  }, []);


  const [activeView, setActiveView] = useState(() => localStorage.getItem('mkavs_admin_active_view') || 'project');
  
  useEffect(() => {
    localStorage.setItem('mkavs_admin_active_view', activeView);
  }, [activeView]);

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

  const [ticketStatsLoading, setTicketStatsLoading] = useState(true);
  
  // Use new presence hook
  const { 
    status: currentStatus, 
    teamPresence, 
    isSynced, 
    syncCount, 
    error: presenceError, 
    updateStatus: handleStatusChange 
  } = usePresence(user, localStorage.getItem('mkavs_staff_status') || 'offline');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  // Initial Session Verification
  useEffect(() => {
    const verifySession = async () => {
      if (!user?.token) return;
      
      setIsValidating(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/verify`, {
          headers: { 'Authorization': `Bearer ${user.token.trim()}` }
        });
        
        if (!res.ok) {
          console.warn('[AUTH] Session verification failed');
          setUser(null);
          localStorage.removeItem('mkavs_admin_user');
        } else {
          const data = await res.json();
          // Keep current user but potentially update from server, preserving token
          setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...data.agent };
            localStorage.setItem('mkavs_admin_user', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.warn("Session verification failed (Server might be down). Staying in offline mode.", err);
      } finally {
        setIsValidating(false);
      }
    };

    verifySession();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin-projects`, {
        headers: user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Fetch projects failed:', err);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
      const interval = setInterval(fetchProjects, 10000); // 10s sync
      return () => clearInterval(interval);
    }
  }, [user]);

  const dailyStats = calculateDailyGoal(projects, user);
  
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

  // Time Tracker State (Product Requirements: Separate session from total)
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedTodaySeconds, setCompletedTodaySeconds] = useState(0);
  const [completedMonthSeconds, setCompletedMonthSeconds] = useState(0);
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);
  const [activeSessionStartTime, setActiveSessionStartTime] = useState(null);
  
  // Helper: Format seconds to HH:MM:SS
  const formatDuration = (totalSeconds) => {
    if (typeof totalSeconds !== 'number' || isNaN(totalSeconds)) return '00:00:00';
    const absSeconds = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  };

  // Sync Logic
  useEffect(() => {
    if (!user?.token) return;

    const fetchCurrentStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/time-entries/stats`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCompletedTodaySeconds(data.completedTodaySeconds || 0);
          setCompletedMonthSeconds(data.completedMonthSeconds || 0);
          
          if (data.activeSession && data.activeSession.startTime) {
            setTimerRunning(true);
            const start = new Date(data.activeSession.startTime);
            if (!isNaN(start.getTime())) {
              setActiveSessionStartTime(start);
              setCurrentSessionSeconds(Math.floor((new Date() - start) / 1000));
            } else {
              setTimerRunning(false);
              setActiveSessionStartTime(null);
            }
          } else {
            setTimerRunning(false);
            setActiveSessionStartTime(null);
            setCurrentSessionSeconds(0);
          }
        }
      } catch (e) { console.error("Stats sync failed", e); }
    };

    fetchCurrentStats();
  }, [user]);

  // Ticker Logic (Derive from timestamps to prevent drift)
  useEffect(() => {
    let ticker;
    if (timerRunning && activeSessionStartTime && !isNaN(activeSessionStartTime.getTime())) {
      ticker = setInterval(() => {
        const now = new Date();
        const elapsed = Math.max(0, Math.floor((now - activeSessionStartTime) / 1000));
        setCurrentSessionSeconds(elapsed);
      }, 1000);
    } else {
      setCurrentSessionSeconds(0);
    }
    return () => clearInterval(ticker);
  }, [timerRunning, activeSessionStartTime]);

  const handleTimerToggle = async () => {
    if (!user?.token) return;
    
    try {
      const endpoint = timerRunning ? 'stop' : 'start';
      const res = await fetch(`${API_BASE_URL}/api/time-entries/${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      const data = await res.json();
      if (res.ok) {
        if (!timerRunning) {
          // Starting
          setTimerRunning(true);
          const start = new Date(data.startTime);
          if (!isNaN(start.getTime())) {
            setActiveSessionStartTime(start);
            setCurrentSessionSeconds(0);
          } else {
            setTimerRunning(false);
            alert("Server returned invalid start time");
          }
        } else {
          // Stopping (Pause)
          setCompletedTodaySeconds(prev => prev + currentSessionSeconds);
          setCompletedMonthSeconds(prev => prev + currentSessionSeconds);
          
          setTimerRunning(false);
          setActiveSessionStartTime(null);
          setCurrentSessionSeconds(0);
          
          window.dispatchEvent(new CustomEvent('mkavs-timer-stopped'));
        }
      } else {
        // Handle cases like already running or no active session
        if (data.error && (data.error.includes("already running") || data.error.includes("No active"))) {
          // Re-sync UI state if it got out of sync with backend
          window.location.reload(); 
        } else {
          alert(data.error || "Timer failed");
        }
      }
    } catch (e) { console.error("Toggle error", e); }
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

  const fetchInitialStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/staff-status`);
      const data = await res.json();
      if (data.staff) setOnlineStaff(data.staff);
    } catch (e) {
      console.warn("Failed to fetch initial staff status", e);
    }
  };

  const fetchTicketStats = async () => {
    try {
      if (user?.token) {
        console.log(`[DEBUG] Fetching ticket stats with token starting with: ${user.token.substring(0, 10)}...`);
      }
      const res = await fetch(`${API_BASE_URL}/api/tickets/stats`, {
        headers: {
          'Authorization': `Bearer ${user.token.trim()}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTicketStats(data);
      }
    } catch (e) {
      console.warn("Failed to fetch ticket stats", e);
    } finally {
      setTicketStatsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchInitialStatus();
      fetchTicketStats();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    // Heartbeat to keep status fresh for Kairon (Legacy compatibility)
    const kaironHeartbeat = setInterval(() => {
        socketService.send({
          type: 'staff_online',
          staffName: user.name,
          email: user.email,
          status: currentStatus,
          isChatAgent: true
        });
    }, 10000);

    return () => clearInterval(kaironHeartbeat);
  }, [user, currentStatus]);

  // handleStatusChange is now provided by usePresence hook

  const getStaffStatus = (member) => {
    const memberEmail = member.email?.toLowerCase().trim() || '';
    const presence = teamPresence[memberEmail];
    return presence ? presence.status : 'offline';
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-zinc-50 dark:bg-[#09090b] transition-colors duration-300 font-sans relative">
      
      {/* Left Sidebar - Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <motion.aside 
        initial={false}
        className={`fixed lg:relative left-0 flex-shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center py-8 z-50 shadow-xl lg:shadow-sm h-full w-[80px] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="mb-12 w-12 h-12 flex items-center justify-center transition-transform hover:scale-105">
          <img src="/favicon.svg" alt="MKAVS" className="w-full h-full object-contain" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-4">
          <SidebarItem icon={<Kanban size={22} />} active={activeView === 'project'} onClick={() => setActiveView('project')} tooltip="Project Manager" />
          <SidebarItem icon={<Clock size={22} />} active={activeView === 'time'} onClick={() => setActiveView('time')} tooltip="Time Tracker" />
          <SidebarItem icon={<TicketIcon size={22} />} active={activeView === 'tickets'} onClick={() => setActiveView('tickets')} tooltip="Approval Tickets" />
          <SidebarItem icon={<User size={22} />} active={activeView === 'profile'} onClick={() => setActiveView('profile')} tooltip="Profile" />
          <SidebarItem 
            icon={<img src={kaironIcon} alt="Kairon Live Bot" className="w-[24px] h-[24px] object-contain drop-shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all" />} 
            active={activeView === 'kairon'} 
            onClick={() => setActiveView('kairon')} 
            tooltip="Kairon Live Bot" 
          />
          <SidebarItem 
            icon={<Folder size={22} />} 
            active={activeView === 'project_management'} 
            onClick={() => setActiveView('project_management')} 
            tooltip="Project Management" 
          />
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
            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
            tooltip="Logout" 
          />
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative w-full overflow-x-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Header */}
        <header className="h-16 lg:h-20 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent flex items-center gap-2">
              <span className="hidden sm:inline">MKAVS Dashboard</span>
              <span className="sm:hidden">MKAVS</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <NotificationCenter user={user} />
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => setIsRightSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-indigo-500/10 text-indigo-500"
            >
              <Users size={20} />
            </button>

            <div className="flex items-center gap-3 ml-1 lg:ml-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">{user.name}</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{user.role}</p>
              </div>
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative z-0">
          <div className="max-w-7xl mx-auto w-full">


            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
              </div>
            }>
              <AnimatePresence mode="wait">
                {activeView === 'project' && <motion.div key="project" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><ProjectManager user={user} projects={projects} onRefresh={fetchProjects} /></motion.div>}
                {activeView === 'time' && <motion.div key="time" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><TimeTracker user={user} onTicketSubmit={fetchTicketStats} completedTodaySeconds={completedTodaySeconds} currentSessionSeconds={currentSessionSeconds} completedMonthSeconds={completedMonthSeconds} /></motion.div>}
                {activeView === 'tickets' && <motion.div key="tickets" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><TicketManager user={user} onReview={fetchTicketStats} /></motion.div>}
                {activeView === 'profile' && <motion.div key="profile" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><Profile user={user} /></motion.div>}
                {activeView === 'vault' && <motion.div key="vault" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><Vault /></motion.div>}
                {activeView === 'kairon' && <motion.div key="kairon" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="w-full h-[800px]"><iframe 
                  src="/neoncode/kairon-live-bot/live_staff.html"
                  className="w-full h-full border-0 rounded-[2rem] shadow-sm"
                  title="Kairon Live Staff Dashboard"
                  allow="autoplay; clipboard-write"
                ></iframe></motion.div>}
                {activeView === 'team' && user.isExecutive && <motion.div key="team" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><TeamTracker user={user} teamPresence={teamPresence} /></motion.div>}
                {activeView === 'crm' && user.isExecutive && <motion.div key="crm" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><CRM user={user} /></motion.div>}
                {activeView === 'godmode' && user.isExecutive && <motion.div key="godmode" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><GodMode /></motion.div>}
                {activeView === 'project_management' && <motion.div key="project_management" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><ProjectManagement user={user} /></motion.div>}
              </AnimatePresence>
            </Suspense>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Mobile Drawer Overlay */}
      <AnimatePresence>
        {isRightSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsRightSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Right Persistent Sidebar */}
      <motion.aside 
        initial={false}
        className={`fixed lg:relative right-0 flex-shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-l border-zinc-200/50 dark:border-zinc-800/50 flex flex-col z-50 lg:z-20 h-full overflow-y-auto shadow-2xl lg:shadow-sm w-[300px] lg:w-[320px] transition-transform duration-300 ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-8 pb-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-6">Current Session</h3>
          
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 border border-zinc-200/80 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="flex flex-col items-center relative z-10">
              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Current Session</p>
              <p className="text-4xl font-black text-zinc-900 dark:text-white mb-6 tracking-tighter font-mono">
                {formatDuration(currentSessionSeconds)}
              </p>
              
              <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800/50 mb-6" />

              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Total Today</p>
              <p className="text-xl font-bold text-zinc-500 dark:text-zinc-400 mb-8 tracking-tight font-mono">
                {formatDuration(completedTodaySeconds + currentSessionSeconds)}
              </p>
              
              <button 
                onClick={handleTimerToggle}
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
              {presenceError && (
                <motion.span 
                  initial={{ opacity: 0, x: 5 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-bold text-rose-500"
                >
                  {presenceError}
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
                   onClick={() => handleStatusChange(key)}
                   className={`flex-1 min-w-[80px] py-2 rounded-lg text-[10px] font-bold transition-all border ${colors[config.color]} ${isActive ? 'shadow-sm' : 'border-transparent'}`}
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
              onClick={() => {
                setIsZenMode(true);
                handleStatusChange('zen');
              }}
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
            <div className="flex items-center gap-2">
              <button 
                onClick={() => alert(JSON.stringify(teamPresence, null, 2))}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors p-1"
                title="Debug Sync Data"
              >
                <Info size={14} />
              </button>
              <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {TEAM_MEMBERS.map(member => {
              const userEmail = user?.email?.toLowerCase().trim() || '';
              const userName = (user?.name || user?.displayName)?.toLowerCase().trim() || '';
              const memberEmail = member.email?.toLowerCase().trim() || '';
              const memberName = member.name?.toLowerCase().trim() || '';
              
              const isMe = (memberEmail && memberEmail === userEmail) || (memberName && memberName === userName);
              
              // Get data from teamPresence
              const presence = teamPresence[memberEmail] || {};
              const displayStatus = isMe ? currentStatus : (presence.status || 'offline');
              const isOnline = isMe ? true : (presence.isOnline || false);

              return (
                <TeamMember 
                  key={member.email}
                  name={member.name} 
                  role={member.role} 
                  status={displayStatus} 
                  isOnline={isOnline}
                  avatar={member.avatar} 
                />
              );
            })}
          </div>
        </div>

         {/* Identity Check (Debug) */}
         <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[8px] font-mono text-zinc-500">
                <Shield size={10} />
                <span>ID: {user?.email || '???'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isSynced ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
                <span className="text-[7px] font-black uppercase tracking-tighter text-zinc-400">
                  {isSynced ? `Synced (${syncCount})` : 'Offline'}
                </span>
              </div>
            </div>
        </div>
      </motion.aside>

      {/* Close buttons for mobile sidebars */}
      {(isMobileMenuOpen || isRightSidebarOpen) && (
        <button 
          onClick={() => { setIsMobileMenuOpen(false); setIsRightSidebarOpen(false); }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full shadow-2xl font-bold text-xs lg:hidden flex items-center gap-2"
        >
          <X size={16} /> Close Menu
        </button>
      )}

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

function TeamMember({ name, role, status, isOnline, avatar }) {
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
    offline: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700',
    zen: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100/50 dark:border-purple-500/20',
    standup: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-500/20'
  };

  const badgeClass = badgeColors[status] || badgeColors.offline;

  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/50 transition-all cursor-pointer group shadow-sm hover:shadow-md">
      <div className="relative">
        <img src={avatar} alt={name} className="w-11 h-11 rounded-[1rem] object-cover ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all duration-500" />
        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-50 dark:border-zinc-950 shadow-lg ${isOnline ? statusColors[config.color] : 'bg-zinc-400'} transition-all duration-500`}></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{name}</h4>
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${badgeClass} transition-all duration-500`}>
            {config.label}
          </span>
        </div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mt-0.5">{role}</p>
      </div>
    </div>
  );
}

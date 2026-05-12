import { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
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
  Folder,
  Plus,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { API_BASE_URL, WS_URL } from './config';
import { useTeamPresence } from './hooks/useTeamPresence';
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
const Vault = lazyWithRetry(() => import('./components/Vault'));
const Login = lazyWithRetry(() => import('./components/Login'));
const TeamTracker = lazyWithRetry(() => import('./components/TeamTracker'));
const CRM = lazyWithRetry(() => import('./components/CRM'));
const GodMode = lazyWithRetry(() => import('./components/GodMode'));
const NotificationCenter = lazyWithRetry(() => import('./components/NotificationCenter'));
const TicketManager = lazyWithRetry(() => import('./components/TicketManager'));
const ProjectManagement = lazyWithRetry(() => import('./components/ProjectManagement'));
const AnalyticsDashboard = lazyWithRetry(() => import('./components/AnalyticsDashboard'));
const Logs = lazyWithRetry(() => import('./components/Logs'));
const CommandPalette = lazyWithRetry(() => import('./components/CommandPalette'));
import { TEAM_MEMBERS } from './constants/users';
import { calculateDailyGoal } from './utils/taskMetrics';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
const kaironIcon = '/kairon-icon.png';

const STATUS_CONFIG = {
  focus: { label: 'FOCUS MODE', color: 'green', icon: <Zap size={14} /> },
  break: { label: 'BREAK', color: 'amber', icon: <Coffee size={14} /> },
  deepwork: { label: 'DEEP WORK', color: 'purple', icon: <CheckCircle size={14} /> },
  offline: { label: 'OFFLINE', color: 'gray', icon: <Moon size={14} /> },
};


const getViewTitle = (view) => {
  const titles = {
    analytics: 'Overview',
    project: 'Sprint Plan',
    time: 'Time Tracker',
    tickets: 'Approval Tickets',
    vault: 'The Vault',
    team: 'Team Tracker',
    crm: 'Client Hub (CRM)',
    godmode: 'God Mode',

    logs: 'Logs'
  };
  return titles[view] || 'Dashboard';
};

const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 rounded-full border-2 border-[#4a154b]/30 border-t-[#4a154b] animate-spin" />
  </div>
);

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


   const [activeView, setActiveView] = useState(() => localStorage.getItem('mkavs_admin_active_view') || 'analytics');
   const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
   const [isLiveOnChatbot, setIsLiveOnChatbot] = useState(() => {
     return localStorage.getItem('mkavs_kairon_live') === 'true';
   });
   
   const handleChatbotToggle = () => {
     const newState = !isLiveOnChatbot;
     const iframe = document.getElementById('kairon-iframe');
     if (iframe && iframe.contentWindow) {
         iframe.contentWindow.postMessage({ type: newState ? 'KAIRON_GO_ONLINE' : 'KAIRON_GO_OFFLINE' }, '*');
         // Also ensure theme is synced when going live
         iframe.contentWindow.postMessage({ type: 'SET_THEME', isDark: isDarkMode }, '*');
     }
     setIsLiveOnChatbot(newState);
     localStorage.setItem('mkavs_kairon_live', newState);
   };
  
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'KAIRON_IS_ONLINE') setIsLiveOnChatbot(true);
      if (e.data?.type === 'KAIRON_IS_OFFLINE') setIsLiveOnChatbot(false);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    localStorage.setItem('mkavs_admin_active_view', activeView);
  }, [activeView]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('mkavs_theme');
    return saved === 'true' || saved === null;
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

  // Use new team presence hook
  const { 
    presenceMap, 
    isSynced, 
    updateMyStatus: handleStatusChange,
    getMemberPresence
  } = useTeamPresence(user);

  // Derived current user status
  const currentStatus = useMemo(() => {
    if (!user) return 'offline';
    return getMemberPresence(user.email).status;
  }, [user, getMemberPresence]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('mkavs_sidebar_collapsed');
    return saved === 'true' || saved === null;
  });

  useEffect(() => {
    localStorage.setItem('mkavs_sidebar_collapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('lock-scroll');
    } else {
      document.body.classList.remove('lock-scroll');
    }
    return () => document.body.classList.remove('lock-scroll');
  }, [isMobileMenuOpen]);

  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [ticketStats, setTicketStats] = useState(null);
  const [ticketStatsLoading, setTicketStatsLoading] = useState(true);
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
      const res = await fetch(`${API_BASE_URL}/api/admin-projects?t=${Date.now()}`, {
        headers: {
          ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
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
      const interval = setInterval(fetchProjects, 60000); // 1m sync
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

    // Sync theme with Kairon iframe
    const iframe = document.getElementById('kairon-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'SET_THEME', isDark: isDarkMode }, '*');
    }
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-accent/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-8">
          <div className="mb-12 flex items-center gap-4 text-zinc-400">
            <Zap size={24} className="text-accent" />
            <h2 className="text-xl font-bold tracking-widest uppercase text-white">Deep Work Session</h2>
          </div>
          
          <div className="text-[8rem] font-black tracking-tighter tabular-nums leading-none mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-accent/50">
            {formatZenTime(zenTime)}
          </div>
          
          <div className="w-full bg-zinc-900/50 backdrop-blur-md rounded-3xl p-8 border border-zinc-800 text-center mb-12">
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">Current Task</p>
            <p className="text-2xl font-semibold text-zinc-200">Building Bento UI components for Dashboard</p>
          </div>
          
          <button 
            onClick={() => setIsZenMode(false)}
            className="px-8 py-4 rounded-full bg-bg-surface/10 hover:bg-bg-surface/20 text-white font-bold transition-all backdrop-blur-md border border-white/10"
          >
            Exit Zen Mode
          </button>
        </div>
      </div>
    );
  }


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
      fetchTicketStats();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
  }, [user, currentStatus]);

  // handleStatusChange is now provided by usePresence hook

  // getStaffStatus is replaced by getMemberPresence from hook

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-bg-root transition-colors duration-300 font-sans relative text-text-main">
      
      {/* Dynamic Sidebar */}
      <Sidebar 
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        isDarkMode={isDarkMode}
        isLiveOnChatbot={isLiveOnChatbot}
        handleLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-bg-surface relative overflow-hidden">
        {/* Top Header */}
        <AppHeader 
          user={user}
          activeView={activeView}
          getViewTitle={getViewTitle}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          setIsCommandPaletteOpen={setIsCommandPaletteOpen}
        />

        {/* View Header (Render Style) */}
        <div className="px-4 sm:px-8 py-6 sm:py-10 border-b border-border-main">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{getViewTitle(activeView)}</h1>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-bg-muted border border-border-main rounded text-[10px] font-bold uppercase">Enterprise</span>
              </div>
            </div>

              {activeView === 'kairon' && (
               <div className="flex items-center gap-4">
                  <button 
                    onClick={handleChatbotToggle}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                      isLiveOnChatbot 
                        ? 'bg-rose-500 text-white hover:bg-rose-600' 
                        : 'bg-[#1a1a1b] text-white hover:opacity-90'
                    }`}
                  >
                    <Zap size={14} />
                    {isLiveOnChatbot ? 'End Chatbot Session' : 'Go live on Chatbot'}
                  </button>
               </div>
             )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-bg-surface scrollbar-hide">
          <div className="max-w-6xl mx-auto">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"></div></div>}>
              <AnimatePresence mode="wait">
                {activeView === 'analytics' && (
                  <motion.div 
                    key="analytics" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
                  >
                    <div className="lg:col-span-2">
                      <AnalyticsDashboard projects={projects} />
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                      {/* Timer Block */}
                      <div className="bg-bg-surface border border-border-main rounded-xl overflow-hidden shadow-sm p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${timerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
                          <div>
                            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Session Timer</h3>
                            <div className="text-xl font-mono font-black tracking-tight text-text-main leading-none">
                              {formatDuration(currentSessionSeconds || completedTodaySeconds)}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={handleTimerToggle} 
                          className={`p-3 rounded-lg transition-colors flex items-center justify-center ${timerRunning ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-[#1a1a1b] text-white hover:bg-black'}`}
                        >
                          {timerRunning ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                        </button>
                      </div>

                      {/* Profile Summary Card */}
                      <ProfileSummaryCard user={user} currentStatus={currentStatus} />
                      <YourStatus 
                        currentStatus={currentStatus} 
                        handleStatusChange={handleStatusChange} 
                        setIsZenMode={setIsZenMode}
                      />
                      <TeamStatus 
                        user={user} 
                        getMemberPresence={getMemberPresence} 
                      />
                    </div>
                  </motion.div>
                )}

                {activeView === 'project' && (
                  <motion.div key="project" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <ProjectManager user={user} projects={projects} onRefresh={fetchProjects} setProjects={setProjects} />
                  </motion.div>
                )}

                {activeView === 'time' && (
                  <motion.div key="time" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <TimeTracker user={user} onTicketSubmit={fetchTicketStats} completedTodaySeconds={completedTodaySeconds} currentSessionSeconds={currentSessionSeconds} completedMonthSeconds={completedMonthSeconds} />
                  </motion.div>
                )}

                {activeView === 'tickets' && (
                  <motion.div key="tickets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <TicketManager user={user} onReview={fetchTicketStats} />
                  </motion.div>
                )}


                {activeView === 'vault' && (
                  <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <Vault />
                  </motion.div>
                )}

                <div className={activeView === 'kairon' ? "w-full h-[800px]" : "hidden"}>
                  <iframe 
                    id="kairon-iframe"
                    src="/neoncode/kairon-live-bot/live_staff.html"
                    className="w-full h-full border-0 rounded-2xl border border-border-main shadow-sm"
                    title="Kairon Live Staff Dashboard"
                    allow="autoplay; clipboard-write"
                  ></iframe>
                </div>

                {activeView === 'team' && (
                  <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <TeamTracker user={user} />
                  </motion.div>
                )}

                {activeView === 'logs' && (
                  <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <Logs />
                  </motion.div>
                )}

                {activeView === 'crm' && user.isExecutive && (
                  <motion.div key="crm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <CRM user={user} />
                  </motion.div>
                )}

                {activeView === 'godmode' && user.isExecutive && (
                  <motion.div key="godmode" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <GodMode />
                  </motion.div>
                )}

                {activeView === 'project_management' && (
                  <motion.div key="project_management" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full overflow-hidden">
                    <ProjectManagement user={user} />
                  </motion.div>
                )}

              </AnimatePresence>
            </Suspense>
          </div>
        </div>
      </main>

      {/* Global Command Palette */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <CommandPalette 
            isOpen={isCommandPaletteOpen} 
            onClose={() => setIsCommandPaletteOpen(false)}
            onAction={(actionId) => {
              if (['project', 'tickets', 'time', 'crm', 'vault', 'analytics'].includes(actionId)) {
                setActiveView(actionId);
              } else if (actionId === 'logout') {
                handleLogout();
              } else if (actionId === 'toggle_timer') {
                handleTimerToggle();
              }
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

function ProfileSummaryCard({ user, currentStatus }) {
  const isOnline = currentStatus !== 'offline';
  
  // Try to find the UID from the TEAM_MEMBERS if possible, else fallback
  const teamMember = TEAM_MEMBERS.find(m => m.email === user?.email);
  const uid = teamMember?.uid || user?.uid || (user?.isExecutive ? 'MGT-EXE-01' : 'MGT-DEV-01');
  
  return (
    <div className="bg-bg-surface border border-border-main rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-5">
        <div className="flex-shrink-0">
          <img 
            src={user?.avatar || '/default-avatar.png'} 
            alt={user?.name} 
            className="w-[72px] h-[72px] rounded-[1.25rem] object-cover shadow-sm border border-bg-muted"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[22px] font-black text-text-main truncate leading-none mb-3 tracking-tight">
            {user?.name || 'Loading...'}
          </h2>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 bg-bg-muted text-text-muted rounded-md text-[11px] font-medium tracking-tight">
              @{user?.email?.split('@')[0] || 'username'}
            </span>
            <div className="w-1 h-1 rounded-full bg-[#d1d5da]"></div>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[11px] font-bold tracking-wider font-mono">
              {uid}
            </span>
            <div className="w-1 h-1 rounded-full bg-[#d1d5da]"></div>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMember({ name, role, status, isOnline, isSyncing, avatar, isMe }) {
  const config = isSyncing 
    ? { label: 'SYNCING...', color: 'gray', icon: <Clock size={10} className="animate-spin" /> }
    : (STATUS_CONFIG[status] || STATUS_CONFIG.offline);
  
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
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-bg-surface dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/50 transition-all group shadow-sm hover:shadow-md">
      <div className="relative">
        <img src={avatar} alt={name} className="w-11 h-11 rounded-[1rem] object-cover ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all duration-500" />
        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-50 dark:border-zinc-950 shadow-lg ${isOnline ? statusColors[config.color] : 'bg-zinc-400'} transition-all duration-500`}></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-sm font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate ${isSyncing ? 'text-zinc-400 italic' : 'text-zinc-900 dark:text-white'}`}>
            {name} {isMe && <span className="ml-1 text-[8px] text-blue-900 font-black uppercase tracking-widest">(You)</span>}
          </h4>
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${badgeClass} transition-all duration-500 ${isSyncing ? 'opacity-50' : ''}`}>
            {config.label}
          </span>
        </div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mt-0.5">{role}</p>
      </div>
    </div>
  );
}

function YourStatus({ currentStatus, handleStatusChange, setIsZenMode }) {
  return (
    <div className="bg-bg-surface border border-border-main rounded-xl overflow-hidden shadow-sm p-4">
      <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Your Status</h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {Object.keys(STATUS_CONFIG).map(key => {
          const config = STATUS_CONFIG[key];
          const isActive = currentStatus === key;
          
          return (
            <button
              key={key}
              onClick={() => handleStatusChange(key)}
              className={`flex items-center gap-2.5 p-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                isActive 
                  ? 'bg-[#1a1a1b] text-white border-[#1a1a1b] shadow-sm' 
                  : 'bg-bg-muted text-text-muted border-transparent hover:border-border-main hover:bg-bg-surface'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-text-muted'}>{config.icon}</span>
              <span className="truncate">{config.label}</span>
            </button>
          );
        })}
      </div>
      
      <button
        onClick={() => {
          setIsZenMode(true);
          handleStatusChange('deepwork');
        }}
        className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all group"
      >
        <div className="p-1 bg-white/20 rounded-md group-hover:rotate-12 transition-transform">
          <Coffee size={14} />
        </div>
        <span>Start Zen Mode</span>
      </button>
    </div>
  );
}

function TeamStatus({ user, getMemberPresence }) {
  return (
    <div className="bg-bg-surface border border-border-main rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-bg-root border-b border-border-main flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Team Status</h3>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-bold text-text-muted uppercase">Live</span>
        </div>
      </div>
      <div className="divide-y divide-[#e1e4e8] p-1">
        {TEAM_MEMBERS.map(member => {
          const presence = getMemberPresence(member.email);
          const isMe = member.email === user.email;
          
          return (
            <TeamMember 
              key={member.email}
              {...member} 
              status={presence.status} 
              isOnline={presence.isOnline}
              isSyncing={presence.isSyncing}
              isMe={isMe}
            />
          );
        })}
      </div>
    </div>
  );
}

function LogsView() {
  const logs = [
    { id: 1, type: 'info', msg: 'System integrity check completed.', time: '2 mins ago' },
    { id: 2, type: 'auth', msg: 'Admin login detected: Krishawn Rahul', time: '15 mins ago' },
    { id: 3, type: 'db', msg: 'Database sync: 14 projects updated.', time: '1 hour ago' },
    { id: 4, type: 'bot', msg: 'Kairon Live Bot: Session initiated.', time: '2 hours ago' },
    { id: 5, type: 'error', msg: 'Failed to fetch external API: /v1/metrics', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black tracking-tight">System Logs</h3>
        <button className="text-[10px] font-bold text-rose-600 uppercase tracking-widest hover:underline">Clear Logs</button>
      </div>
      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id} className="flex items-center justify-between p-4 bg-bg-root border border-border-main rounded-xl group hover:border-[#1a1a1b] transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${log.type === 'error' ? 'bg-rose-500' : log.type === 'auth' ? 'bg-[#4a154b]' : 'bg-emerald-500'}`}></div>
              <div>
                <p className="text-sm font-bold">{log.msg}</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-tight">{log.type}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-text-muted">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

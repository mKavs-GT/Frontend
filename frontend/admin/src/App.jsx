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
  TrendingUp
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
const Profile = lazyWithRetry(() => import('./components/Profile'));
const Vault = lazyWithRetry(() => import('./components/Vault'));
const Login = lazyWithRetry(() => import('./components/Login'));
const TeamTracker = lazyWithRetry(() => import('./components/TeamTracker'));
const CRM = lazyWithRetry(() => import('./components/CRM'));
const GodMode = lazyWithRetry(() => import('./components/GodMode'));
const NotificationCenter = lazyWithRetry(() => import('./components/NotificationCenter'));
const TicketManager = lazyWithRetry(() => import('./components/TicketManager'));
const ProjectManagement = lazyWithRetry(() => import('./components/ProjectManagement'));
const AnalyticsDashboard = lazyWithRetry(() => import('./components/AnalyticsDashboard'));
const ActivityFeed = lazyWithRetry(() => import('./components/ActivityFeed'));
const CommandPalette = lazyWithRetry(() => import('./components/CommandPalette'));
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

const NavItem = ({ icon, label, active, onClick, small }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-3 ${small ? 'py-1.5' : 'py-2'} rounded-md text-sm font-medium transition-colors ${
      active 
        ? 'bg-[#f3f4f6] text-[#1a1a1b] border border-[#e1e4e8] shadow-sm' 
        : 'text-[#6a737d] hover:bg-[#f3f4f6] border border-transparent'
    }`}
  >
    <span className={`${active ? 'text-[#1a1a1b]' : 'text-[#6a737d]'}`}>{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

const getViewTitle = (view) => {
  const titles = {
    analytics: 'Overview',
    project: 'Project Manager',
    time: 'Time Tracker',
    tickets: 'Approval Tickets',
    profile: 'Profile',
    vault: 'The Vault',
    team: 'Team Tracker',
    crm: 'Client Hub (CRM)',
    godmode: 'God Mode',
    project_management: 'Project Management'
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
   const [isLiveOnChatbot, setIsLiveOnChatbot] = useState(false);
   const [isAnyoneElseLive, setIsAnyoneElseLive] = useState(false);
   const [otherLiveAgent, setOtherLiveAgent] = useState('');
 
   useEffect(() => {
     const checkStaffStatus = async () => {
       try {
         const res = await fetch(`${API_BASE_URL}/api/staff-status`);
         if (res.ok) {
           const data = await res.json();
           const otherAgents = (data.staff || []).filter(s => s.isLive && s.email !== user.email);
           if (otherAgents.length > 0) {
             setIsAnyoneElseLive(true);
             setOtherLiveAgent(otherAgents[0].name || otherAgents[0].email);
           } else {
             setIsAnyoneElseLive(false);
           }
         }
       } catch (err) {
         console.error('Failed to fetch staff status:', err);
       }
     };
     checkStaffStatus();
     const interval = setInterval(checkStaffStatus, 60000);
     return () => clearInterval(interval);
   }, [user?.email]);
  
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
    // Force light mode for now as per user request
    return false;
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
            className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all backdrop-blur-md border border-white/10"
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

  // getStaffStatus is replaced by getMemberPresence from hook

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-[#f9f9fb] transition-colors duration-300 font-sans relative text-[#1a1a1b]">
      
      {/* Main Sidebar */}
      <aside className={`fixed lg:relative left-0 flex-shrink-0 bg-white border-r border-[#e1e4e8] flex flex-col z-50 h-full w-[240px] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Workspace Switcher */}
        <div className="p-4 border-b border-[#e1e4e8]">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f3f4f6] cursor-pointer transition-colors border border-transparent hover:border-[#e1e4e8]">
            <img src="/LOGOI.png" className="w-8 h-8 rounded-md object-contain" alt="" />
            <div className="flex-1 min-w-0">
              <img src="/MKAVS.png" className="h-4 object-contain invert" alt="MKAVS" />
              <p className="text-[10px] text-[#6a737d] font-medium uppercase tracking-tight">Enterprise</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-6 scrollbar-hide">
          {/* Dashboard Section */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold text-[#6a737d] uppercase tracking-wider">Dashboard</p>
            <div className="space-y-0.5">
              <NavItem icon={<TrendingUp size={18} />} label="Overview" active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
              <NavItem icon={<Kanban size={18} />} label="Project Manager" active={activeView === 'project'} onClick={() => setActiveView('project')} />
              <NavItem icon={<Folder size={18} />} label="Project Management" active={activeView === 'project_management'} onClick={() => setActiveView('project_management')} />
              <NavItem icon={<TicketIcon size={18} />} label="Approval Tickets" active={activeView === 'tickets'} onClick={() => setActiveView('tickets')} />
            </div>
          </div>

          {/* Monitor Section */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold text-[#6a737d] uppercase tracking-wider">Monitor</p>
            <div className="space-y-0.5">
              <NavItem icon={<Clock size={18} />} label="Time Tracker" active={activeView === 'time'} onClick={() => setActiveView('time')} />
              <NavItem icon={<Users size={18} />} label="Team Tracker" active={activeView === 'team'} onClick={() => setActiveView('team')} />
              <NavItem icon={<LogOut size={18} />} label="Logs" active={activeView === 'logs'} onClick={() => setActiveView('logs')} />
            </div>
          </div>

          {/* Manage Section */}
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold text-[#6a737d] uppercase tracking-wider">Manage</p>
            <div className="space-y-0.5">
              <NavItem icon={<Database size={18} />} label="Client Hub (CRM)" active={activeView === 'crm'} onClick={() => setActiveView('crm')} />
              <NavItem icon={<Briefcase size={18} />} label="The Vault" active={activeView === 'vault'} onClick={() => setActiveView('vault')} />
              <NavItem icon={<img src={kaironIcon} alt="" className="w-4 h-4" />} label="Kairon Live Bot" active={activeView === 'kairon'} onClick={() => setActiveView('kairon')} />
              {user.isExecutive && (
                <NavItem icon={<Shield size={18} className="text-rose-600" />} label="God Mode" active={activeView === 'godmode'} onClick={() => setActiveView('godmode')} />
              )}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#e1e4e8] space-y-1">
          <NavItem icon={<Info size={16} />} label="Changelog" onClick={() => {}} small />
          <div className="pt-2">
             <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
             >
               <LogOut size={18} />
               <span>Logout</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Top Header */}
        <header className="h-[52px] bg-white border-b border-[#e1e4e8] flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-md">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-[#1a1a1b]">
              <span className="text-[#1a1a1b] font-black uppercase tracking-tighter">MKAVS-GT</span>
              <span className="text-[#d1d5da] mx-1">/</span>
              <span>{getViewTitle(activeView)}</span>
            </div>
            
            {/* Search Bar */}
            <div 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden md:flex items-center max-w-sm w-full ml-8 relative cursor-pointer group"
            >
              <Search size={14} className="absolute left-3 text-[#6a737d] group-hover:text-[#1a1a1b] transition-colors" />
              <div className="w-full bg-[#f3f4f6] border border-transparent group-hover:border-[#e1e4e8] group-hover:bg-white rounded-md py-1.5 pl-9 pr-3 text-sm transition-all text-[#6a737d]">
                Search...
              </div>
              <div className="absolute right-2 flex items-center gap-1">
                <span className="text-[10px] font-bold text-[#6a737d] bg-white border border-[#e1e4e8] px-1 rounded">Cmd</span>
                <span className="text-[10px] font-bold text-[#6a737d] bg-white border border-[#e1e4e8] px-1 rounded">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
             {/* Timer Quick Access */}
             <div className="hidden sm:flex items-center gap-3 px-3 py-1 bg-[#f3f4f6] border border-[#e1e4e8] rounded-md">
                <div className={`w-2 h-2 rounded-full ${timerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs font-mono font-bold">{formatDuration(currentSessionSeconds || completedTodaySeconds)}</span>
                <button onClick={handleTimerToggle} className="p-1 hover:bg-white rounded transition-colors">
                  {timerRunning ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                </button>
             </div>

             <NotificationCenter user={user} />
            <button onClick={() => setActiveView('profile')} className="w-8 h-8 rounded-full border border-[#e1e4e8] overflow-hidden hover:opacity-80 transition-opacity">
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            </button>
          </div>
        </header>

        {/* View Header (Render Style) */}
        <div className="px-8 py-10 border-b border-[#e1e4e8]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight">{getViewTitle(activeView)}</h1>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-[#f3f4f6] border border-[#e1e4e8] rounded text-[10px] font-bold uppercase">Enterprise</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
               {isAnyoneElseLive && (
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1b] border border-[#333] rounded-lg">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-white uppercase tracking-tight">{otherLiveAgent} is live on chatbot</span>
                 </div>
               )}
               <button 
                 onClick={() => setIsLiveOnChatbot(!isLiveOnChatbot)}
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                   isLiveOnChatbot 
                     ? 'bg-rose-500 text-white hover:bg-rose-600' 
                     : 'bg-[#1a1a1b] text-white hover:bg-black'
                 }`}
               >
                 <Zap size={14} />
                 {isLiveOnChatbot ? 'End Chatbot Session' : 'Go live on Chatbot'}
               </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 bg-white scrollbar-hide">
          <div className="max-w-6xl mx-auto">
            <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"></div></div>}>
              <AnimatePresence mode="wait">
                {activeView === 'analytics' && (
                  <motion.div 
                    key="analytics" 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    <div className="lg:col-span-2">
                      <AnalyticsDashboard />
                    </div>
                    <div className="lg:col-span-1">
                      <ActivityFeed />
                    </div>
                  </motion.div>
                )}

                {activeView === 'project' && (
                  <motion.div key="project" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <ProjectManager user={user} projects={projects} onRefresh={fetchProjects} />
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

                {activeView === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <Profile user={user} />
                  </motion.div>
                )}

                {activeView === 'vault' && (
                  <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <Vault />
                  </motion.div>
                )}

                {activeView === 'kairon' && (
                  <motion.div key="kairon" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full h-[800px]">
                    <iframe 
                      src="/neoncode/kairon-live-bot/live_staff.html"
                      className="w-full h-full border-0 rounded-2xl border border-[#e1e4e8] shadow-sm"
                      title="Kairon Live Staff Dashboard"
                      allow="autoplay; clipboard-write"
                    ></iframe>
                  </motion.div>
                )}

                {activeView === 'team' && (
                  <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <TeamTracker user={user} />
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

                {activeView === 'logs' && (
                  <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <LogsView />
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

      {/* Close buttons for mobile sidebars */}
      {isMobileMenuOpen && (
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-[#1a1a1b] text-white px-6 py-3 rounded-full shadow-2xl font-bold text-xs lg:hidden flex items-center gap-2"
        >
          <X size={16} /> Close Menu
        </button>
      )}

    </div>
  );
}

function TeamMember({ name, role, status, isOnline, isSyncing, avatar }) {
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
    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/50 transition-all cursor-pointer group shadow-sm hover:shadow-md">
      <div className="relative">
        <img src={avatar} alt={name} className="w-11 h-11 rounded-[1rem] object-cover ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all duration-500" />
        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-zinc-50 dark:border-zinc-950 shadow-lg ${isOnline ? statusColors[config.color] : 'bg-zinc-400'} transition-all duration-500`}></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-sm font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate ${isSyncing ? 'text-zinc-400 italic' : 'text-zinc-900 dark:text-white'}`}>
            {name}
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
          <div key={log.id} className="flex items-center justify-between p-4 bg-[#f9f9fb] border border-[#e1e4e8] rounded-xl group hover:border-[#1a1a1b] transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${log.type === 'error' ? 'bg-rose-500' : log.type === 'auth' ? 'bg-[#4a154b]' : 'bg-emerald-500'}`}></div>
              <div>
                <p className="text-sm font-bold">{log.msg}</p>
                <p className="text-[10px] font-bold text-[#6a737d] uppercase tracking-tight">{log.type}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#6a737d]">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

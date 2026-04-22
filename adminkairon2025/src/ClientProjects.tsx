import { 
  Search, 
  LayoutGrid, 
  Users, 
  CalendarDays, 
  FileText, 
  Mic, 
  CalendarCheck, 
  GraduationCap, 
  LogOut, 
  Bell, 
  Settings, 
  ChevronDown,
  Phone,
  MessageSquare,
  MoreVertical,
  PencilRuler,
  Code2,
  Brush,
  Smartphone,
  Terminal,
  CalendarDays as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Play,
  Square,
  Clock,
  PanelLeftClose,
  PanelRightClose,
  PanelLeft,
  PanelRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/ui/modern-side-bar";
import { ProjectKanban } from "@/components/ui/project-kanban";
import { TimeTrackerView } from "@/components/ui/time-tracker-view";
import { type User, fetchUsers } from "@/lib/api";
import { useState, useEffect } from "react";

interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

interface ClientProjectsProps {
  onViewProject: (client: User) => void;
  onLogout?: () => void;
  adminAgent?: AdminAgent | null;
}

interface Client {
  user: User; // Store full user object
  name: string;
  projects: {
    name: string;
    type: "web" | "mobile" | "design";
  }[];
}

interface ScheduleItem {
  id: string;
  type: 'call' | 'todo' | 'remark';
  title: string;
  datetime?: string;
  description?: string;
  completed?: boolean;
}

const STORAGE_KEY = "mkavs_admin_schedule_v1";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

// Mock data for the dashboard
const hiringNeeds = [
  { title: "UI Designer", cand: 12, icon: <LayoutGrid className="w-6 h-6" />, color: "bg-blue-600/20 text-blue-400" },
  { title: "Frontend Dev", cand: 8, icon: <Code2 className="w-6 h-6" />, color: "bg-purple-600/20 text-purple-400" },
  { title: "Backend Dev", cand: 15, icon: <Terminal className="w-6 h-6" />, color: "bg-emerald-600/20 text-emerald-400" },
  { title: "App Developer", cand: 5, icon: <Smartphone className="w-6 h-6" />, color: "bg-amber-600/20 text-amber-400" },
  { title: "QA Tester", cand: 9, icon: <Settings className="w-6 h-6" />, color: "bg-rose-600/20 text-rose-400" },
];

const recruitmentProgress = [
  { name: "Adison Septimus", role: "UI Designer", status: "In Progress", active: true, stColor: "bg-blue-400" },
  { name: "Sandi Prajapati", role: "Frontend Developer", status: "Reviewing", active: false, stColor: "bg-amber-400" },
  { name: "Bessie Cooper", role: "Product Manager", status: "Interview", active: false, stColor: "bg-emerald-400" },
  { name: "Arlene McCoy", role: "QA Engineer", status: "Onboarding", active: false, stColor: "bg-blue-400" },
  { name: "Jerome Bell", role: "Backend Developer", status: "Pending", active: false, stColor: "bg-zinc-600" },
];

const newApplicants = [
  { name: "Guy Hawkins", role: "UI/UX Designer", initial: "GH", initialColor: "bg-blue-500" },
  { name: "Eleanor Pena", role: "Frontend Dev", img: "https://randomuser.me/api/portraits/women/65.jpg" },
  { name: "Courtney Henry", role: "React Expert", initial: "CH", initialColor: "bg-purple-500" },
];

const readyForTraining = [
  { name: "Kathryn Murphy", role: "Designer", img: "https://randomuser.me/api/portraits/women/32.jpg" },
  { name: "Albert Flores", role: "Dev", img: "https://randomuser.me/api/portraits/men/44.jpg" },
  { name: "Jenny Wilson", role: "QA", img: "https://randomuser.me/api/portraits/women/12.jpg" },
];

export default function ClientProjects({ onViewProject, onLogout, adminAgent }: ClientProjectsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [rawUsers, setRawUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        setRawUsers(users);
        // Map API users to Client interface
        const mappedClients: Client[] = users
          .filter(user => user.adminData) // Show all users with project data (even if name is empty)
          .map(user => ({
          user: user,
          name: user.adminData?.activeProjects || "Untitled", // Display Project Name (from adminData) as Card Title
          projects: [
            { 
              name: user.email, // Using email as subtitle/tech for now or 
              type: "web" 
            }
          ]
        }));
        setClients(mappedClients);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();

    // Load schedules from local storage
    const savedSchedules = localStorage.getItem(STORAGE_KEY);
    if (savedSchedules) {
      try {
        setSchedules(JSON.parse(savedSchedules));
      } catch (e) {}
    }
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.projects.some((project) =>
        project.name.toLowerCase().includes(query)
      )
    );
  });

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
             <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
             <div className="relative w-16 h-16 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-zinc-100 font-black uppercase tracking-[0.3em] text-sm animate-pulse">Initializing System</p>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">MKAVS Global Dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  // Common dark mode styles
  const cardStyle = "bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl transition-all duration-500 hover:bg-zinc-900/60 hover:border-white/10";
  const textMuted = "text-zinc-400 font-bold uppercase tracking-widest text-[10px]";
  const textHeading = "text-white font-black tracking-tight uppercase";

  const renderContent = () => {
    switch (currentView) {
      case "project-management":
        return <ProjectKanban />;
      case "time-tracker":
        return <TimeTrackerView />;
      case "dashboard":
      default:
        return (
          <div className="flex-1 overflow-y-auto px-10 pt-8 pb-10 custom-scrollbar">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-10 relative overflow-hidden text-white flex items-center shadow-[0_20px_50px_rgba(37,99,235,0.25)] min-h-[240px] group">
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="absolute right-[10%] -bottom-40 w-[300px] h-[300px] bg-emerald-400/20 rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 w-3/5">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-3">System Status: Optimal</p>
                <h2 className="text-[32px] font-black mb-2 tracking-tighter uppercase leading-none">
                  Good Morning, {adminAgent?.name.split(' ')[0] || 'Agent'}
                </h2>
                <p className="text-white/80 text-sm font-bold max-w-[340px] leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                  The global infrastructure is performing at 100% capacity. You have 75 pending requests awaiting your review.
                </p>
                <button className="h-[46px] bg-white text-blue-600 px-8 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl hover:shadow-white/20 active:scale-95">
                  Review System
                </button>
              </div>
              <div className="absolute right-0 bottom-[-20px] h-[130%] flex items-end z-10 pointer-events-none group-hover:translate-x-2 transition-transform duration-700">
                <img src="/hero-illustration.png" alt="Illustration" className="h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
              </div>
            </div>

            {/* Hiring Needs Cards */}
            <div className="mt-12 flex items-center justify-between mb-6">
              <h3 className={textHeading}>Operational Needs</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
                View Analytics <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-5">
              {hiringNeeds.map((item, idx) => (
                <div key={idx} className={cn(cardStyle, "p-6 rounded-[24px] flex flex-col items-center text-center group cursor-pointer hover:bg-blue-600/5 hover:border-blue-500/20")}>
                  <div className={cn("w-14 h-14 rounded-2xl flex flex-col items-center justify-center mb-5 shadow-inner group-hover:scale-110 transition-transform duration-500", item.color)}>
                    <div className="text-white drop-shadow-lg">
                      {item.icon}
                    </div>
                  </div>
                  <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-1.5 w-full truncate">
                    {item.title}
                  </h4>
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-none">({item.cand} Requests)</p>
                </div>
              ))}
            </div>

            {/* Recruitment Progress */}
            <div className="mt-14 flex items-center justify-between mb-6">
              <h3 className={textHeading}>Project Progress</h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                Filter List
              </button>
            </div>

            <div className={cn(cardStyle, "rounded-[32px] overflow-hidden p-2")}>
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-white/5">
                     <th className="py-5 px-8 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Full Name</th>
                     <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Designation</th>
                     <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                     <th className="py-5 px-8 text-right">
                       <Settings className="w-4 h-4 ml-auto text-zinc-700" />
                     </th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.02]">
                    {recruitmentProgress.map((row, idx) => (
                      <tr key={idx} className={cn(
                        "transition-all duration-300",
                        row.active 
                          ? "bg-blue-600/10 shadow-[inset_0_0_50px_rgba(37,99,235,0.1)] group" 
                          : "hover:bg-white/[0.02]"
                      )}>
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-black text-blue-400">
                               {row.name.split(' ').map(n => n[0]).join('')}
                             </div>
                             <span className={cn("text-[13px] font-black uppercase tracking-tight", row.active ? 'text-blue-400' : 'text-zinc-100')}>
                               {row.name}
                             </span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className={cn("text-[11px] font-bold uppercase tracking-widest", row.active ? 'text-white/60' : 'text-zinc-500')}>
                            {row.role}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-2.5">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              row.active ? 'bg-blue-400 animate-pulse' : row.stColor.replace('bg-', 'bg-')
                            )}></span>
                            <span className={cn("text-[11px] font-black uppercase tracking-widest", row.active ? 'text-blue-400' : 'text-zinc-200')}>
                              {row.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <button className={cn("p-2 rounded-xl transition-colors", row.active ? 'text-blue-400 hover:bg-blue-400/20' : 'text-zinc-700 hover:text-zinc-400 hover:bg-zinc-800')}>
                            <MoreVertical className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] text-white font-sans overflow-hidden">
      <Sidebar 
        onLogout={onLogout} 
        adminAgent={adminAgent} 
        activeItem={currentView} 
        onNavigate={(view) => setCurrentView(view)}
        isCollapsed={isLeftSidebarCollapsed}
        onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
        className={cn("transition-all duration-500", isLeftSidebarCollapsed ? "w-24" : "w-72")}
      />

      {/* CENTER MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950/20">
        {/* Top Header */}
        <header className="h-[100px] shrink-0 flex items-center justify-between px-10 border-b border-white/5 backdrop-blur-md z-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
              className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              title={isLeftSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isLeftSidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
            <div className="relative w-[400px] group">
               <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center">
                 <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
               </div>
              <input 
                type="search" 
                placeholder="Search something..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[52px] bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all font-bold uppercase tracking-widest"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-zinc-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            </button>
            <button 
              onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
              className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              title={isRightSidebarCollapsed ? "Expand Right Panel" : "Collapse Right Panel"}
            >
              {isRightSidebarCollapsed ? <PanelRight className="w-5 h-5" /> : <PanelRightClose className="w-5 h-5" />}
            </button>
            <button className="h-[46px] bg-blue-600 text-white px-6 rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 transition-all shadow-[0_8px_30px_rgba(37,99,235,0.3)] group">
              Add New <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </header>

        {/* Main Area */}
        {renderContent()}
      </main>

      {/* RIGHT SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isRightSidebarCollapsed ? 0 : 380,
          opacity: isRightSidebarCollapsed ? 0 : 1,
          x: isRightSidebarCollapsed ? 380 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-zinc-950/80 backdrop-blur-3xl h-full shrink-0 flex flex-col pt-10 pb-6 border-l border-white/5 z-20 overflow-y-auto custom-scrollbar overflow-x-hidden"
      >
         {/* Profile Toggles Area */}
         <div className="flex flex-col mb-10 px-8">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/10 transition-all">
                  <Settings className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/10 transition-all">
                    <Bell className="w-4 h-4" />
                  </button>
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-zinc-900 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right group cursor-pointer">
                <div className="flex flex-col justify-center">
                  <span className="text-[13px] font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                    {adminAgent?.name || 'Agent User'}
                  </span>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Admin Access</p>
                </div>
                <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" className="w-full h-full object-cover scale-110" />
                  </div>
                </div>
              </div>
            </div>
         </div>

         {/* QUICK CLOCK IN/OUT */}
         <div className="mb-12 px-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-6 shadow-[0_15px_30px_rgba(37,99,235,0.2)] group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Clock className="w-16 h-16 text-white" />
               </div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/70">Quick Timer</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Session</span>
                        <span className="text-2xl font-black text-white tabular-nums tracking-tighter">00:00:00</span>
                     </div>
                     <button className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                     </button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                     <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Today's Total</span>
                     <span className="text-[13px] font-black text-white uppercase tracking-widest">5.5 Hours</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Schedule Calendar */}
         <div className="mb-12 px-8">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-[13px] font-black text-white uppercase tracking-widest">
               Operational Log
             </h3>
             <button className="h-8 px-4 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600/20 transition-all">
               <CalendarIcon className="w-3 h-3" /> May 2025
             </button>
           </div>
           
           <div className="flex justify-between items-center gap-3">
              {[
                { day: "Mon", date: "22", active: false, d1: 'bg-emerald-500', d2: 'bg-emerald-500' },
                { day: "Tue", date: "23", active: false, d1: 'bg-emerald-500', d2: 'bg-amber-500', d3: 'bg-emerald-500' },
                { day: "Wed", date: "24", active: true },
                { day: "Thu", date: "25", active: false, d1: 'bg-emerald-500', d2: 'bg-emerald-500', d3: 'bg-amber-500' },
                { day: "Fri", date: "26", active: false, d1: 'bg-emerald-500', d2: 'bg-amber-500' },
              ].map((d, i) => (
                <div key={i} className={cn(
                  "flex flex-col items-center justify-center flex-1 h-[84px] rounded-2xl transition-all cursor-pointer border",
                  d.active 
                    ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.4)] border-blue-400/30 scale-110 relative z-10" 
                    : "bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                )}>
                  <span className={cn("text-[9px] font-black uppercase tracking-widest mb-1.5", d.active ? 'text-white/70' : 'text-zinc-600')}>{d.day}</span>
                  <span className="text-[18px] font-black mb-1.5">{d.date}</span>
                  <div className="flex gap-1 h-1">
                    {d.active ? (
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                      ) : (
                      <>
                        {d.d1 && <span className={cn("w-1 h-1 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]", d.d1)}></span>}
                        {d.d2 && <span className={cn("w-1 h-1 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]", d.d2)}></span>}
                        {d.d3 && <span className={cn("w-1 h-1 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]", d.d3)}></span>}
                      </>
                    )}
                  </div>
                </div>
              ))}
           </div>
         </div>

         {/* New Applicants */}
         <div className="mb-12 w-full px-8">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-[13px] font-black text-white uppercase tracking-widest">New Requests</h3>
             <button className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
               Manage
             </button>
           </div>
           
           <div className="space-y-4">
             {newApplicants.map((app, idx) => (
               <div key={idx} className={cn(cardStyle, "p-4 rounded-2xl flex items-center justify-between group cursor-pointer")}>
                 <div className="flex items-center gap-4">
                   {app.img ? (
                     <img src={app.img} alt={app.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/5 group-hover:ring-blue-500/50 transition-all shadow-lg" />
                   ) : (
                     <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs shadow-inner", app.initialColor)}>
                       {app.initial}
                     </div>
                   )}
                   <div className="flex flex-col">
                     <h4 className="text-[13px] font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{app.name}</h4>
                     <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">{app.role}</p>
                   </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-blue-600 hover:text-white transition-all shadow-md">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Ready For Training */}
         <div className="px-8 pb-10">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-[13px] font-black text-white uppercase tracking-widest">Training Assets</h3>
             <button className="text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
               Library
             </button>
           </div>

           <div className="grid grid-cols-3 gap-3">
             {readyForTraining.map((tr, idx) => (
               <div key={idx} className={cn(cardStyle, "p-3 rounded-2xl flex flex-col items-center group cursor-pointer hover:bg-blue-600 hover:border-blue-400 shadow-xl")}>
                 <img src={tr.img} alt={tr.name} className="w-10 h-10 rounded-full object-cover mb-3 ring-2 ring-white/5 shadow-lg group-hover:ring-white/20 transition-all" />
                 <h4 className="text-[10px] font-black text-white uppercase tracking-tight mb-1 group-hover:text-white transition-colors">{tr.name.split(' ')[0]}</h4>
                 <p className="text-[8px] font-black text-zinc-500 group-hover:text-white/60 mb-4 uppercase tracking-widest text-center truncate w-full">{tr.role}</p>
                 <button className="w-full py-2 bg-zinc-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-blue-600 transition-all shadow-inner">
                   Deploy
                 </button>
               </div>
             ))}
           </div>
         </div>

      </motion.aside>
    </div>
  );
}

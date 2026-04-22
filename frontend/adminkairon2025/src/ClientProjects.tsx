import React, { useState, useEffect } from "react";
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
  Server,
  Smartphone,
  Globe,
  Sun,
  Moon,
  Terminal,
  Briefcase,
  Plus,
  ChevronRight
} from "lucide-react";
import { type User, fetchUsers } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./components/ui/theme-toggle";

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
  user: User;
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

const hiringNeeds = [
  { title: "UI Designer", cand: 45, icon: <Brush className="w-6 h-6" />, color: "bg-purple-100 text-purple-600" },
  { title: "Back End Dev", cand: 32, icon: <Code2 className="w-6 h-6" />, color: "bg-blue-100 text-blue-600" },
  { title: "SEO Specialist", cand: 18, icon: <Terminal className="w-6 h-6" />, color: "bg-emerald-100 text-emerald-600" },
  { title: "Project Manager", cand: 12, icon: <Briefcase className="w-6 h-6" />, color: "bg-orange-100 text-orange-600" },
  { title: "UX Researcher", cand: 8, icon: <PencilRuler className="w-6 h-6" />, color: "bg-rose-100 text-rose-600" },
];

const recruitmentProgress = [
  { name: "John Smith", role: "Software Engineer", status: "On-Hold", stColor: "bg-amber-400", active: false },
  { name: "Sara Abraham", role: "UI Designer", status: "In-Progress", stColor: "bg-blue-400", active: true },
  { name: "Mila Jau", role: "Marketing Lead", status: "Pending", stColor: "bg-slate-300", active: false },
  { name: "David Miller", role: "DevOps Engineer", status: "Completed", stColor: "bg-emerald-400", active: false },
];

const newApplicants = [
  { name: "Alex Johnson", role: "Backend Developer", initial: "AJ", initialColor: "bg-blue-500" },
  { name: "Emma Wilson", role: "Content Specialist", initial: "EW", initialColor: "bg-rose-500" },
  { name: "Chris Evans", role: "UI Designer", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Sophia Lee", role: "UX Designer", img: "https://randomuser.me/api/portraits/women/65.jpg" },
];

export default function ClientProjects({ onViewProject, onLogout, adminAgent }: ClientProjectsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        const mappedClients: Client[] = users
          .filter(user => user.adminData)
          .map(user => ({
            user: user,
            name: user.adminData?.activeProjects || "Untitled Project",
            projects: [{ name: user.email, type: "web" }]
          }));
        setClients(mappedClients);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.user.email.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium tracking-wide animate-pulse uppercase text-[10px]">Initializing MKAVS Global Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F7FE] dark:bg-zinc-950 font-sans transition-colors duration-300">
      
      {/* SIDEBAR handled in Demo.tsx/Sidebar component, 
          so we only render the main content area here */}

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-[90px] shrink-0 flex items-center justify-between px-8 bg-transparent">
          <div className="flex items-center gap-8">
            <h1 className="text-[24px] font-black text-zinc-800 dark:text-white tracking-tight">Dashboard</h1>
            <div className="relative w-[360px]">
              <div className="absolute left-[18px] top-1/2 -translate-y-1/2">
                <Search className="w-[18px] h-[18px] text-[#A3AED0]" />
              </div>
              <input 
                type="text" 
                placeholder="Search projects, candidates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[48px] bg-white dark:bg-zinc-900 rounded-[14px] pl-12 pr-4 text-[14px] text-zinc-700 dark:text-white placeholder:text-[#A3AED0] focus:outline-none border-none shadow-sm transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="h-[46px] bg-white dark:bg-zinc-900 dark:text-white px-4 rounded-[14px] shadow-sm relative group overflow-hidden transition-all hover:shadow-md">
                 <Bell className="w-[20px] h-[20px] text-zinc-400 group-hover:text-primary" />
                 <span className="absolute top-[12px] right-[12px] w-[8px] h-[8px] bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
            </button>
            <button className="h-[46px] bg-primary text-primary-foreground px-6 rounded-[14px] text-[14px] font-bold flex items-center gap-3 hover:bg-opacity-90 transition-all shadow-lg active:scale-95">
              <Plus className="w-[18px] h-[18px]" strokeWidth={3} />
              New Project
            </button>
          </div>
        </header>

        {/* Main Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-10 scrollbar-hide">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Middle Column (v2.0 Client Portal) */}
            <div className="lg:col-span-2 space-y-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-br from-[#4361EE] to-[#7B91F5] rounded-[24px] p-10 relative overflow-hidden text-white flex items-center shadow-xl min-h-[220px]">
                  <div className="relative z-10">
                    <h2 className="text-[28px] font-black mb-[8px] tracking-tighter uppercase italic">Welcome Back, {adminAgent?.name.split(' ')[0] || 'Admin'}</h2>
                    <p className="text-white/80 text-[14px] font-medium max-w-[360px] leading-[1.6] mb-8">
                      You have {filteredClients.length} active client projects under your supervision. Everything looks great for today!
                    </p>
                    <button className="h-[42px] bg-white text-primary px-8 rounded-[12px] text-[13px] font-bold hover:shadow-lg transition-all active:scale-95">
                      Review Deliverables
                    </button>
                  </div>
                  <div className="absolute right-[-10px] bottom-[-20px] opacity-20 pointer-events-none">
                    <Terminal className="w-[300px] h-[300px]" />
                  </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-5 gap-4">
                  {hiringNeeds.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-zinc-900 p-5 rounded-[22px] shadow-sm flex flex-col items-center text-center cursor-pointer transition-colors border border-transparent hover:border-primary/20"
                    >
                      <div className={`w-[52px] h-[52px] rounded-[16px] flex items-center justify-center mb-4 ${item.color}`}>
                        {item.icon}
                      </div>
                      <h4 className="text-[13px] font-bold text-zinc-800 dark:text-white leading-tight mb-1 truncate w-full px-1">{item.title}</h4>
                      <p className="text-[11px] text-[#A3AED0] font-bold">{item.cand} Jobs</p>
                    </motion.div>
                  ))}
                </div>

                {/* Project Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm p-8 pb-4">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[18px] font-black text-zinc-800 dark:text-white tracking-tighter uppercase italic">Active Client Projects</h3>
                    <button className="text-[13px] font-bold text-primary hover:underline">View All</button>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-50 dark:border-zinc-800">
                        <th className="pb-4 font-bold text-[11px] text-[#A3AED0] uppercase tracking-widest">Project Name</th>
                        <th className="pb-4 font-bold text-[11px] text-[#A3AED0] uppercase tracking-widest">Status</th>
                        <th className="pb-4 font-bold text-[11px] text-[#A3AED0] uppercase tracking-widest">Progress</th>
                        <th className="pb-4 font-bold text-[11px] text-[#A3AED0] text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client, idx) => (
                        <tr key={idx} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="py-5">
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-zinc-800 dark:text-white group-hover:text-primary transition-colors">{client.name}</span>
                              <span className="text-[11px] text-[#A3AED0] font-medium">{client.user.email}</span>
                            </div>
                          </td>
                          <td className="py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              client.user.adminData?.projectStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                              client.user.adminData?.projectStatus === 'On Hold' ? 'bg-rose-500/10 text-rose-500' :
                              'bg-blue-500/10 text-blue-500'
                            }`}>
                              {client.user.adminData?.projectStatus || 'Active'}
                            </span>
                          </td>
                          <td className="py-5">
                             <div className="flex items-center gap-3">
                                <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden min-w-[60px]">
                                  <div 
                                    className="h-full bg-primary rounded-full transition-all duration-1000"
                                    style={{ width: `${client.user.adminData?.projectProgress || 0}%` }}
                                  />
                                </div>
                                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">{client.user.adminData?.projectProgress || 0}%</span>
                             </div>
                          </td>
                          <td className="py-5 text-right">
                             <button 
                                onClick={() => onViewProject(client.user)}
                                className="h-[34px] w-[34px] rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                              >
                               <ChevronRight className="w-4 h-4" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-8">
                {/* Profile Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm p-8 flex flex-col items-center text-center">
                   <div className="w-[100px] h-[100px] rounded-full p-1 bg-gradient-to-br from-primary to-emerald-400 mb-4 shadow-lg overflow-hidden relative">
                      <img 
                        src={adminAgent?.email?.includes('mrv') ? '/mrv.png' : '/founder.png'} 
                        alt="Profile" 
                        onLoad={(e) => e.currentTarget.style.scale = '1.2'}
                        style={{ objectPosition: 'center 20%' }}
                        className="w-full h-full rounded-full object-cover bg-zinc-100 dark:bg-zinc-800" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<div class='h-full flex items-center justify-center text-2xl font-black text-white'>${adminAgent?.name[0] || 'A'}</div>`;
                        }}
                      />
                      <div className="absolute bottom-1 right-2 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-zinc-900 rounded-full"></div>
                   </div>
                   <h3 className="text-[18px] font-black text-zinc-800 dark:text-white uppercase tracking-tighter leading-tight italic">{adminAgent?.name || 'Admin'}</h3>
                   <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mt-1 mb-6 border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">{adminAgent?.role || 'Agent'}</p>
                   
                   <div className="w-full grid grid-cols-2 gap-4 border-t border-zinc-50 dark:border-zinc-800 pt-6">
                      <div className="text-left">
                        <p className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1">Tasks</p>
                        <p className="text-[18px] font-black text-zinc-800 dark:text-white italic tabular-nums">42</p>
                      </div>
                      <div className="text-left border-l border-zinc-50 dark:border-zinc-800 pl-4">
                        <p className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1">Success</p>
                        <p className="text-[18px] font-black text-zinc-800 dark:text-white italic tabular-nums">12</p>
                      </div>
                   </div>
                </div>

                {/* Upcoming Meetings */}
                <div className="bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm p-8">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[15px] font-black text-zinc-800 dark:text-white tracking-widest uppercase italic">Schedule</h3>
                      <button><Settings className="w-4 h-4 text-zinc-400 hover:text-primary transition-colors" /></button>
                   </div>
                   <div className="space-y-6">
                      {[
                        { title: "Website Launch Prep", type: "Sync", time: "10:00 AM", color: "bg-primary" },
                        { title: "UI/UX Review", type: "Review", time: "02:30 PM", color: "bg-emerald-500" },
                        { title: "Content Strategy", type: "Brief", time: "04:00 PM", color: "bg-rose-500" },
                      ].map((meet, i) => (
                        <div key={i} className="flex gap-4 group cursor-pointer">
                           <div className={`w-1 shrink-0 rounded-full ${meet.color} h-12 shadow-sm group-hover:h-14 transition-all duration-300`}></div>
                           <div className="flex-1">
                              <h4 className="text-[13px] font-bold text-zinc-700 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">{meet.title}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">{meet.type}</span>
                                <span className="text-zinc-300 dark:text-zinc-700 font-black">•</span>
                                <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">{meet.time}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                   <button className="w-full mt-8 py-3 rounded-[14px] border-2 border-dashed border-zinc-100 dark:border-zinc-800 text-[11px] font-black text-[#A3AED0] uppercase tracking-[0.2em] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                      Add New Slot
                   </button>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 gap-4">
                   <button className="bg-primary/5 border border-primary/10 p-5 rounded-[22px] flex flex-col items-center gap-2 group hover:bg-primary hover:text-white transition-all shadow-sm">
                      <Smartphone className="w-6 h-6 text-primary group-hover:text-white" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Mobile</span>
                   </button>
                   <button className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-[22px] flex flex-col items-center gap-2 group hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                      <Code2 className="w-6 h-6 text-emerald-500 group-hover:text-white" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Backend</span>
                   </button>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={onLogout}
                  className="w-full h-[60px] bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400 rounded-[18px] border border-rose-100 dark:border-rose-500/20 text-[12px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

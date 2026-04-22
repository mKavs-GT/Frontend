import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Target, CheckSquare, Square, Lock, Unlock, Rocket,
  Shield, Palette, FileText, Terminal, Radio, Plus, Trash2,
  MessageCircle, Hash, Video, TrendingUp, Calendar, Users,
  CircleAlert, CheckCircle2, Clock, ChevronRight, RefreshCw,
  AlignLeft, Play, Box, Server, Smartphone, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

/* ─────────────────────────── Types ─────────────────────────── */
interface ChecklistItem {
  id: string;
  label: string;
  status: "Pending" | "In Progress" | "Success";
}

interface TaskAssignment {
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  assignee: "MrK" | "MrV";
  tasks: string[];
}

interface LogEntry {
  ts: string;
  agent: "MrK" | "MrV";
  action: string;
}

const STORAGE_KEY = "mkavs_sprint_v1";

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "mob", label: "Mobile Responsiveness", status: "Pending" },
  { id: "spd", label: "90+ Speed Optimization", status: "Pending" },
  { id: "seo", label: "SEO Meta & Structured Data", status: "In Progress" },
  { id: "srv", label: "Server Deployment", status: "Pending" },
  { id: "sec", label: "Security Headers & HTTPS", status: "Success" },
  { id: "a11", label: "Accessibility (WCAG 2.1)", status: "Pending" },
];

const DEFAULT_ROLES: TaskAssignment[] = [
  {
    role: "Tech Lead",
    icon: Shield,
    color: "bg-primary/10 text-primary",
    assignee: "MrK",
    tasks: ["Backend Architecture", "Security Hardening", "API Integration"],
  },
  {
    role: "UI/UX Designer",
    icon: Palette,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    assignee: "MrV",
    tasks: ["High-Motion Frontends", "Custom Branding", "Component Library"],
  },
  {
    role: "Content Specialist",
    icon: FileText,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    assignee: "MrK",
    tasks: ["SEO Strategy", "Technical Writing", "Content Audit"],
  },
];

function nowStr() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

export function SprintPlanningView() {
  const [sprintGoal, setSprintGoal] = useState("Ship v2.0 Client Portal with full mobile & speed compliance");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [roles, setRoles] = useState<TaskAssignment[]>(DEFAULT_ROLES);
  const [logs, setLogs] = useState<LogEntry[]>([
    { ts: nowStr(), agent: "MrK", action: "Sprint board initialized." },
  ]);
  const [launched, setLaunched] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const allSuccess = checklist.every((c) => c.status === "Success");
  const successCount = checklist.filter((c) => c.status === "Success").length;
  const progressPct = Math.round((successCount / checklist.length) * 100);

  const [newTask, setNewTask] = useState<{ [role: string]: string }>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.sprintGoal) setSprintGoal(d.sprintGoal);
        if (d.startDate) setStartDate(d.startDate);
        if (d.endDate) setEndDate(d.endDate);
        if (d.checklist) setChecklist(d.checklist);
        if (d.roles) setRoles(d.roles);
        if (d.logs) setLogs(d.logs);
        if (d.launched) setLaunched(d.launched);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sprintGoal, startDate, endDate, checklist, roles, logs, launched }));
  }, [sprintGoal, startDate, endDate, checklist, roles, logs, launched]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  function addLog(agent: "MrK" | "MrV", action: string) {
    setLogs((prev) => [...prev.slice(-49), { ts: nowStr(), agent, action }]);
  }

  function cycleStatus(id: string) {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next: ChecklistItem["status"] =
          item.status === "Pending" ? "In Progress" : item.status === "In Progress" ? "Success" : "Pending";
        addLog("MrK", `Updated task "${item.label}" status to ${next}`);
        return { ...item, status: next };
      })
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F4F7FE] dark:bg-zinc-950 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-[90px] shrink-0 flex items-center justify-between px-8 bg-transparent">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
             <Zap className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-[24px] font-black text-zinc-800 dark:text-white tracking-tighter uppercase italic">Sprint Control</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest leading-none">Global Mission Control</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex -space-x-3">
             <div className="w-10 h-10 rounded-full border-4 border-[#F4F7FE] dark:border-zinc-950 bg-primary flex items-center justify-center text-[12px] font-black text-primary-foreground italic">MK</div>
             <div className="w-10 h-10 rounded-full border-4 border-[#F4F7FE] dark:border-zinc-950 bg-blue-500 flex items-center justify-center text-[12px] font-black text-white italic">MV</div>
          </div>
          <button className="h-[46px] bg-white dark:bg-zinc-900 text-zinc-400 px-6 rounded-[14px] text-[12px] font-black uppercase tracking-widest shadow-sm hover:text-primary transition-all">
             View Board
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-10 scrollbar-hide space-y-8 mt-2">
        
        {/* Top Section: Goal & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[30px] p-8 shadow-sm flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-primary mb-4">
                   <Target className="w-5 h-5" />
                   <span className="text-[11px] font-black uppercase tracking-[0.3em]">Current Sprint Goal</span>
                </div>
                <h2 className="text-[28px] font-black text-zinc-800 dark:text-white leading-[1.2] tracking-tighter uppercase italic max-w-xl">
                  {sprintGoal}
                </h2>
              </div>
              
              <div className="mt-10 flex items-end justify-between relative z-10">
                 <div className="flex gap-10">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1">Launch Date</span>
                       <span className="text-[18px] font-black text-zinc-800 dark:text-white italic">{endDate || 'TBD'}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest mb-1">Status</span>
                       <span className="text-[18px] font-black text-primary italic uppercase">{progressPct}% READY</span>
                    </div>
                 </div>
                 <div className="w-40 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 1 }}
                    />
                 </div>
              </div>

              {/* Decorative Icon */}
              <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                 <Box className="w-[300px] h-[300px]" />
              </div>
           </div>

           <div className="bg-primary rounded-[30px] p-8 text-primary-foreground shadow-lg flex flex-col justify-center relative overflow-hidden group">
              <h3 className="text-[14px] font-black uppercase tracking-widest mb-2 italic">Survival Checklist</h3>
              <p className="text-[32px] font-black leading-none mb-6">
                {successCount}/{checklist.length} <span className="text-[14px] font-bold opacity-80 uppercase tracking-tight">Verified</span>
              </p>
              <button 
                onClick={() => setLaunched(true)}
                disabled={!allSuccess || launched}
                className={cn(
                  "w-full py-4 rounded-[18px] text-[12px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                  launched ? "bg-white/20 text-white cursor-default" : 
                  allSuccess ? "bg-black text-white hover:scale-105 active:scale-95 shadow-xl" :
                  "bg-black/10 text-primary-foreground/50 cursor-not-allowed"
                )}
              >
                {launched ? <CheckCircle2 className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
                {launched ? "DEPLOYED" : "INITIATE LAUNCH"}
              </button>
              
              <div className="absolute right-[-10px] bottom-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Globe className="w-24 h-24" />
              </div>
           </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {roles.map((role, idx) => (
             <div key={idx} className="bg-white dark:bg-zinc-900 rounded-[24px] p-6 shadow-sm border border-transparent hover:border-primary/10 transition-all flex flex-col">
                <div className="flex items-center justify-between mb-6">
                   <div className={cn("w-10 h-10 rounded-[14px] flex items-center justify-center", role.color)}>
                      <role.icon className="w-5 h-5" />
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[10px] font-black text-[#A3AED0] uppercase tracking-widest">Assignee</span>
                      <span className="text-[13px] font-black text-zinc-800 dark:text-white italic uppercase">{role.assignee}</span>
                   </div>
                </div>
                <h4 className="text-[16px] font-black text-zinc-800 dark:text-white uppercase italic tracking-tighter mb-4">{role.role}</h4>
                <div className="space-y-3 flex-1 mb-6">
                   {role.tasks.map((task, i) => (
                     <div key={i} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-[14px] group/task">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[12px] font-bold text-zinc-600 dark:text-zinc-300 flex-1">{task}</span>
                     </div>
                   ))}
                </div>
                <button className="w-full py-3 rounded-[12px] border-2 border-dashed border-zinc-100 dark:border-zinc-800 text-[10px] font-black text-[#A3AED0] uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                  Add Task
                </button>
             </div>
           ))}
        </div>

        {/* Bottom Section: Checklist & Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
           <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[16px] font-black text-zinc-800 dark:text-white tracking-widest uppercase italic">Survival Log</h3>
              </div>
              <div className="space-y-4">
                 {checklist.map((item) => (
                   <div 
                    key={item.id} 
                    onClick={() => cycleStatus(item.id)}
                    className="flex items-center justify-between group cursor-pointer"
                   >
                     <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                          item.status === 'Success' ? "bg-primary shadow-[0_0_10px_hsla(var(--primary),0.3)]" : "bg-zinc-100 dark:bg-zinc-800"
                        )}>
                           {item.status === 'Success' && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                        </div>
                        <span className={cn(
                          "text-[14px] font-bold transition-colors",
                          item.status === 'Success' ? "text-zinc-400 line-through" : "text-zinc-800 dark:text-white"
                        )}>{item.label}</span>
                     </div>
                     <span className={cn(
                       "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                       item.status === 'Success' ? "bg-emerald-500/10 text-emerald-500" :
                       item.status === 'In Progress' ? "bg-blue-500/10 text-blue-500" :
                       "bg-zinc-100 dark:bg-zinc-800 text-[#A3AED0]"
                     )}>
                       {item.status}
                     </span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-zinc-950 rounded-[28px] p-8 shadow-sm border border-white/5 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                 <Terminal className="w-4 h-4 text-primary" />
                 <span className="text-[12px] font-black text-primary uppercase tracking-[0.2em]">Live Status Log</span>
                 <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div 
                ref={logRef}
                className="h-[240px] overflow-y-auto space-y-2 pr-2 scrollbar-hide relative z-10"
              >
                 {logs.map((log, i) => (
                   <div key={i} className="flex gap-3 text-[12px] font-mono">
                      <span className="text-zinc-700 shrink-0">[{log.ts}]</span>
                      <span className={cn("shrink-0 font-black", log.agent === 'MrK' ? "text-primary" : "text-blue-400")}>{log.agent}:</span>
                      <span className="text-zinc-300 italic">{log.action}</span>
                   </div>
                 ))}
                 <div className="text-primary animate-pulse">_</div>
              </div>
              
              {/* Terminal Background Pattern */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                 <div className="w-full h-full bg-[radial-gradient(#39ff14_1px,transparent_1px)] [background-size:20px_20px]" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default SprintPlanningView;

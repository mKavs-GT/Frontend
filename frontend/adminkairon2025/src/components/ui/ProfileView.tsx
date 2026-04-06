import { motion } from "framer-motion";
import { User, Mail, Phone, Building, Briefcase, MapPin, Calendar, Clock, Play, Square, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

// Image Imports
import mraImg from '../../images/mra.png';
import mrkImg from '../../images/mrk.png';
import mrmImg from '../../images/mrm.png';
import mrssImg from '../../images/mrss.png';
import mrvImg from '../../images/mrv.png';
import mrzImg from '../../images/mrz.png';

interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

interface AgentProfile {
  name: string;
  displayName: string;
  role: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  image: string;
  specialization: string;
  hireDate: string;
  employeeId: string;
  ssn: string;
  birthDate: string;
  address: string;
  city: string;
  jobType: string;
  department: string;
}

interface ProfileViewProps {
  adminAgent: AdminAgent | null;
}

const agentProfiles: Record<string, AgentProfile> = {
  "MRK": {
    name: "MRK",
    displayName: "MR. K",
    role: "Founder",
    title: "FOUNDER",
    email: "mrk@mkavs.com",
    phone: "+1 (555) 123-4567",
    company: "MKAVS Studio",
    image: mrkImg,
    specialization: "Full-Stack",
    hireDate: "August 28, 2020",
    employeeId: "1156",
    ssn: "XXX-XX-3561",
    birthDate: "12/12/90",
    address: "123 Creative Lane",
    city: "Seattle, WA",
    jobType: "Full-Time",
    department: "Engineering"
  },
  "MRV": {
    name: "MRV",
    displayName: "MR. V",
    role: "CTO & Admin",
    title: "CTO & ADMIN",
    email: "mrv@mkavs.com",
    phone: "+1 (555) 987-6543",
    company: "MKAVS Studio",
    image: mrvImg,
    specialization: "Architecture",
    hireDate: "May 15, 2021",
    employeeId: "1203",
    ssn: "XXX-XX-4892",
    birthDate: "05/08/88",
    address: "456 Tech Blvd",
    city: "Austin, TX",
    jobType: "Full-Time",
    department: "Management"
  },
  "MRS": {
    name: "MRS",
    displayName: "MRS. S",
    role: "Senior Designer",
    title: "SENIOR DESIGNER",
    email: "mrss@mkavs.com",
    phone: "+1 (555) 456-7890",
    company: "MKAVS Studio",
    image: mrssImg,
    specialization: "UI/UX Design",
    hireDate: "January 10, 2022",
    employeeId: "1352",
    ssn: "XXX-XX-1234",
    birthDate: "03/24/92",
    address: "789 Design Ave",
    city: "New York, NY",
    jobType: "Full-Time",
    department: "Design"
  },
  "MRM": {
    name: "MRM",
    displayName: "MR. M",
    role: "Senior Developer",
    title: "SENIOR DEVELOPER",
    email: "mrm@mkavs.com",
    phone: "+1 (555) 234-5678",
    company: "MKAVS Studio",
    image: mrmImg,
    specialization: "Backend",
    hireDate: "September 05, 2021",
    employeeId: "1290",
    ssn: "XXX-XX-8765",
    birthDate: "11/15/89",
    address: "321 Backend St",
    city: "San Francisco, CA",
    jobType: "Full-Time",
    department: "Engineering"
  },
  "MRA": {
    name: "MRA",
    displayName: "MR. A",
    role: "Frontend Developer",
    title: "FRONTEND DEVELOPER",
    email: "mra@mkavs.com",
    phone: "+1 (555) 876-5432",
    company: "MKAVS Studio",
    image: mraImg,
    specialization: "Frontend",
    hireDate: "March 20, 2023",
    employeeId: "1489",
    ssn: "XXX-XX-5678",
    birthDate: "07/30/95",
    address: "654 Frontend Blvd",
    city: "Chicago, IL",
    jobType: "Full-Time",
    department: "Engineering"
  },
  "MRZ": {
    name: "MRZ",
    displayName: "MR. Z",
    role: "Creative Tech",
    title: "CREATIVE TECH",
    email: "mrz@mkavs.com",
    phone: "+1 (555) 345-6789",
    company: "MKAVS Studio",
    image: mrzImg,
    specialization: "Creative Code",
    hireDate: "July 12, 2022",
    employeeId: "1405",
    ssn: "XXX-XX-9012",
    birthDate: "09/18/93",
    address: "987 Code Lane",
    city: "Los Angeles, CA",
    jobType: "Full-Time",
    department: "Creative"
  }
};

// Extracted Agent matching logic
function getAgentKey(adminAgent: AdminAgent | null): string {
  let agentKey = "MRK";
  if (!adminAgent) return agentKey;

  if (adminAgent.name) {
    const exactName = adminAgent.name.toUpperCase().trim();
    if (agentProfiles[exactName]) {
      return exactName;
    } else {
      const nameKey = exactName.substring(0, 3);
      if (agentProfiles[nameKey]) return nameKey;
    }
  }

  if (adminAgent.email) {
    const emailMatch = adminAgent.email.match(/agent\d+(\w{3})/i);
    if (emailMatch && emailMatch[1]) {
      const emailKey = emailMatch[1].toUpperCase();
      if (agentProfiles[emailKey]) return emailKey;
    }
  }

  if (adminAgent.role) {
    const roleMap: Record<string, string> = {
      'founder': 'MRK',
      'cto': 'MRV',
      'designer': 'MRS',
      'senior developer': 'MRM',
      'frontend developer': 'MRA',
      'creative': 'MRZ',
      'backend': 'MRM',
      'frontend': 'MRA',
    };
    
    const roleLower = adminAgent.role.toLowerCase();
    for (const [key, value] of Object.entries(roleMap)) {
      if (roleLower.includes(key)) {
        return value;
      }
    }
  }
  return agentKey;
}

export function ProfileView({ adminAgent }: ProfileViewProps) {
  const agentKey = getAgentKey(adminAgent);
  const profile = agentProfiles[agentKey] || agentProfiles["MRK"];

  // ===============================
  // REAL-TIME CLOCK & TIME TRACKING
  // ===============================
  const [isTracking, setIsTracking] = useState(false);
  const [currentSessionElapsed, setCurrentSessionElapsed] = useState(0); // in ms
  const [lastStart, setLastStart] = useState<number | null>(null);
  
  const [timeStats, setTimeStats] = useState({
    today: 0,
    week: 0,
    month: 0
  });

  // Load Tracking State
  useEffect(() => {
    const storageKey = `time_tracking_${agentKey}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.isTracking && data.lastStart) {
          setIsTracking(true);
          setLastStart(data.lastStart);
          setCurrentSessionElapsed(Date.now() - data.lastStart);
        }
      } catch (e) {
        console.error("Error parsing stored tracking state", e);
      }
    }
    calculateAggregates();
  }, [agentKey]);

  // Live Elapsed Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && lastStart) {
      interval = setInterval(() => {
        setCurrentSessionElapsed(Date.now() - lastStart);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, lastStart]);

  const calculateAggregates = () => {
    const historyKey = `time_history_${agentKey}`;
    const historyStored = localStorage.getItem(historyKey);
    let history: { start: number; duration: number }[] = [];
    if (historyStored) {
      try {
        history = JSON.parse(historyStored);
      } catch (e) {}
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Week start (Sunday)
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    // Month start
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;

    history.forEach(log => {
      if (log.start >= startOfToday) todayTotal += log.duration;
      if (log.start >= startOfWeek.getTime()) weekTotal += log.duration;
      if (log.start >= startOfMonth) monthTotal += log.duration;
    });

    setTimeStats({
      today: todayTotal,
      week: weekTotal,
      month: monthTotal
    });
  };

  const handleToggleTracking = () => {
    const storageKey = `time_tracking_${agentKey}`;
    const historyKey = `time_history_${agentKey}`;

    if (isTracking) {
      // Stop tracking
      localStorage.removeItem(storageKey);
      
      // Save session to history
      if (lastStart) {
        const duration = Date.now() - lastStart;
        const historyStored = localStorage.getItem(historyKey);
        let history = historyStored ? JSON.parse(historyStored) : [];
        history.push({ start: lastStart, duration });
        localStorage.setItem(historyKey, JSON.stringify(history));
      }
      
      setIsTracking(false);
      setLastStart(null);
      setCurrentSessionElapsed(0);
      calculateAggregates();
    } else {
      // Start tracking
      const startTime = Date.now();
      localStorage.setItem(storageKey, JSON.stringify({ isTracking: true, lastStart: startTime }));
      setIsTracking(true);
      setLastStart(startTime);
    }
  };

  const formatMs = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const formatHours = (ms: number) => {
    const totalHours = (ms / (1000 * 60 * 60)).toFixed(1);
    return `${totalHours}h`;
  };

  // ===============================
  // ONLINE USERS HEARTBEAT
  // ===============================
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  useEffect(() => {
    const PING_INTERVAL = 5000;
    const TIMEOUT_MS = 15000;
    const presenceKey = "mkavs_admin_presence";

    const pingPresence = () => {
      try {
        const stored = localStorage.getItem(presenceKey);
        const presence = stored ? JSON.parse(stored) : {};
        const now = Date.now();
        
        // Update my own presence
        presence[agentKey] = now;
        
        // Clean up stale users and compute active ones
        const active: string[] = [];
        Object.keys(presence).forEach(key => {
          if (now - presence[key] < TIMEOUT_MS) {
            active.push(key);
          } else {
            delete presence[key];
          }
        });
        
        localStorage.setItem(presenceKey, JSON.stringify(presence));
        setOnlineUsers(active);
      } catch (e) {}
    };

    pingPresence();
    const interval = setInterval(pingPresence, PING_INTERVAL);
    
    // Monitor localstorage events to update UI instantly when other tabs ping
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === presenceKey && e.newValue) {
         try {
           const presence = JSON.parse(e.newValue);
           const now = Date.now();
           const active = Object.keys(presence).filter(k => now - presence[k] < TIMEOUT_MS);
           setOnlineUsers(active);
         } catch(e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [agentKey]);


  // Mock Onboarding Tasks
  const onboardingTasks = [
    { title: "Prepare workspace, software, access", assigneeId: "MRV", dueDate: "07/25/2026", done: true, attachment: "-" },
    { title: "Meeting with Head PM", assigneeId: "MRK", dueDate: "07/26/2026", done: false, attachment: "meetingkit.zip" },
    { title: "Project code structural review", assigneeId: "MRS", dueDate: "07/26/2026", done: false, attachment: "-" },
    { title: "Company vision sync", assigneeId: "MRK", dueDate: "07/28/2026", done: false, attachment: "company.zip" },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen pb-12 w-full text-zinc-100 font-sans selection:bg-blue-500/30">
      
      {/* Background styling for the dark/neon theme */}
      <div className="fixed inset-0 -z-10 bg-[#060606]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.1),transparent_100%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Top Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main User Card (Takes 8 columns on large screens) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="lg:col-span-8 bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden"
          >
            {/* Subtle Neon Accents */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

            <div className="relative group shrink-0">
               <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-zinc-700/50 bg-zinc-800 p-2 shadow-2xl relative z-10 transition-transform duration-300 group-hover:scale-105">
                 <div className="w-full h-full rounded-full overflow-hidden relative bg-black/50">
                   <img src={profile.image} alt={profile.displayName} className="w-full h-full object-cover object-top" />
                 </div>
               </div>
               {/* Online Indicator */}
               <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-5 h-5 bg-emerald-500 border-2 border-zinc-900 rounded-full z-20 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
            </div>

            <div className="flex-1 space-y-4 relative z-10 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{profile.displayName}</h1>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold text-xs uppercase tracking-wider">
                    Active
                  </span>
                </div>
                
                {/* Time Tracking Widget embedded in Header for prominence */}
                <div className="flex flex-col items-end gap-2 bg-black/40 border border-zinc-800 p-3 rounded-2xl w-full sm:w-auto">
                   <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Current Session</p>
                        <p className={`text-xl font-mono font-bold ${isTracking ? 'text-blue-400 animate-pulse' : 'text-zinc-300'}`}>
                           {formatMs(currentSessionElapsed)}
                        </p>
                      </div>
                      <button 
                         onClick={handleToggleTracking}
                         className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 shadow-lg ${
                           isTracking 
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 shadow-red-500/20' 
                            : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
                         }`}
                      >
                         {isTracking ? <Square fill="currentColor" className="w-5 h-5" /> : <Play fill="currentColor" className="w-5 h-5 ml-1" />}
                      </button>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-2 border-t border-zinc-800 text-sm">
                <div className="flex items-center gap-3 text-zinc-400">
                  <Briefcase className="w-4 h-4 text-zinc-500" />
                  <span className="w-16 font-medium text-zinc-500">Role:</span>
                  <span className="text-zinc-200">{profile.role}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Building className="w-4 h-4 text-zinc-500" />
                  <span className="w-16 font-medium text-zinc-500">Dept:</span>
                  <span className="text-zinc-200">{profile.department}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <span className="w-16 font-medium text-zinc-500">E-mail:</span>
                  <span className="text-zinc-200 truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Phone className="w-4 h-4 text-zinc-500" />
                  <span className="w-16 font-medium text-zinc-500">Phone:</span>
                  <span className="text-zinc-200">{profile.phone}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Time Tracking Stats Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-4 bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[50px]" />
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" /> Work Log Metrics
            </h2>
            
            <div className="flex-1 flex flex-col justify-center space-y-6">
               <div className="space-y-1">
                 <div className="flex justify-between items-end">
                   <span className="text-sm font-medium text-zinc-400">Today</span>
                   <span className="text-2xl font-bold text-white">{formatHours(timeStats.today + (isTracking ? currentSessionElapsed : 0))}</span>
                 </div>
                 <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min(100, ((timeStats.today + currentSessionElapsed) / (8 * 3600 * 1000)) * 100)}%` }} />
                 </div>
               </div>

               <div className="space-y-1">
                 <div className="flex justify-between items-end">
                   <span className="text-sm font-medium text-zinc-400">This Week</span>
                   <span className="text-2xl font-bold text-white">{formatHours(timeStats.week + (isTracking ? currentSessionElapsed : 0))}</span>
                 </div>
                 <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${Math.min(100, ((timeStats.week + currentSessionElapsed) / (40 * 3600 * 1000)) * 100)}%` }} />
                 </div>
               </div>

               <div className="space-y-1">
                 <div className="flex justify-between items-end">
                   <span className="text-sm font-medium text-zinc-400">This Month</span>
                   <span className="text-2xl font-bold text-white">{formatHours(timeStats.month + (isTracking ? currentSessionElapsed : 0))}</span>
                 </div>
                 <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.min(100, ((timeStats.month + currentSessionElapsed) / (160 * 3600 * 1000)) * 100)}%` }} />
                 </div>
               </div>
            </div>
          </motion.div>

        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Detailed Info Card */}
          <motion.div 
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
             className="lg:col-span-8 bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 md:p-8"
          >
             <div className="space-y-8">
                {/* Basic Information */}
                <div>
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <User className="w-5 h-5 text-blue-400" /> Basic Information <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 uppercase tracking-widest ml-2">Non-Editable</span>
                   </h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-black/30 border border-zinc-800 p-4 rounded-xl">
                        <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Hire Date</p>
                        <p className="text-sm text-zinc-200 font-semibold">{profile.hireDate}</p>
                     </div>
                     <div className="bg-black/30 border border-zinc-800 p-4 rounded-xl">
                        <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Worked For</p>
                        <p className="text-sm text-zinc-200 font-semibold">{(new Date().getFullYear() - new Date(profile.hireDate).getFullYear())} years</p>
                     </div>
                     <div className="bg-black/30 border border-zinc-800 p-4 rounded-xl">
                        <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Employee ID</p>
                        <p className="text-sm text-zinc-200 font-semibold">{profile.employeeId}</p>
                     </div>
                     <div className="bg-black/30 border border-zinc-800 p-4 rounded-xl">
                        <p className="text-xs text-zinc-500 font-bold uppercase mb-1">SSN</p>
                        <p className="text-sm text-zinc-200 font-semibold">{profile.ssn}</p>
                     </div>
                   </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent md:from-zinc-800 via-zinc-800 to-transparent" />

                {/* Personal Information */}
                <div>
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <MapPin className="w-5 h-5 text-emerald-400" /> Personal Information <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest ml-2 cursor-pointer hover:bg-blue-500/20">Edit</span>
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                     <div className="sm:col-span-1 border-b border-zinc-800 pb-2">
                        <p className="text-xs text-zinc-500 font-bold uppercase mb-2">Birth Date</p>
                        <p className="text-sm text-zinc-200">{profile.birthDate}</p>
                     </div>
                     <div className="sm:col-span-3 border-b border-zinc-800 pb-2">
                        <p className="text-xs text-zinc-500 font-bold uppercase mb-2">Address</p>
                        <div className="flex justify-between items-center text-sm text-zinc-200">
                           <span>{profile.address}</span>
                           <span>{profile.city}</span>
                        </div>
                     </div>
                   </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent md:from-zinc-800 via-zinc-800 to-transparent" />

                {/* Occupation Information */}
                <div>
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <Briefcase className="w-5 h-5 text-purple-400" /> Occupation Info <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 uppercase tracking-widest ml-2">Non-Editable</span>
                   </h3>
                   <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-3 bg-black/30 border border-zinc-800 px-5 py-3 rounded-xl border-l-2 border-l-blue-500">
                         <div className="p-2 bg-blue-500/10 rounded-lg"><Clock className="w-4 h-4 text-blue-400" /></div>
                         <span className="text-sm font-semibold text-zinc-200">{profile.jobType}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-black/30 border border-zinc-800 px-5 py-3 rounded-xl border-l-2 border-l-purple-500">
                         <div className="p-2 bg-purple-500/10 rounded-lg"><Building className="w-4 h-4 text-purple-400" /></div>
                         <span className="text-sm font-semibold text-zinc-200">{profile.department}</span>
                      </div>
                      <div className="flex items-center gap-3 bg-black/30 border border-zinc-800 px-5 py-3 rounded-xl border-l-2 border-l-emerald-500">
                         <div className="p-2 bg-emerald-500/10 rounded-lg"><MapPin className="w-4 h-4 text-emerald-400" /></div>
                         <span className="text-sm font-semibold text-zinc-200">{profile.city}</span>
                      </div>
                   </div>
                </div>

             </div>
          </motion.div>

          {/* Right Column Stack */}
          <div className="lg:col-span-4 space-y-6">
             
             {/* Calendar Mock Card */}
             <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
               className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6"
             >
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-white font-bold">{currentDate}</h3>
                   <div className="flex gap-2">
                     <button className="w-6 h-6 rounded bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-700">&lt;</button>
                     <button className="w-6 h-6 rounded bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-700">&gt;</button>
                   </div>
                </div>
                <div className="grid grid-cols-7 text-center gap-2 text-xs font-semibold mb-2 text-zinc-500">
                   <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                <div className="grid grid-cols-7 text-center gap-2 text-sm text-zinc-300">
                   {/* Dummy days just to fill the aesthetic */}
                   <div className="py-1 text-zinc-700">28</div><div className="py-1 text-zinc-700">29</div><div className="py-1 text-zinc-700">30</div>
                   <div className="py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">1</div>
                   <div className="py-1">2</div><div className="py-1">3</div><div className="py-1">4</div>
                   <div className="py-1">5</div><div className="py-1">6</div><div className="py-1">7</div>
                   <div className="py-1">8</div><div className="py-1">9</div><div className="py-1">10</div><div className="py-1">11</div>
                </div>
             </motion.div>

             {/* Online Admin Users */}
             <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
               className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6"
             >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" /> Active Teammates
                </h3>
                <div className="space-y-4">
                   {Object.values(agentProfiles).map((p) => {
                     if (p.name === agentKey) return null; // Skip self
                     const isOnline = onlineUsers.includes(p.name);
                     return (
                        <div key={p.name} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                             <div className="relative">
                               <img src={p.image} alt={p.displayName} className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 object-cover" />
                               <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-zinc-600'}`} />
                             </div>
                             <div>
                               <p className="text-sm font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">{p.displayName}</p>
                               <p className="text-xs text-zinc-500">{p.title}</p>
                             </div>
                          </div>
                        </div>
                     )
                   })}
                </div>
             </motion.div>

          </div>
        </div>

        {/* Bottom Row - Onboarding/Tasks */}
        <motion.div 
           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
           className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 md:p-8"
        >
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5 text-blue-400" /> Onboarding & Tasks
             </h3>
             <span className="text-sm font-semibold text-zinc-400 bg-black/40 px-3 py-1 rounded-full border border-zinc-800">
               {onboardingTasks.filter(t => t.done).length}/{onboardingTasks.length} Completed
             </span>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="text-xs text-zinc-500 uppercase tracking-wider hidden md:table-header-group">
                 <tr>
                   <th className="px-4 py-3 font-semibold w-12"></th>
                   <th className="px-4 py-3 font-semibold">Task</th>
                   <th className="px-4 py-3 font-semibold text-center">Assigned To</th>
                   <th className="px-4 py-3 font-semibold">Due Date</th>
                   <th className="px-4 py-3 font-semibold">Attachments</th>
                   <th className="px-4 py-3 font-semibold text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800/50 flex md:table-row-group flex-col gap-4">
                 {onboardingTasks.map((task, i) => {
                   const assignee = agentProfiles[task.assigneeId] || agentProfiles["MRK"];
                   return (
                     <tr key={i} className="hover:bg-zinc-800/20 transition-colors bg-black/20 md:bg-transparent rounded-xl md:rounded-none block md:table-row p-4 md:p-0">
                       <td className="px-4 py-4 block md:table-cell align-middle text-center md:text-left mb-2 md:mb-0">
                          {task.done ? 
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 inline-block" /> : 
                            <Circle className="w-5 h-5 text-zinc-600 inline-block" />
                          }
                       </td>
                       <td className={`px-4 py-4 block md:table-cell font-medium ${task.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                         {task.title}
                       </td>
                       <td className="px-4 py-4 block md:table-cell">
                          <div className="flex items-center gap-2 md:justify-center">
                            <img src={assignee.image} alt={assignee.name} className="w-6 h-6 rounded-full border border-zinc-700 bg-zinc-800" />
                            <span className="text-zinc-400">{assignee.displayName}</span>
                          </div>
                       </td>
                       <td className="px-4 py-4 block md:table-cell text-zinc-400">{task.dueDate}</td>
                       <td className="px-4 py-4 block md:table-cell text-blue-400 hover:text-blue-300 font-medium cursor-pointer">
                         {task.attachment !== "-" ? task.attachment : <span className="text-zinc-600">-</span>}
                       </td>
                       <td className="px-4 py-4 block md:table-cell text-right">
                          <button className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors mr-2">
                            View
                          </button>
                       </td>
                     </tr>
                   )
                 })}
               </tbody>
             </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-black font-bold uppercase tracking-wider text-sm rounded-lg transition-colors shadow-lg shadow-blue-500/20">
              Add New Task
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

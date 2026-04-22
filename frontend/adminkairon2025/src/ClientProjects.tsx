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
  ChevronRight
} from "lucide-react";
import { type User } from "@/lib/api";

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

export default function ClientProjects({ onViewProject, onLogout, adminAgent }: ClientProjectsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [rawUsers, setRawUsers] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");

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
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-medium tracking-wide animate-pulse">Loading dashboard...</p>
        </div>

        {/* Logout */}
        <div className="px-6 pb-12">
          <button 
            onClick={onLogout}
            className="flex items-center gap-4 px-4 py-[14px] w-full text-[#A3AED0] font-bold hover:bg-slate-50 hover:text-red-500 rounded-[14px] transition-all border-l-[3px] border-transparent"
          >
            <LogOut className="w-[20px] h-[20px]" />
            <span className="text-[14px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* CENTER MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-[100px] shrink-0 flex items-center justify-between px-10">
          <div className="relative w-[400px]">
             <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center">
               <Search className="w-[18px] h-[18px] text-[#A3AED0]" />
             </div>
            <input 
              type="text" 
              placeholder="Search something..." 
              className="w-full h-[52px] bg-white rounded-full pl-14 pr-4 text-[14px] text-slate-700 placeholder:text-[#A3AED0] focus:outline-none border border-transparent focus:border-blue-100 transition-all font-medium"
            />
          </div>
          <button className="h-[46px] bg-[#4361EE] text-white px-[24px] rounded-[12px] text-[14px] font-bold flex items-center gap-3 hover:bg-blue-700 transition-all shadow-[0_4px_15px_rgba(67,97,238,0.3)]">
            Add New <ChevronDown className="w-[16px] h-[16px]" strokeWidth={3} />
          </button>
        </header>

        {/* Main Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-10 pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Welcome Banner */}
          <div className="bg-[#4361EE] rounded-[24px] p-[40px] relative overflow-hidden text-white flex items-center shadow-[0_12px_30px_rgba(67,97,238,0.15)] min-h-[220px]">
            <div className="relative z-10 w-2/3">
              <h2 className="text-[28px] font-bold mb-[10px] tracking-tight">Good Morning Sara</h2>
              <p className="text-white/80 text-[14px] font-medium max-w-[340px] leading-[1.6] mb-[28px]">
                You have 75 new applications. It is a lot of work for today! So let's start.
              </p>
              <button className="h-[42px] bg-white text-[#4361EE] px-8 rounded-[12px] text-[13px] font-bold hover:bg-blue-50 transition-all shadow-sm">
                Review It
              </button>
            </div>
            
            {/* Background geometric decorative shapes */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none">
              <div className="absolute right-[5%] top-[-30%] w-[250px] h-[250px] bg-white/[0.08] rounded-full blur-2xl transform rotate-45"></div>
              <div className="absolute right-[20%] bottom-[-50%] w-[350px] h-[350px] bg-[#6D28D9]/40 rounded-[100px] rotate-[30deg] blur-3xl"></div>
              <div className="absolute left-[30%] top-[40%] w-[120px] h-[120px] bg-emerald-400/20 rounded-full blur-xl"></div>
            </div>

            <div className="absolute right-4 bottom-[-10px] h-[120%] flex items-end z-10 pointer-events-none drop-shadow-2xl">
              <img src="/hero-illustration.png" alt="Illustration" className="h-full object-contain object-bottom scale-[1.05] transform -translate-x-[15px]" />
            </div>
          </div>

          {/* Hiring Needs Cards */}
          <div className="mt-8 flex items-center justify-between mb-5">
            <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">You Need to hire</h3>
            <button className="h-[32px] px-5 bg-[#4361EE] text-white rounded-[10px] text-[12px] font-bold shadow-[0_4px_12px_rgba(67,97,238,0.2)] hover:bg-blue-700 transition-all">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-5">
            {hiringNeeds.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <div className={`w-[52px] h-[52px] rounded-[16px] flex flex-col items-center justify-center mb-4 ${item.color}`}>
                  {item.icon}
                </div>
                <h4 className="text-[13px] font-bold text-slate-800 leading-tight mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#A3AED0] font-bold">({item.cand} Candidates)</p>
              </div>
            ))}
          </div>

          {/* Recruitment Progress */}
          <div className="mt-10 flex items-center justify-between mb-5">
            <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">Recruitment Progress</h3>
            <button className="h-[32px] px-5 bg-[#4361EE] text-white rounded-[10px] text-[12px] font-bold shadow-[0_4px_12px_rgba(67,97,238,0.2)] hover:bg-blue-700 transition-all">
              View All
            </button>
          </div>

          <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-gray-100">
                   <th className="py-[18px] px-8 font-bold text-[12px] text-[#A3AED0] uppercase tracking-wider">Full Name</th>
                   <th className="py-[18px] px-6 font-bold text-[12px] text-[#A3AED0] uppercase tracking-wider">Designation</th>
                   <th className="py-[18px] px-6 font-bold text-[12px] text-[#A3AED0] uppercase tracking-wider">Status</th>
                   <th className="py-[18px] px-8 font-bold text-[12px] text-[#A3AED0] text-right">
                     <Settings className="w-4 h-4 ml-auto text-[#A3AED0]" />
                   </th>
                 </tr>
               </thead>
               <tbody>
                  {recruitmentProgress.map((row, idx) => (
                    <tr key={idx} className={`border-b border-gray-50 last:border-0 transition-colors ${row.active ? 'bg-[#4361EE] shadow-lg relative z-10' : 'hover:bg-slate-50'}`}>
                      <td className={`py-[16px] px-8 text-[14px] font-bold ${row.active ? 'text-white' : 'text-slate-800'}`}>
                        {row.name}
                      </td>
                      <td className={`py-[16px] px-6 text-[13px] font-medium ${row.active ? 'text-white/80' : 'text-[#A3AED0]'}`}>
                        {row.role}
                      </td>
                      <td className={`py-[16px] px-6 text-[13px] font-bold flex items-center gap-2.5 ${row.active ? 'text-white' : 'text-slate-800'}`}>
                        <span className={`w-2 h-2 rounded-full ${row.active ? 'bg-white' : row.stColor}`}></span>
                        {row.status}
                      </td>
                      <td className={`py-[16px] px-8 text-right`}>
                        <button className={`p-1 ${row.active ? 'text-white/80 hover:text-white' : 'text-[#A3AED0] hover:text-slate-600'}`}>
                          <MoreVertical className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>

        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-[340px] bg-white h-full shrink-0 flex flex-col pt-10 pb-6 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-20 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
         {/* Profile Toggles Area */}
         <div className="flex flex-col mb-10 px-8">
            <div className="flex items-center justify-between">
              <div className="flex gap-[18px]">
                <button className="text-[#A3AED0] hover:text-[#4361EE] transition-colors relative">
                  <Settings className="w-[20px] h-[20px]" />
                </button>
                <div className="relative">
                  <button className="text-[#A3AED0] hover:text-[#4361EE] transition-colors relative mt-1">
                    <Bell className="w-[20px] h-[20px]" />
                  </button>
                  <span className="absolute top-0 right-0 w-[8px] h-[8px] bg-[#E63946] rounded-full border-[1.5px] border-white"></span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div className="flex flex-col justify-center">
                  <span className="text-[14px] font-bold text-slate-800 leading-tight">Sara Abraham</span>
                  <a href="#" className="text-[11px] font-medium text-[#A3AED0] hover:text-[#4361EE]">View profile</a>
                </div>
                <div className="w-[42px] h-[42px] rounded-full bg-slate-200 overflow-hidden shadow-sm shrink-0">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
         </div>

         {/* Schedule Calendar */}
         <div className="mb-10 px-8">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-[16px] font-bold text-slate-800 flex items-center">
               Schedule Calendar 
               <div className="flex ml-2 gap-1 text-[#A3AED0]">
                  <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                  <ChevronRight className="w-4 h-4 cursor-pointer hover:text-blue-500" />
               </div>
             </h3>
             <button className="h-[30px] px-3 bg-[#4361EE]/10 text-[#4361EE] rounded-[8px] text-[12px] font-bold flex items-center gap-2">
               <CalendarIcon className="w-[14px] h-[14px]" /> May
             </button>
           </div>
           
           <div className="flex justify-between items-center gap-2">
              {[
                { day: "Mon", date: "22", active: false, d1: 'bg-emerald-400', d2: 'bg-emerald-400' },
                { day: "Tue", date: "23", active: false, d1: 'bg-emerald-400', d2: 'bg-amber-400', d3: 'bg-emerald-400' },
                { day: "Wed", date: "24", active: true },
                { day: "Thu", date: "25", active: false, d1: 'bg-emerald-400', d2: 'bg-emerald-400', d3: 'bg-amber-400' },
                { day: "Fri", date: "26", active: false, d1: 'bg-emerald-400', d2: 'bg-amber-400' },
              ].map((d, i) => (
                <div key={i} className={`flex flex-col items-center justify-center w-[54px] h-[78px] rounded-[18px] transition-all cursor-pointer ${d.active ? 'bg-[#4361EE] text-white shadow-[0_8px_20px_rgba(67,97,238,0.3)]' : 'hover:bg-[#F4F7FE] text-slate-800'}`}>
                  <span className={`text-[12px] font-medium mb-1 ${d.active ? 'text-white/80' : 'text-[#A3AED0]'}`}>{d.day}</span>
                  <span className={`text-[18px] font-bold mb-[6px] ${d.active ? 'text-white' : 'text-slate-800'}`}>{d.date}</span>
                  <div className="flex gap-1 h-[4px]">
                    {d.active ? (
                      <span className="w-1 h-1 rounded-full bg-white"></span>
                      ) : (
                      <>
                        {d.d1 && <span className={`w-1 h-1 rounded-full ${d.d1}`}></span>}
                        {d.d2 && <span className={`w-1 h-1 rounded-full ${d.d2}`}></span>}
                        {d.d3 && <span className={`w-1 h-1 rounded-full ${d.d3}`}></span>}
                      </>
                    )}
                  </div>
                </div>
              ))}
           </div>
         </div>

         {/* New Applicants */}
         <div className="mb-8 w-full px-8">
           <div className="flex items-center justify-between mb-5">
             <h3 className="text-[16px] font-bold text-slate-800">New Applicants</h3>
             <button className="h-[28px] px-4 bg-[#4361EE]/5 text-[#4361EE] rounded-full text-[11px] font-bold hover:bg-[#4361EE]/10 transition-colors">
               View All
             </button>
           </div>
           
           <div className="flex flex-col gap-[18px]">
             {newApplicants.map((app, idx) => (
               <div key={idx} className="flex items-center justify-between group">
                 <div className="flex items-center gap-[14px]">
                   {app.img ? (
                     <img src={app.img} alt={app.name} className="w-[42px] h-[42px] rounded-full object-cover shrink-0" />
                   ) : (
                     <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-white font-bold text-[18px] shrink-0 ${app.initialColor}`}>
                       {app.initial}
                     </div>
                   )}
                   <div>
                     <h4 className="text-[14px] font-bold text-slate-800 leading-tight mb-1">{app.name}</h4>
                     <p className="text-[11px] font-medium text-[#A3AED0]">{app.role}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 opactiy-100 shrink-0">
                   <button className="w-[32px] h-[32px] rounded-full bg-[#4361EE]/5 text-[#4361EE] flex items-center justify-center hover:bg-[#4361EE]/10 transition-colors">
                     <Phone className="w-3.5 h-3.5 fill-[#4361EE]/20" />
                   </button>
                   <button className="w-[32px] h-[32px] rounded-full bg-[#4361EE]/5 text-[#4361EE] flex items-center justify-center hover:bg-[#4361EE]/10 transition-colors">
                     <MessageSquare className="w-3.5 h-3.5 fill-[#4361EE]/20" />
                   </button>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Ready For Training */}
         <div className="px-8">
           <div className="flex items-center justify-between mb-5">
             <h3 className="text-[16px] font-bold text-slate-800">Ready For Training</h3>
             <button className="h-[28px] px-4 bg-[#4361EE]/5 text-[#4361EE] rounded-full text-[11px] font-bold hover:bg-[#4361EE]/10 transition-colors">
               View All
             </button>
           </div>

           <div className="grid grid-cols-3 gap-3">
             {readyForTraining.map((tr, idx) => (
               <div key={idx} className="flex flex-col items-center p-3 rounded-[16px] border border-gray-100 hover:border-transparent hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:bg-white transition-all group">
                 <img src={tr.img} alt={tr.name} className="w-[42px] h-[42px] rounded-full object-cover mb-2" />
                 <h4 className="text-[11px] font-bold text-slate-800 leading-tight mb-1">{tr.name.split(' ')[0]}</h4>
                 <p className="text-[8px] font-bold text-[#A3AED0] mb-3 leading-tight text-center px-1 truncate w-full">{tr.role}</p>
                 <button className="w-full py-1.5 bg-[#4361EE] text-white rounded-[6px] text-[10px] font-bold opacity-90 group-hover:opacity-100 group-hover:shadow-[0_4px_10px_rgba(67,97,238,0.25)] transition-all">
                   Start
                 </button>
               </div>
             ))}
           </div>
         </div>

      </aside>
    </div>
  );
}

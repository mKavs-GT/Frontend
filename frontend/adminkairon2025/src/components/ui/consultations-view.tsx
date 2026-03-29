import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageSquare, Phone, Mail, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchUsers, type User } from "@/lib/api";

type Consultation = NonNullable<User['consultations']>[number] & { userEmail: string; userName: string };

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 }
};

export function ConsultationsView() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await fetchUsers();
        if (Array.isArray(users)) {
          let allConsultations: Consultation[] = [];
          users.forEach(user => {
            if (user.consultations && user.consultations.length > 0) {
              allConsultations = [
                ...allConsultations,
                ...user.consultations.map(c => ({
                  ...c,
                  userEmail: user.email,
                  userName: user.displayName || user.email
                }))
              ];
            }
          });
          
          // Sort by timestamp descending
          allConsultations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setConsultations(allConsultations);
        }
      } catch (err) {
        console.error("Failed to load consultations", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = consultations.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(query) ||
      c.userEmail?.toLowerCase().includes(query) ||
      c.projectInfo?.toLowerCase().includes(query) ||
      c.plan?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-transparent text-zinc-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
          <p className="text-zinc-400 font-medium tracking-wide animate-pulse">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-8 p-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.header 
        className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-zinc-800/50 gap-6"
        variants={item}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20 shadow-lg shadow-green-500/5">
            <MessageSquare className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Consultation Requests
            </h1>
            <p className="text-zinc-400 mt-1 font-medium italic">
              View and manage all incoming booking inquiries.
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-zinc-500 group-focus-within:text-green-400 transition-all duration-300 group-focus-within:scale-110" />
            <Input
              type="search"
              placeholder="Search by name, email, or project..."
              className="pl-11 pr-12 h-12 bg-zinc-900/40 border-zinc-800/50 focus:border-green-500/30 backdrop-blur-2xl transition-all duration-500 rounded-2xl text-zinc-200 placeholder:text-zinc-600 focus:ring-0 shadow-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.header>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence>
          {filtered.map((c, index) => (
            <motion.div
              key={`${c.userEmail}-${index}`}
              variants={item}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-zinc-900/80 to-black border-zinc-800/60 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-green-900/20 hover:border-green-500/30 h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="relative z-10 border-b border-zinc-800/30">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-semibold tracking-tight text-white group-hover:text-green-200 transition-colors">
                        {c.name || "Unknown"}
                      </CardTitle>
                      <CardDescription className="text-zinc-400 flex items-center gap-1 font-medium">
                        <CalendarIcon className="w-3 h-3 text-green-500/70" />
                        {new Date(c.timestamp).toLocaleString()}
                      </CardDescription>
                    </div>
                    {c.plan && (
                       <span className="px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm bg-green-500/10 text-green-400 border-green-500/30">
                         {c.plan}
                       </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-1 relative z-10 pt-4 text-sm text-zinc-300 leading-relaxed">
                  <div className="space-y-2 mb-4 p-3 bg-zinc-800/20 rounded-lg border border-zinc-700/30">
                    <div className="flex items-center gap-2">
                       <Mail className="w-4 h-4 text-zinc-500" />
                       <span className="truncate">{c.userEmail}</span>
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-2">
                         <Phone className="w-4 h-4 text-zinc-500" />
                         <span className="truncate">{c.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 block mb-2">Project Information</span>
                    <p className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800 italic group-hover:bg-zinc-800/40 transition-colors">
                      "{c.projectInfo || "No extra information provided."}"
                    </p>
                  </div>
                  
                  {c.connectPreference && (
                     <div className="flex justify-between items-center text-xs mt-4 pt-4 border-t border-zinc-800/50">
                        <span className="font-bold uppercase tracking-widest text-zinc-500">Preference</span>
                        <span className="px-2 py-1 bg-zinc-800 rounded text-zinc-300 font-medium">{c.connectPreference}</span>
                     </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filtered.length === 0 && !loading && (
             <div className="col-span-full py-20 text-center text-zinc-500">
               <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
               <p className="text-xl font-bold">No consultation requests found</p>
               <p className="text-sm">They will appear here once users submit the form.</p>
             </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

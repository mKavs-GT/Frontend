import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageSquare, Phone, Mail, Calendar as CalendarIcon, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setIsRefreshing(true);
    setError(null);
    
    console.log(`[Consultations] Fetching data... (Silent: ${isSilent})`);
    
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
        console.log(`[Consultations] Loaded ${allConsultations.length} requests.`);
      } else {
        console.warn("[Consultations] Received non-array users response:", users);
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("[Consultations] Failed to load consultations:", err);
      setError("Failed to connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refetch on window focus (important for mobile PWA resume from notification)
  useEffect(() => {
    const onFocus = () => {
      console.log("[Consultations] Window focused, triggering silent refresh");
      loadData(true);
    };
    
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadData]);

  // Refetch when URL parameters change (deep linking support)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestParam = urlParams.get('request');
    const viewParam = urlParams.get('view');
    
    if (viewParam === 'consultations' && requestParam) {
      console.log(`[Consultations] URL detected specific request: ${requestParam}. Refetching to ensure fresh data.`);
      loadData(true);
    }
  }, [window.location.search, loadData]);

  const filtered = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestEmail = urlParams.get('request');
    const query = searchQuery.toLowerCase();

    return consultations.filter((c) => {
      // If there is a 'request' param in the URL, prioritize showing that specific email
      // but only if the user hasn't started searching manually
      if (!searchQuery && requestEmail) {
        return c.userEmail?.toLowerCase() === requestEmail.toLowerCase();
      }

      return (
        c.name?.toLowerCase().includes(query) ||
        c.userEmail?.toLowerCase().includes(query) ||
        c.projectInfo?.toLowerCase().includes(query) ||
        c.plan?.toLowerCase().includes(query)
      );
    });
  }, [consultations, searchQuery, window.location.search]);

  // Special handling: if we have a request param but the item isn't found in a stale list,
  // we want to know so we can show a specific message or force a fetch.
  const isTargetRequestMissing = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestEmail = urlParams.get('request');
    if (!requestEmail) return false;
    
    return !consultations.some(c => c.userEmail?.toLowerCase() === requestEmail.toLowerCase());
  }, [consultations, window.location.search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-transparent text-zinc-400">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-t-2 border-b-2 border-green-500 rounded-full animate-spin shadow-[0_0_20px_rgba(34,197,94,0.3)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-500/50" />
            </div>
          </div>
          <p className="text-zinc-400 font-medium tracking-wide animate-pulse">Syncing consultation requests...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-8 p-4 md:p-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.header 
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-8 border-b border-zinc-800/50 gap-6"
        variants={item}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20 shadow-lg shadow-green-500/5">
            <MessageSquare className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Consultation Requests
              {isRefreshing && <RefreshCw className="w-5 h-5 text-green-500/50 animate-spin" />}
            </h1>
            <p className="text-zinc-400 mt-1 font-medium italic text-sm md:text-base">
              View and manage all incoming booking inquiries.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full md:w-80 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-zinc-500 group-focus-within:text-green-400 transition-all duration-300 group-focus-within:scale-110" />
              <Input
                type="search"
                placeholder="Search requests..."
                className="pl-11 pr-4 h-11 bg-zinc-900/40 border-zinc-800/50 focus:border-green-500/30 backdrop-blur-2xl transition-all duration-500 rounded-2xl text-zinc-200 placeholder:text-zinc-600 focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => loadData()}
            disabled={isRefreshing}
            className="rounded-2xl h-11 w-11 bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-800 hover:text-green-400 transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </motion.header>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
          <Button variant="ghost" size="sm" onClick={() => loadData()} className="ml-auto text-red-400 hover:bg-red-500/10">Retry</Button>
        </motion.div>
      )}

      {/* Special notification if target request is expected but missing */}
      {isTargetRequestMissing && !loading && !error && (
         <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex flex-col md:flex-row items-center gap-3"
        >
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <p className="text-sm font-medium">Looking for specific request from <b>{new URLSearchParams(window.location.search).get('request')}</b>...</p>
          </div>
          <p className="text-xs text-amber-500/70 md:ml-auto">If it doesn't appear shortly, the user might have used a different email.</p>
        </motion.div>
      )}

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence mode="popLayout">
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
                
                <CardHeader className="relative z-10 border-b border-zinc-800/30 p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 min-w-0">
                      <CardTitle className="text-xl font-semibold tracking-tight text-white group-hover:text-green-200 transition-colors truncate">
                        {c.name || "Unknown"}
                      </CardTitle>
                      <CardDescription className="text-zinc-400 flex items-center gap-1.5 font-medium text-xs">
                        <CalendarIcon className="w-3.5 h-3.5 text-green-500/70" />
                        {new Date(c.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </CardDescription>
                    </div>
                    {c.plan && (
                       <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm bg-green-500/10 text-green-400 border-green-500/30">
                         {c.plan}
                       </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-5 flex-1 relative z-10 p-5 text-sm text-zinc-300 leading-relaxed">
                  <div className="space-y-2.5 p-3.5 bg-zinc-800/20 rounded-xl border border-zinc-700/30">
                    <div className="flex items-center gap-3 text-zinc-400 hover:text-zinc-200 transition-colors cursor-default">
                       <Mail className="w-4 h-4 text-green-500/50" />
                       <span className="truncate font-medium">{c.userEmail}</span>
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-3 text-zinc-400 hover:text-zinc-200 transition-colors cursor-default">
                         <Phone className="w-4 h-4 text-green-500/50" />
                         <span className="truncate font-medium">{c.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block mb-3">Project Scope</span>
                    <p className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800/80 italic group-hover:bg-zinc-800/40 transition-all duration-300 text-zinc-400 group-hover:text-zinc-200 shadow-inner">
                      "{c.projectInfo || "No additional project details provided."}"
                    </p>
                  </div>
                  
                  {c.connectPreference && (
                     <div className="flex justify-between items-center text-[10px] mt-4 pt-4 border-t border-zinc-800/50">
                        <span className="font-black uppercase tracking-[0.2em] text-zinc-500">Preference</span>
                        <span className="px-3 py-1 bg-zinc-800/80 rounded-lg text-green-400 font-bold border border-zinc-700/50">{c.connectPreference}</span>
                     </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filtered.length === 0 && !loading && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="col-span-full py-24 text-center"
             >
               <div className="relative inline-block mb-6">
                 <MessageSquare className="w-20 h-20 mx-auto text-zinc-800 opacity-20" />
                 {isRefreshing && <RefreshCw className="absolute top-0 right-0 w-8 h-8 text-green-500/30 animate-spin" />}
               </div>
               <h3 className="text-2xl font-bold text-zinc-400 mb-2">No results found</h3>
               <p className="text-zinc-600 max-w-md mx-auto">
                 {searchQuery 
                    ? `We couldn't find any requests matching "${searchQuery}".` 
                    : "New consultation requests will appear here as soon as they are submitted."}
               </p>
               <Button 
                variant="outline" 
                onClick={() => {setSearchQuery(""); loadData();}} 
                className="mt-8 rounded-xl border-zinc-800 hover:bg-zinc-900"
               >
                 Clear Search & Refresh
               </Button>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

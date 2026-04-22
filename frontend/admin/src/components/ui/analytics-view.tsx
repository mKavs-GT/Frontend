"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart3, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchUsers, type User } from "@/lib/api";

interface AnalyticsViewProps {
  onViewProject: (user: User) => void;
}

export function AnalyticsView({ onViewProject }: AnalyticsViewProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [totalProjects, setTotalProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [inProgressProjects, setInProgressProjects] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUsers();
        if (!Array.isArray(data)) {
            console.error("Fetched data is not an array:", data);
            setUsers([]);
            return;
        }
        // Filter users who have active projects (using adminData)
        const activeUsers = data.filter(u => u.adminData?.activeProjects);
        setUsers(activeUsers);

        // Calculate stats
        const total = activeUsers.length;
        const completed = activeUsers.filter(u => u.adminData?.projectStatus === 'Completed' || u.adminData?.projectProgress === 100).length;
        const inProgress = total - completed;

        setTotalProjects(total);
        setCompletedProjects(completed);
        setInProgressProjects(inProgress);
      } catch (error) {
        console.error("Failed to load analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-transparent text-zinc-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <p className="text-zinc-400 font-medium tracking-wide animate-pulse">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-transparent p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Project Analytics
              </h1>
              <p className="text-zinc-400 mt-1 font-medium">
                Comprehensive overview of current project performance and engagement.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={item}>
            <Card className="relative overflow-hidden bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BarChart3 className="w-12 h-12 text-blue-500" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white tracking-tighter">{totalProjects}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/20 text-[10px] py-0">LIVE</Badge>
                  <p className="text-xs text-zinc-500 font-medium">Active client collaborations</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="relative overflow-hidden bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-emerald-400 tracking-tighter">{completedProjects}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-emerald-500/5 text-emerald-400 border-emerald-500/20 text-[10px] py-0">SUCCESS</Badge>
                  <p className="text-xs text-zinc-500 font-medium">100% progress completions</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="relative overflow-hidden bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-12 h-12 text-amber-500" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-500">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-amber-400 tracking-tighter">{inProgressProjects}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-amber-500/5 text-amber-400 border-amber-500/20 text-[10px] py-0">ACTIVE</Badge>
                  <p className="text-xs text-zinc-500 font-medium">Ongoing development</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Projects List */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between"
          >
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
              All Projects
            </h2>
            <div className="h-px flex-1 mx-6 bg-gradient-to-r from-zinc-800/50 to-transparent"></div>
          </motion.div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {users.map((user) => {
              const progress = user.adminData?.projectProgress || 0;
              const status = user.adminData?.projectStatus || (progress === 100 ? "Completed" : "Active");
              
              return (
                <motion.div 
                  key={user._id} 
                  variants={item}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="relative overflow-hidden bg-gradient-to-br from-zinc-900/60 to-black/60 border-zinc-800/50 backdrop-blur-xl shadow-2xl transition-all duration-300 group-hover:border-blue-500/30 group-hover:shadow-blue-500/10 h-full flex flex-col">
                    {/* Interior Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardHeader className="relative z-10 border-b border-zinc-800/30 pb-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                          <CardTitle className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                            {user.adminData?.activeProjects || "Untitled Project"}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                             <Clock className="w-3.5 h-3.5 text-blue-500/70" />
                             <span className="text-xs font-medium tabular-nums uppercase tracking-wide">
                               {user.adminData?.projectStartDate || "N/A"} — {user.adminData?.projectEndDate || "N/A"}
                             </span>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "font-bold px-3 py-1 backdrop-blur-md shadow-sm transition-all duration-300",
                            status === 'Active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            status === 'Completed' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                            status === 'On Hold' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                            status === 'Progress' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                          )}
                        >
                          <span className={cn(
                            "mr-2 h-1.5 w-1.5 rounded-full",
                            status === 'Active' ? "bg-emerald-400 animate-pulse" :
                            status === 'Completed' ? "bg-blue-400" :
                            status === 'On Hold' ? "bg-red-400" :
                            status === 'Progress' ? "bg-amber-400 animate-pulse" :
                            "bg-zinc-400"
                          )}></span>
                          {status === 'Progress' ? 'In Progress' : status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 pt-6 space-y-6 flex-1">
                      {/* User Info */}
                      <div className="flex items-center gap-4 bg-zinc-800/30 p-3 rounded-2xl border border-zinc-800/30 group-hover:bg-zinc-800/50 transition-colors">
                        <Avatar className="w-12 h-12 border-2 border-zinc-800 shadow-xl group-hover:border-blue-500/20 transition-all">
                          <AvatarImage src={user.image} className="object-cover" />
                          <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">
                            {user.displayName?.substring(0, 2).toUpperCase() || "CN"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-white truncate">{user.displayName}</p>
                          <p className="text-xs text-zinc-500 font-medium truncate group-hover:text-zinc-400 transition-colors">{user.email}</p>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Live Progress</span>
                            <div className="text-2xl font-black italic tracking-tighter text-white">
                              {progress}%
                            </div>
                          </div>
                          <div className="flex -space-x-1.5">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= (progress / 33) ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]' : 'bg-zinc-800'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="h-2.5 w-full bg-zinc-800/50 rounded-full overflow-hidden shadow-inner border border-zinc-800/30">
                          <motion.div 
                            className={cn(
                              "h-full rounded-full relative",
                              progress === 100 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 
                              progress >= 50 ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                              'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "circOut", delay: 0.3 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full animate-shimmer" />
                          </motion.div>
                        </div>
                      </div>

                      {/* View Button */}
                      <div className="pt-2">
                        <Button 
                          onClick={() => onViewProject(user)}
                          className="w-full bg-white/5 hover:bg-blue-600 text-white border border-white/5 hover:border-blue-500 transition-all duration-300 h-11 font-bold tracking-wide shadow-lg group-hover:shadow-blue-500/10 active:scale-[0.98]"
                        >
                          View Development Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

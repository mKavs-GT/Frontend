import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserCircle, Mail, Phone, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchUsers, type User } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UsersViewProps {
  onViewProject: (user: User) => void;
}

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

export function UsersView({ onViewProject }: UsersViewProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        if (Array.isArray(data)) {
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.displayName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-transparent text-zinc-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
          <p className="text-zinc-400 font-medium tracking-wide animate-pulse">Loading users...</p>
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
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 shadow-lg shadow-purple-500/5">
            <UserCircle className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              All Users
            </h1>
            <p className="text-zinc-400 mt-1 font-medium italic">
              Manage all registered users and their assignments.
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-zinc-500 group-focus-within:text-purple-400 transition-all duration-300 group-focus-within:scale-110" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              className="pl-11 pr-12 h-12 bg-zinc-900/40 border-zinc-800/50 focus:border-purple-500/30 backdrop-blur-2xl transition-all duration-500 rounded-2xl text-zinc-200 placeholder:text-zinc-600 focus:ring-0 shadow-2xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.header>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              variants={item}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-zinc-900/80 to-black border-zinc-800/60 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 hover:border-purple-500/30 h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12 border-2 border-zinc-800">
                        <AvatarImage src={user.image} className="object-cover" />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">
                          {user.displayName?.substring(0, 2).toUpperCase() || "CN"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-semibold tracking-tight text-white group-hover:text-purple-200 transition-colors">
                          {user.displayName || "Unknown User"}
                        </CardTitle>
                        <div className="text-xs text-zinc-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-1 relative z-10 pt-4 border-t border-zinc-800/30">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {user.phone && (
                      <div className="flex items-center text-zinc-400">
                        <Phone className="h-4 w-4 mr-2 text-zinc-500" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                    )}
                    {user.country && (
                      <div className="flex items-center text-zinc-400">
                        <Globe className="h-4 w-4 mr-2 text-zinc-500" />
                        <span className="truncate">{user.country}</span>
                      </div>
                    )}
                  </div>
                  
                  {user.adminData?.activeProjects ? (
                     <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                       <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">Active Project</span>
                       <span className="text-sm text-zinc-200 font-medium">{user.adminData.activeProjects}</span>
                     </div>
                  ) : (
                    <div className="p-3 bg-zinc-800/30 border border-zinc-800/50 rounded-lg">
                       <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Status</span>
                       <span className="text-sm text-zinc-400 font-medium italic">No active projects</span>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="relative z-10 pb-6 px-6">
                  <Button
                    className="w-full bg-zinc-800/50 hover:bg-purple-600 text-white hover:text-white border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
                    onClick={() => onViewProject(user)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Monitor, Search, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/ui/modern-side-bar";
import { Input } from "@/components/ui/input";
import { AnalyticsView } from "@/components/ui/analytics-view";
import { ProfileView } from "@/components/ui/ProfileView";
import { fetchUsers, type User } from "@/lib/api";
import ProjectDataDemo from "@/ProjectDataDemo";

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
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
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
        Loading...
      </div>
    );
  }

  const renderContent = () => {
    if (currentView === "analytics") {
      return <AnalyticsView onViewProject={onViewProject} />;
    }
    
    if (currentView === "settings") {
      return <ProjectDataDemo />;
    }
    
    if (currentView === "profile") {
      return <ProfileView adminAgent={adminAgent} />;
    }
    
    return (
      <motion.div
          className="max-w-7xl mx-auto space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.header 
            className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-zinc-800/50 gap-6"
            variants={item}
          >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                  <Briefcase className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                    Client Projects
                  </h1>
                  <p className="text-zinc-400 mt-1 font-medium italic">
                    Manage and monitor your active client collaborations.
                  </p>
                </div>
              </div>

               <div className="relative w-full md:w-96 group">
                  {/* Subtle Background Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                  
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-4 w-4 text-zinc-500 group-focus-within:text-blue-400 transition-all duration-300 group-focus-within:scale-110" />
                    <Input
                      type="search"
                      placeholder="Search projects, clients..."
                      className="pl-11 pr-12 h-12 bg-zinc-900/40 border-zinc-800/50 focus:border-blue-500/30 backdrop-blur-2xl transition-all duration-500 rounded-2xl text-zinc-200 placeholder:text-zinc-600 focus:ring-0 shadow-2xl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {/* Keyboard Shortcut Hint */}
                    <div className="absolute right-3 px-1.5 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-[10px] font-bold text-zinc-500 group-hover:text-zinc-400 group-focus-within:border-blue-500/30 transition-all pointer-events-none">
                      /
                    </div>
                  </div>
              </div>
          </motion.header>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence>
              {filteredClients.map((client, index) => (
                <motion.div
                  key={`${client.name}-${index}`}
                  variants={item}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card
                    className="relative overflow-hidden bg-gradient-to-br from-zinc-900/80 to-black border-zinc-800/60 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 hover:border-blue-500/30 h-full flex flex-col"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardHeader className="relative z-10">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-semibold tracking-tight text-white group-hover:text-blue-100 transition-colors">
                            {client.name}
                          </CardTitle>
                          <CardDescription className="text-zinc-400 font-medium">{client.user.displayName}</CardDescription>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm ${
                          client.user.adminData?.projectStatus === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-900/20' :
                          client.user.adminData?.projectStatus === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-900/20' :
                          client.user.adminData?.projectStatus === 'On Hold' ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-900/20' :
                          client.user.adminData?.projectStatus === 'Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-900/20' :
                          (client.user.adminData?.projectProgress === 100) ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-900/20' :
                          'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                        }`}>
                          {client.user.adminData?.projectStatus === 'Progress' ? 'In Progress' : (client.user.adminData?.projectStatus || (client.user.adminData?.projectProgress === 100 ? "Completed" : "Active"))}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 relative z-10">
                        <div className="flex items-center text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                            <Monitor className="h-4 w-4 mr-2.5 text-blue-500/70" />
                            <span className="truncate">{client.user.email}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="relative z-10 pt-2 pb-6 px-6">
                      <Button
                          className="w-full bg-zinc-800/50 hover:bg-blue-600 text-white hover:text-white border border-zinc-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                        onClick={() => onViewProject(client.user)}
                      >
                        View Project
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredClients.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              <Search className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm">Try adjusting your search query</p>
            </motion.div>
          )}
        </motion.div>
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar 
        activeItem={currentView} 
        onNavigate={(id) => setCurrentView(id)}
        onLogout={onLogout}
        adminAgent={adminAgent}
      />
      
      <main className="flex-1 h-full overflow-y-auto bg-background p-8">
        {renderContent()}
      </main>
    </div>
  );
}

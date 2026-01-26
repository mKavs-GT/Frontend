import { useState, useEffect } from 'react'
import { type User } from "@/lib/api"
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import Demo from './Demo'
import ClientProjects from './ClientProjects'
import LoginDemo from './LoginDemo'
import { AnimatedBackground } from './components/ui/animated-background'
import { LoadingPage } from './components/ui/loading-page'

// API endpoint for admin authentication
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Admin agent type
interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [adminAgent, setAdminAgent] = useState<AdminAgent | null>(null)

  // Check for existing session on app load
  useEffect(() => {
    const verifySession = async () => {
      const token = sessionStorage.getItem('adminToken');
      const storedAgent = sessionStorage.getItem('adminAgent');

      if (!token || !storedAgent) {
        // Just enough time to see the beautiful loading state
        setTimeout(() => setIsLoading(false), 2000);
        return;
      }

      try {
        // Verify the token with the backend
        const response = await fetch(`${API_BASE}/api/admin/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAdminAgent(data.agent || JSON.parse(storedAgent));
          setIsAuthenticated(true);
        } else {
          // Token is invalid/expired, clear storage
          sessionStorage.removeItem('adminToken');
          sessionStorage.removeItem('adminAgent');
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        // Clear storage on error
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminAgent');
      } finally {
        setTimeout(() => setIsLoading(false), 2000);
      }
    };

    verifySession();
  }, []);

  const handleViewProject = (user: User) => {
    setSelectedUser(user)
    setShowDashboard(true)
  }

  const handleLogin = (token: string, agent: AdminAgent) => {
    // Add a slight delay for transition effect
    setAdminAgent(agent);
    setIsAuthenticated(true);
  }

  const handleLogout = async () => {
    const token = sessionStorage.getItem('adminToken');
    
    try {
      if (token) {
        await fetch(`${API_BASE}/api/admin/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear session regardless of API response
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminAgent');
      setIsAuthenticated(false);
      setAdminAgent(null);
      setShowDashboard(false);
      setSelectedUser(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] relative">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100]"
          >
            <LoadingPage />
          </motion.div>
        ) : !isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-screen"
          >
            <LoginDemo onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard-container"
            initial={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen bg-transparent overflow-hidden relative"
          >
            <AnimatedBackground />
            <div className="relative z-10 w-full h-full">
              <AnimatePresence mode="wait">
                {showDashboard && selectedUser ? (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <Demo 
                      onBack={() => setShowDashboard(false)} 
                      user={selectedUser}
                      onUserUpdated={setSelectedUser}
                      onLogout={handleLogout}
                      adminAgent={adminAgent}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="client-projects"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <ClientProjects 
                      onViewProject={handleViewProject} 
                      onLogout={handleLogout}
                      adminAgent={adminAgent}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App



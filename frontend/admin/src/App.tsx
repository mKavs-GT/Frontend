import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import LoginDemo from './LoginDemo'

interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

function BlankDashboard({ agent, onLogout }: { agent: AdminAgent, onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Blank Scratchpad</h1>
      <p className="text-zinc-500 mb-8">Logged in as: {agent?.name} ({agent?.role})</p>
      <button 
        onClick={onLogout}
        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all uppercase text-xs tracking-widest"
      >
        Logout
      </button>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminAgent, setAdminAgent] = useState<AdminAgent | null>(null)

  useEffect(() => {
    const storedAgent = sessionStorage.getItem('adminAgent');
    if (storedAgent) {
      setAdminAgent(JSON.parse(storedAgent));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token: string, agent: AdminAgent) => {
    sessionStorage.setItem('adminToken', token);
    sessionStorage.setItem('adminAgent', JSON.stringify(agent));
    setAdminAgent(agent);
    setIsAuthenticated(true);
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminAgent');
    setIsAuthenticated(false);
    setAdminAgent(null);
  }

  return (
    <div className="min-h-screen bg-black relative">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-screen"
          >
            <LoginDemo onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <BlankDashboard agent={adminAgent!} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

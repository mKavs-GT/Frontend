import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { type User } from "@/lib/api"
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import Demo from './Demo'
import ClientProjects from './ClientProjects'
import LoginDemo from './LoginDemo'
import { AnimatedBackground } from './components/ui/animated-background'
import { LoadingPage } from './components/ui/loading-page'
import PWAControls from './components/PWAControls'
import AuthGate from './components/AuthGate'
import { useState } from 'react'

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      key="dashboard-container"
      initial={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-transparent overflow-hidden relative"
    >
      <AnimatedBackground />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}

function DashboardRoutes() {
  const { user, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDashboard, setShowDashboard] = useState(false)

  const handleViewProject = (user: User) => {
    setSelectedUser(user)
    setShowDashboard(true)
  }

  return (
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
            onLogout={logout}
            adminAgent={user}
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
            onLogout={logout}
            adminAgent={user}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#020617] relative">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={
              <AnimatePresence mode="wait">
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-full h-screen"
                >
                  <LoginDemo />
                </motion.div>
              </AnimatePresence>
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <AuthGate>
                <AdminLayout>
                  <DashboardRoutes />
                </AdminLayout>
              </AuthGate>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <PWAControls />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App



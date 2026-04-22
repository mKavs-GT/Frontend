import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import './index.css'
import LoginDemo from './LoginDemo'
import AuthGate from './components/AuthGate'

function BlankDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Blank Scratchpad</h1>
      <p className="text-zinc-500 mb-8">Logged in as: {user?.name} ({user?.role})</p>
      <button 
        onClick={() => logout()}
        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all uppercase text-xs tracking-widest"
      >
        Logout
      </button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginDemo />} />
          <Route path="/" element={
            <AuthGate>
              <BlankDashboard />
            </AuthGate>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

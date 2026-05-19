import { useState } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const allowedUsers = [
  { uid: 'MGT-EXE-01', email: 'agent01mrk@gmail.com', name: 'Mr.K', firstName: 'Mr.K', avatar: '/team/mrk.jpg', role: 'Executive', isExecutive: true },
  { uid: 'MGT-EXE-02', email: 'agent02mrv@gmail.com', name: 'Mr.V', firstName: 'Mr.V', avatar: '/team/mrv.jpg', role: 'Executive' },
  { uid: 'MGT-DEV-02', email: 'agent05mrm@gmail.com', name: 'Mr.M', firstName: 'Mr.M', avatar: '/team/mrm.jpeg', role: 'Developer' },
  { uid: 'MGT-DEV-01', email: 'agent03mrss@gmail.com', name: 'Mrs.S', firstName: 'Mrs.S', avatar: '/team/mrss.jpg', role: 'Developer' },
  { uid: 'MGT-DES-01', email: 'agent04mra@gmail.com', name: 'Mr.A', firstName: 'Mr.A', avatar: '/team/mra.jpeg', role: 'Designer' },
  { uid: 'MGT-BIZ-01', email: 'agent06mrz@gmail.com', name: 'Mr.Z', firstName: 'Mr.Z', avatar: '/team/mrz.jpeg', role: 'Business' }
];

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Resolve UID to email if user entered a UID
      const resolvedEmail = allowedUsers.find(
        u => u.uid.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()
      )?.email || identifier;

      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resolvedEmail, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      // Merge backend data with frontend role mapping (if needed)
      const userFromList = allowedUsers.find(u => u.email === data.agent.email);
      const mappedUser = {
        ...data.agent,
        token: data.token,
        uid: userFromList?.uid,
        firstName: data.agent.name.split(' ')[0],
        avatar: userFromList?.avatar || `https://ui-avatars.com/api/?name=${data.agent.name}&background=random`,
        isExecutive: data.agent.role === 'executive' || data.agent.email === 'agent01mrk@gmail.com'
      };

      onLogin(mappedUser);
    } catch (err) {
      console.error("Login Error:", err);
      if (typeof err.message === 'object') {
        setError(JSON.stringify(err.message));
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Connection to server failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#f9f9fb] relative overflow-hidden font-sans text-[#1a1a1b]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-10 rounded-xl bg-white border border-[#e1e4e8] shadow-sm relative z-10"
      >
        <div className="flex justify-center mb-10">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src="/LOGOI.png" 
              alt="MKAVS" 
              className="w-full h-full object-contain"
              style={{ filter: 'grayscale(100%)' }}
            />
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-xl font-bold text-[#1a1a1b] mb-2 tracking-tight">Sign in to MKavs Dashboard</h2>
          <p className="text-sm text-[#6a737d]">Authorized access only</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-[10px] font-bold text-[#6a737d] uppercase tracking-widest mb-2">Email or UID</label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. MGT-DEV-01"
              className="w-full px-3 py-2 rounded-md bg-white border border-[#d1d5da] text-[#1a1a1b] focus:outline-none focus:border-[#4a154b] focus:ring-1 focus:ring-[#4a154b]/10 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#6a737d] uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-md bg-white border border-[#d1d5da] text-[#1a1a1b] focus:outline-none focus:border-[#4a154b] focus:ring-1 focus:ring-[#4a154b]/10 transition-all text-sm"
            />
          </div>

          {error && (
            <div className="text-center">
              <p className="text-rose-600 text-xs font-semibold">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-2.5 rounded-md bg-[#1a1a1b] text-white font-bold hover:bg-black transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 text-sm"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-12 pt-6 border-t border-[#e1e4e8] text-center">
          <p className="text-[10px] text-[#6a737d] font-bold uppercase tracking-widest">© MKAVS Global Tech</p>
        </div>
      </motion.div>
    </div>
  );
}

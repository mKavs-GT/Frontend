import { useState } from 'react';
import { motion } from 'framer-motion';

const allowedUsers = [
  { uid: 'MGT-EXE-01', email: 'agent01mrk@gmail.com', name: 'Mr.K', firstName: 'Mr.K', avatar: 'https://i.pravatar.cc/150?u=krishawn', role: 'Executive', isExecutive: true },
  { uid: 'MGT-DEV-01', email: 'agent03mrss@gmail.com', name: 'Mrs.S', firstName: 'Mrs.S', avatar: 'https://i.pravatar.cc/150?u=sofia', role: 'Developer' },
  { uid: 'MGT-DEV-02', email: 'agent05mrm@gmail.com', name: 'Mr.M', firstName: 'Mr.M', avatar: 'https://i.pravatar.cc/150?u=michael', role: 'Developer' },
  { uid: 'MGT-DES-01', email: 'agent04mra@gmail.com', name: 'Mr.A', firstName: 'Mr.A', avatar: 'https://i.pravatar.cc/150?u=mohammed', role: 'Designer' },
  { uid: 'MGT-EXE-02', email: 'agent02mrv@gmail.com', name: 'Mr.V', firstName: 'Mr.V', avatar: 'https://i.pravatar.cc/150?u=vinith', role: 'Executive' },
  { uid: 'MGT-BIZ-01', email: 'agent06mrz@gmail.com', name: 'Mr.Z', firstName: 'Mr.Z', avatar: 'https://i.pravatar.cc/150?u=sitesh', role: 'Business' }
];

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('trial123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const host = ['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'http://localhost:3000' : 'https://mkavs-backend.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${host}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
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
      setError(err.message || 'Connection to server failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-[#09090b] relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 dark:bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-[2rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center">
            <img src="/favicon.svg" alt="MKAVS" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Welcome to MKAVS</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Enter your UID to access the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Email or Employee UID</label>
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. agent03mrss@gmail.com or MGT-DEV-01"
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
            />
          </div>

          {error && (
            <p className="text-rose-500 text-sm font-semibold text-center">{error}</p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-md active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50 text-center">
          <p className="text-xs text-zinc-400 font-medium">Authorized Personnel Only. © MKAVS</p>
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import AdminDashboard from './admin/AdminDashboard';
import { motion } from 'framer-motion';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, 'admin@kubrasoysal.com', password);
    } catch (err) {
      setError('Hatalı Şifre veya Erişim Engellendi');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleLogin}
        className="bg-[#050505] border border-white/10 p-10 rounded-2xl w-full max-w-md flex flex-col gap-6 backdrop-blur-xl z-50 relative"
      >
        <div className="text-center mb-4">
          <h1 className="text-4xl font-heading font-black text-white tracking-tighter">KS ADMIN</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase mt-2">Restricted Access</p>
        </div>
        
        <div>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors font-sans"
          />
          {error && <p className="text-red-500 text-xs mt-2 uppercase tracking-widest">{error}</p>}
        </div>

        <button 
          type="submit"
          className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors"
        >
          Access Dashboard
        </button>
      </motion.form>
    </div>
  );
}

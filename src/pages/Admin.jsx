import { useState } from 'react';
import AdminDashboard from './admin/AdminDashboard';
import { motion } from 'framer-motion';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('ks_admin_auth') === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Hash the input password to hide it from source code
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Hash matches "Kubra*2026"
    if (hashHex === '15f2056672faebb89f994541f0171f85aa737fc8b67dfb2459906d15c837c194') { 
      localStorage.setItem('ks_admin_auth', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Hatalı Şifre');
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={() => {
      localStorage.removeItem('ks_admin_auth');
      setIsAuthenticated(false);
    }} />;
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

        <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors">
          Login
        </button>
      </motion.form>
    </div>
  );
}

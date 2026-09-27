import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, UserPlus, LogIn, User } from 'lucide-react';
import { db } from '../services/db';

interface AuthProps {
  onLogin: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (mode === 'login') {
        const user = await db.login(email, password);
        onLogin(user);
      } else {
        const newUser = await db.register(name, email, password);
        setSuccess('Registration successful! Logging in...');
        setTimeout(() => onLogin(newUser), 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'guest-' + Math.random().toString(36).substr(2, 5),
      name: 'Guest Explorer',
      email: 'guest@cosmicwatch.com',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
      joinedAt: new Date().toISOString()
    };
    onLogin(guestUser);
  };

  const fillAdminCreds = () => {
    setEmail('admin@cosmicwatch.com');
    setPassword('admin123');
    setMode('login');
    setError('');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden text-white font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-60"
          >
             <source src="https://cdn.pixabay.com/video/2019/02/10/21266-316377394_large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-6 md:p-8"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Header & Tabs */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light tracking-tighter mb-6">
              COSMICWORLD
            </h1>
            
            <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/5 relative">
                <motion.div 
                    className="absolute top-1 bottom-1 bg-white/10 rounded-lg"
                    initial={false}
                    animate={{ 
                        left: mode === 'login' ? '4px' : '50%', 
                        right: mode === 'login' ? '50%' : '4px' 
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <button 
                    onClick={() => { setMode('login'); setError(''); }}
                    className={`relative z-10 py-2.5 text-sm font-medium transition-colors ${mode === 'login' ? 'text-white' : 'text-gray-400'}`}
                >
                    Login
                </button>
                <button 
                    onClick={() => { setMode('register'); setError(''); }}
                    className={`relative z-10 py-2.5 text-sm font-medium transition-colors ${mode === 'register' ? 'text-white' : 'text-gray-400'}`}
                >
                    Register
                </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}
               {success && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
                >
                  <CheckCircle size={16} />
                  {success}
                </motion.div>
              )}

              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Explorer Name</label>
                  <input 
                    type="text" 
                    required={mode === 'register'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
                    placeholder="John Doe"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Email Coordinates</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="explorer@cosmicwatch.com"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-xs uppercase tracking-widest text-gray-400 ml-1">Access Code</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-white text-black font-medium py-4 rounded-xl flex items-center justify-center gap-2 mt-4 hover:bg-gray-200 transition-colors relative overflow-hidden group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? (
                      <>
                        <LogIn size={18} />
                        <span>INITIATE LAUNCH</span>
                      </>
                  ) : (
                      <>
                        <UserPlus size={18} />
                        <span>REGISTER PROFILE</span>
                      </>
                  )}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 flex flex-col gap-3">
             <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={handleGuestLogin}
                    className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm text-gray-300"
                >
                    <User size={16} />
                    Guest Access
                </button>
                <button 
                    onClick={fillAdminCreds}
                    className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm text-gray-300"
                >
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-black">A</div>
                    Admin Demo
                </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
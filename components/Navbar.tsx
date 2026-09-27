import React, { useState, useEffect } from 'react';
import { User, Shield } from 'lucide-react';

interface NavbarProps {
  onProfileClick?: () => void;
  onAdminClick?: () => void;
  userRole?: 'user' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({ onProfileClick, onAdminClick, userRole }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-black/80 backdrop-blur-md' : 'py-8 bg-transparent'}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>COSMICWATCH.</div>
        
        <div className="hidden md:flex items-center space-x-12 text-sm font-medium text-gray-300">
          <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#sightings" className="hover:text-white transition-colors">Sightings</a>
          <a href="#uplink" className="hover:text-white transition-colors">Uplink</a>
        </div>

        <div className="flex items-center gap-4">
            {userRole === 'admin' && (
                <button 
                    onClick={onAdminClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all"
                >
                    <Shield size={14} />
                    <span>Admin</span>
                </button>
            )}

            <div 
            onClick={onProfileClick}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all cursor-pointer group relative"
            >
            <User size={18} />
            {/* Active Indicator */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></span>
            </div>
        </div>
      </div>
    </nav>
  );
};
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Features } from './components/Features';
import { Trips } from './components/Trips';
import { Tickets } from './components/Tickets';
import { Footer } from './components/Footer';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { AsteroidDetails } from './components/AsteroidDetails';
import { Threats } from './components/Threats';
import { Proximity } from './components/Proximity';
import { UserMonitoring } from './components/UserMonitoring';
import { ChatInterface } from './components/ChatInterface';
import { AdminPanel } from './components/AdminPanel';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAsteroidPageOpen, setIsAsteroidPageOpen] = useState(false);
  const [isThreatsPageOpen, setIsThreatsPageOpen] = useState(false);
  const [isProximityPageOpen, setIsProximityPageOpen] = useState(false);
  const [isMonitoringPageOpen, setIsMonitoringPageOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Background Parallax Animation
  const { scrollY } = useScroll();
  // Inverse Parallax: Background moves downward as user scrolls down
  // Mapping scroll 0-5000 to -25% -> 0% vertical translation
  // This creates a "falling" or "traveling with" sensation
  const backgroundY = useTransform(scrollY, [0, 5000], ["-25%", "0%"]);

  useEffect(() => {
    // Check local storage for persisted session
    const savedUser = localStorage.getItem('space_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('space_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsDashboardOpen(false);
    setIsAsteroidPageOpen(false);
    setIsThreatsPageOpen(false);
    setIsProximityPageOpen(false);
    setIsMonitoringPageOpen(false);
    setIsChatOpen(false);
    setIsAdminPanelOpen(false);
    localStorage.removeItem('space_user');
  };

  if (checkingAuth) return null;

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen text-white selection:bg-white/20 selection:text-white relative">
      {/* Global Fixed Background (Asteroid/Earth Theme) with Parallax */}
      <div className="fixed inset-0 z-0 bg-black overflow-hidden">
         <motion.div 
            style={{ y: backgroundY }}
            className="absolute top-0 left-0 w-full h-[150vh] origin-top"
         >
            <img 
                src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop" 
                alt="Space Background" 
                className="w-full h-full object-cover opacity-60"
            />
         </motion.div>
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black pointer-events-none" />
      </div>

      <Navbar 
        onProfileClick={() => setIsDashboardOpen(true)} 
        userRole={user.role}
        onAdminClick={() => setIsAdminPanelOpen(true)}
      />
      
      <main className="relative z-10">
        <Hero />
        <About 
          onOpenAsteroidPage={() => setIsAsteroidPageOpen(true)} 
          onOpenThreatsPage={() => setIsThreatsPageOpen(true)}
          onOpenProximityPage={() => setIsProximityPageOpen(true)}
          onOpenMonitoringPage={() => setIsMonitoringPageOpen(true)}
        />
        <Features />
        <Trips />
        <Tickets onOpenChat={() => setIsChatOpen(true)} />
      </main>
      
      <Footer />
      
      <Dashboard 
        user={user}
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        onLogout={handleLogout}
      />

      <AnimatePresence>
        {isAsteroidPageOpen && (
          <AsteroidDetails onBack={() => setIsAsteroidPageOpen(false)} />
        )}
        {isThreatsPageOpen && (
          <Threats onBack={() => setIsThreatsPageOpen(false)} />
        )}
        {isProximityPageOpen && (
          <Proximity onBack={() => setIsProximityPageOpen(false)} />
        )}
        {isMonitoringPageOpen && (
          <UserMonitoring onBack={() => setIsMonitoringPageOpen(false)} />
        )}
        {isChatOpen && (
          <ChatInterface onClose={() => setIsChatOpen(false)} userParams={user} />
        )}
        {isAdminPanelOpen && (
          <AdminPanel currentUser={user} onClose={() => setIsAdminPanelOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
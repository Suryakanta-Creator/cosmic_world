import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bell, ShieldAlert, Globe, Trash2, LogOut } from 'lucide-react';

interface DashboardProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const initialAsteroids = [
  { id: 1, name: '99942 Apophis', approach: '2029-04-13', risk: 'High', distance: '31,000 km' },
  { id: 2, name: '101955 Bennu', approach: '2182-09-24', risk: 'Medium', distance: 'Unknown' },
  { id: 3, name: '2023 DW', approach: '2046-02-14', risk: 'Low', distance: '0.05 AU' },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, isOpen, onClose, onLogout }) => {
  const [asteroids, setAsteroids] = useState(initialAsteroids);
  const [alerts, setAlerts] = useState({
    approach: true,
    impact: true,
    news: false
  });

  const removeAsteroid = (id: number) => {
    setAsteroids(asteroids.filter(a => a.id !== id));
  };

  const toggleAlert = (key: keyof typeof alerts) => {
    setAlerts(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        />
      )}

      {/* Slide-out Panel */}
      <motion.div
        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0a0a0a] border-l border-white/10 z-[70] shadow-2xl flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex items-start justify-between bg-black/20">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
             </div>
             <div>
                <h2 className="text-xl font-medium text-white">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Explorer Active
                </div>
             </div>
          </div>
          <button 
             onClick={onClose}
             className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
             <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            
            {/* Watched Asteroids */}
            <section>
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <Globe size={16} />
                     Watched Asteroids
                  </h3>
                  <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-md">{asteroids.length}</span>
               </div>
               
               <div className="space-y-3">
                  {asteroids.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-gray-500 text-sm">
                          No asteroids currently tracked.
                      </div>
                  ) : (
                      asteroids.map(asteroid => (
                          <div key={asteroid.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/20 transition-colors">
                              <div>
                                  <div className="flex items-center gap-2">
                                      <span className="font-medium text-white">{asteroid.name}</span>
                                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                          asteroid.risk === 'High' ? 'border-red-500 text-red-500 bg-red-500/10' :
                                          asteroid.risk === 'Medium' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                                          'border-green-500 text-green-500 bg-green-500/10'
                                      }`}>
                                          {asteroid.risk} Risk
                                      </span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                      <span>Approach: {asteroid.approach}</span>
                                      <span>Dist: {asteroid.distance}</span>
                                  </div>
                              </div>
                              <button 
                                onClick={() => removeAsteroid(asteroid.id)}
                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              >
                                  <Trash2 size={16} />
                              </button>
                          </div>
                      ))
                  )}
               </div>
            </section>

            {/* Alert Preferences */}
            <section>
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Bell size={16} />
                  Alert Preferences
               </h3>
               
               <div className="space-y-1 bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                          <ShieldAlert size={18} className="text-red-400" />
                          <div>
                              <p className="text-sm font-medium text-white">Impact Risks</p>
                              <p className="text-xs text-gray-500">Notify for asteroids with >1% impact probability</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => toggleAlert('impact')}
                        className={`w-11 h-6 rounded-full transition-colors relative ${alerts.impact ? 'bg-white' : 'bg-white/20'}`}
                      >
                          <span className={`absolute top-1 left-1 bg-black w-4 h-4 rounded-full transition-transform ${alerts.impact ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-t border-white/5">
                      <div className="flex items-center gap-3">
                          <Globe size={18} className="text-blue-400" />
                          <div>
                              <p className="text-sm font-medium text-white">Close Approaches</p>
                              <p className="text-xs text-gray-500">Daily summary of objects within 1LD</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => toggleAlert('approach')}
                        className={`w-11 h-6 rounded-full transition-colors relative ${alerts.approach ? 'bg-white' : 'bg-white/20'}`}
                      >
                          <span className={`absolute top-1 left-1 bg-black w-4 h-4 rounded-full transition-transform ${alerts.approach ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                  </div>

                  <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-t border-white/5">
                      <div className="flex items-center gap-3">
                          <Bell size={18} className="text-yellow-400" />
                          <div>
                              <p className="text-sm font-medium text-white">Space News</p>
                              <p className="text-xs text-gray-500">Weekly digest of space exploration news</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => toggleAlert('news')}
                        className={`w-11 h-6 rounded-full transition-colors relative ${alerts.news ? 'bg-white' : 'bg-white/20'}`}
                      >
                          <span className={`absolute top-1 left-1 bg-black w-4 h-4 rounded-full transition-transform ${alerts.news ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                  </div>
               </div>
            </section>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/10 bg-black/20">
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 py-3 rounded-xl transition-colors text-sm font-medium"
            >
                <LogOut size={18} />
                Disconnect Session
            </button>
        </div>
      </motion.div>
    </>
  );
};
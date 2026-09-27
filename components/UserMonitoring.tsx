import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Bell, Eye, Settings, Mail, Smartphone, Shield, Clock, Trash2, Sliders, Check, AlertTriangle } from 'lucide-react';

interface WatchlistObject {
  id: string;
  name: string;
  added_date: string;
  next_approach: string;
  alert_threshold: string; // e.g. "< 5LD"
  status: 'Safe' | 'Warning' | 'Critical';
}

interface Notification {
  id: number;
  type: 'alert' | 'info' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
}

interface UserMonitoringProps {
  onBack: () => void;
}

export const UserMonitoring: React.FC<UserMonitoringProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history' | 'settings'>('watchlist');
  
  // Mock Data States
  const [watchlist, setWatchlist] = useState<WatchlistObject[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    threshold: 10 // Lunar Distances
  });

  const fetchData = async () => {
    setLoading(true);
    // Simulate API Fetch
    setTimeout(() => {
      setWatchlist([
        { id: '3542519', name: '(2010 PK9)', added_date: '2023-11-15', next_approach: '2024-08-26', alert_threshold: '< 10 LD', status: 'Safe' },
        { id: '2000433', name: '433 Eros', added_date: '2024-01-10', next_approach: '2024-02-14', alert_threshold: '< 5 LD', status: 'Warning' },
        { id: '3726712', name: '(2015 KJ19)', added_date: '2024-02-01', next_approach: '2024-05-15', alert_threshold: '< 1 LD', status: 'Safe' },
        { id: '99942', name: '99942 Apophis', added_date: '2022-06-20', next_approach: '2029-04-13', alert_threshold: 'Impact Risk', status: 'Critical' },
      ]);

      setNotifications([
        { id: 1, type: 'alert', message: 'Object 433 Eros entering observation zone', timestamp: '2 hours ago', read: false },
        { id: 2, type: 'info', message: 'Weekly Trajectory Report available', timestamp: '1 day ago', read: true },
        { id: 3, type: 'system', message: 'Alert threshold updated to 0.05 AU', timestamp: '3 days ago', read: true },
        { id: 4, type: 'alert', message: 'High velocity object detected in Sector 7', timestamp: '1 week ago', read: true },
      ]);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-[#0b0514] text-white overflow-y-auto custom-scrollbar font-sans"
    >
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]" />
          <div className="absolute top-40 -left-20 w-72 h-72 bg-indigo-900/20 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-[#0b0514]/80 backdrop-blur-xl border-b border-purple-500/20 p-6 z-20 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
               <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
                <Shield className="text-purple-400" />
                <h1 className="text-2xl font-light tracking-tight text-purple-50">User Monitoring System</h1>
            </div>
         </div>
         <div className="flex items-center gap-4 text-sm text-purple-300/60">
             <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-purple-400 animate-pulse' : 'bg-green-500'}`} />
                {loading ? 'Syncing Profile...' : 'System Active'}
             </span>
             <button onClick={fetchData} className="p-2 hover:text-white transition-colors">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
             </button>
         </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl relative z-10">
         
         {/* Top Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-6 flex items-center gap-4">
               <div className="p-3 rounded-full bg-purple-500/20 text-purple-300">
                  <Eye size={24} />
               </div>
               <div>
                  <div className="text-2xl font-bold">{watchlist.length}</div>
                  <div className="text-sm text-gray-400">Watched Objects</div>
               </div>
            </div>
            <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-6 flex items-center gap-4">
               <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-300">
                  <Bell size={24} />
               </div>
               <div>
                  <div className="text-2xl font-bold">{notifications.filter(n => !n.read).length}</div>
                  <div className="text-sm text-gray-400">Unread Alerts</div>
               </div>
            </div>
             <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-6 flex items-center gap-4">
               <div className="p-3 rounded-full bg-pink-500/20 text-pink-300">
                  <Shield size={24} />
               </div>
               <div>
                  <div className="text-2xl font-bold">Pro</div>
                  <div className="text-sm text-gray-400">Subscription Tier</div>
               </div>
            </div>
         </div>

         {/* Main Layout */}
         <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">
            
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex flex-col gap-2">
               <button 
                  onClick={() => setActiveTab('watchlist')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === 'watchlist' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-white/5 text-gray-400'}`}
               >
                  <Eye size={18} />
                  <span>My Watchlist</span>
               </button>
               <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === 'history' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-white/5 text-gray-400'}`}
               >
                  <Clock size={18} />
                  <span>Notification Log</span>
               </button>
               <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === 'settings' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'hover:bg-white/5 text-gray-400'}`}
               >
                  <Settings size={18} />
                  <span>Alert Settings</span>
               </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 min-h-[500px]">
               
               {/* WATCHLIST TAB */}
               {activeTab === 'watchlist' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium">Active Surveillance List</h2>
                        <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                           + Add Object
                        </button>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="text-xs text-gray-500 uppercase border-b border-white/10">
                                 <th className="py-3 px-2 font-medium">Asteroid Name</th>
                                 <th className="py-3 px-2 font-medium">Added</th>
                                 <th className="py-3 px-2 font-medium">Next Approach</th>
                                 <th className="py-3 px-2 font-medium">Threshold</th>
                                 <th className="py-3 px-2 font-medium">Status</th>
                                 <th className="py-3 px-2 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="text-sm">
                              {watchlist.map((item) => (
                                 <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-2 font-medium">{item.name}</td>
                                    <td className="py-4 px-2 text-gray-400">{item.added_date}</td>
                                    <td className="py-4 px-2 text-gray-300 font-mono">{item.next_approach}</td>
                                    <td className="py-4 px-2">
                                       <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs border border-indigo-500/20">{item.alert_threshold}</span>
                                    </td>
                                    <td className="py-4 px-2">
                                       {item.status === 'Safe' && <span className="text-green-400 flex items-center gap-1"><Check size={12} /> Stable</span>}
                                       {item.status === 'Warning' && <span className="text-yellow-400 flex items-center gap-1"><AlertTriangle size={12} /> Watch</span>}
                                       {item.status === 'Critical' && <span className="text-red-400 flex items-center gap-1"><Shield size={12} /> Alert</span>}
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                       <button className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                          <Trash2 size={16} />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </motion.div>
               )}

               {/* HISTORY TAB */}
               {activeTab === 'history' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                     <h2 className="text-xl font-medium mb-6">Recent Activities & Alerts</h2>
                     <div className="space-y-4">
                        {notifications.map((note) => (
                           <div key={note.id} className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${note.read ? 'bg-transparent border-white/5 opacity-70' : 'bg-purple-500/10 border-purple-500/30'}`}>
                              <div className={`mt-1 p-2 rounded-full ${note.type === 'alert' ? 'bg-red-500/20 text-red-400' : note.type === 'info' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                 {note.type === 'alert' ? <Shield size={16} /> : note.type === 'info' ? <Bell size={16} /> : <Settings size={16} />}
                              </div>
                              <div className="flex-1">
                                 <div className="flex justify-between items-start">
                                    <p className="font-medium text-gray-200">{note.message}</p>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{note.timestamp}</span>
                                 </div>
                                 <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{note.type}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               )}

               {/* SETTINGS TAB */}
               {activeTab === 'settings' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                     <h2 className="text-xl font-medium mb-6">Notification Channels</h2>
                     
                     <div className="grid gap-6">
                        {/* Channels */}
                        <div className="p-5 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-500/10 rounded-full text-blue-400"><Mail size={20} /></div>
                              <div>
                                 <div className="font-medium">Email Alerts</div>
                                 <div className="text-sm text-gray-500">Weekly summaries and critical alerts</div>
                              </div>
                           </div>
                           <button 
                              onClick={() => togglePreference('email')}
                              className={`w-12 h-6 rounded-full transition-colors relative ${preferences.email ? 'bg-purple-600' : 'bg-gray-700'}`}
                           >
                              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences.email ? 'translate-x-6' : 'translate-x-0'}`} />
                           </button>
                        </div>

                        <div className="p-5 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-green-500/10 rounded-full text-green-400"><Smartphone size={20} /></div>
                              <div>
                                 <div className="font-medium">Push Notifications</div>
                                 <div className="text-sm text-gray-500">Real-time device notifications</div>
                              </div>
                           </div>
                           <button 
                              onClick={() => togglePreference('push')}
                              className={`w-12 h-6 rounded-full transition-colors relative ${preferences.push ? 'bg-purple-600' : 'bg-gray-700'}`}
                           >
                              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences.push ? 'translate-x-6' : 'translate-x-0'}`} />
                           </button>
                        </div>

                        <div className="p-5 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-orange-500/10 rounded-full text-orange-400"><Shield size={20} /></div>
                              <div>
                                 <div className="font-medium">SMS Critical Alerts</div>
                                 <div className="text-sm text-gray-500">Only for high-impact probability events</div>
                              </div>
                           </div>
                           <button 
                              onClick={() => togglePreference('sms')}
                              className={`w-12 h-6 rounded-full transition-colors relative ${preferences.sms ? 'bg-purple-600' : 'bg-gray-700'}`}
                           >
                              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences.sms ? 'translate-x-6' : 'translate-x-0'}`} />
                           </button>
                        </div>

                        {/* Threshold Slider */}
                        <div className="mt-6">
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="font-medium flex items-center gap-2">
                                 <Sliders size={18} />
                                 Global Distance Threshold
                              </h3>
                              <span className="text-purple-400 font-mono">{preferences.threshold} Lunar Distances</span>
                           </div>
                           <input 
                              type="range" 
                              min="1" 
                              max="50" 
                              value={preferences.threshold}
                              onChange={(e) => setPreferences({...preferences, threshold: parseInt(e.target.value)})}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                           />
                           <p className="text-xs text-gray-500 mt-2">
                              Alerts will trigger for any object passing within this distance of Earth.
                           </p>
                        </div>
                     </div>
                  </motion.div>
               )}

            </div>
         </div>
      </div>
    </motion.div>
  );
};
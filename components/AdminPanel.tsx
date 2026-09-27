import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Shield, RefreshCw, Users, Search, Lock, Database } from 'lucide-react';
import { db, User } from '../services/db';

interface AdminPanelProps {
  currentUser: User;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await db.getAllUsers(currentUser);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch database records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-4 md:inset-10 bg-[#050505] border border-red-500/30 rounded-2xl z-[101] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(239,68,68,0.1)]"
      >
        {/* Header */}
        <div className="p-6 border-b border-red-500/20 bg-red-950/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/30">
                    <Shield className="text-red-500" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        ADMINISTRATION CONSOLE
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-500 text-white font-mono uppercase">Top Secret</span>
                    </h2>
                    <p className="text-red-400/60 text-sm font-mono">Restricted Access Level 5</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={fetchUsers}
                    className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                    title="Refresh Database"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
            
            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search personnel database..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                />
            </div>

            {error ? (
                <div className="flex-1 flex flex-col items-center justify-center text-red-400 gap-4">
                    <Lock size={48} />
                    <p className="text-lg font-mono">{error}</p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 border border-white/5 rounded-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 z-10">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">User Identity</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Role</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Database ID</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{user.name}</div>
                                            <div className="text-sm text-gray-400">{user.email}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                                            user.role === 'admin' 
                                            ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                            : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-sm text-gray-500">
                                        {user.id}
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        {new Date(user.joinedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!loading && filteredUsers.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No records found matching query.
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {/* Footer Stats */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex gap-6 text-sm font-mono text-gray-500">
            <div className="flex items-center gap-2">
                <Database size={14} />
                <span>Total Records: <span className="text-white">{users.length}</span></span>
            </div>
            <div className="flex items-center gap-2">
                <Users size={14} />
                <span>Admins: <span className="text-red-400">{users.filter(u => u.role === 'admin').length}</span></span>
            </div>
        </div>
      </motion.div>
    </>
  );
};
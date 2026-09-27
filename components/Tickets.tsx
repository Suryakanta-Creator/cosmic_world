import React from 'react';
import { motion } from 'framer-motion';
import { Star, Bot, Users, Zap, MessageSquare } from 'lucide-react';

interface InterfaceCardProps {
  title: string;
  subtitle: string;
  description: string;
  status: string;
  icon: React.ReactNode;
  visual: React.ReactNode;
  index: number;
  onClick: () => void;
}

const InterfaceCard: React.FC<InterfaceCardProps> = ({ title, subtitle, description, status, icon, visual, index, onClick }) => {
  return (
    <motion.div 
      className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2rem] p-8 flex flex-col justify-between h-[500px] relative overflow-hidden group hover:bg-white/10 transition-colors cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
             <div className="p-4 bg-white/10 rounded-2xl text-white ring-1 ring-white/20">
                {icon}
             </div>
             <span className="text-xs font-mono py-1.5 px-3 rounded-full border border-white/20 bg-black/40 text-green-400 flex items-center gap-2 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {status}
             </span>
        </div>
        <h3 className="text-4xl font-light text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">{subtitle}</p>
      </div>

      {/* Visual in Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-30 group-hover:opacity-50 transition-all duration-500 pointer-events-none scale-110 group-hover:scale-125">
          {visual}
      </div>

      <div className="relative z-10 border-t border-white/10 pt-6 mt-6">
         <p className="text-gray-300 text-sm leading-relaxed mb-8 h-12">
            {description}
         </p>
         <button 
            onClick={onClick}
            className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group-hover:gap-4 transition-all uppercase text-xs"
         >
            <span>Initialize Interface</span>
            <Zap size={16} />
         </button>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
    </motion.div>
  );
};

interface TicketsProps {
  onOpenChat?: () => void;
}

export const Tickets: React.FC<TicketsProps> = ({ onOpenChat }) => {
  return (
    <section id="uplink" className="py-32 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 relative">
          <div>
              <h2 className="text-6xl md:text-8xl font-light tracking-tight text-white mb-6">UPLINK</h2>
              <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-white/30" />
                  <p className="text-gray-300 text-sm tracking-widest uppercase">Select Communication Channel</p>
              </div>
          </div>
          
          <div className="absolute right-0 top-0 hidden md:block">
             <Star className="w-12 h-12 text-white stroke-[0.5]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* AI CHATBOT CARD */}
          <InterfaceCard 
            title="COSMIC AI"
            subtitle="Autonomous Neural Link"
            description="Direct interface with the ship's Gemini-Core. Process astronomical data, analyze threats, and query the universal database."
            status="ONLINE"
            icon={<Bot size={32} />}
            index={0}
            onClick={() => onOpenChat && onOpenChat()}
            visual={
                <div className="relative w-80 h-80">
                    <div className="absolute inset-0 border border-dashed border-cyan-500/30 rounded-full animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-10 border border-cyan-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
                    {/* Digital Brain Nodes */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-cyan-400/60 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                        <circle cx="50" cy="50" r="3" fill="currentColor" />
                        <circle cx="30" cy="40" r="2" fill="currentColor" />
                        <circle cx="70" cy="40" r="2" fill="currentColor" />
                        <circle cx="40" cy="70" r="2" fill="currentColor" />
                        <circle cx="60" cy="70" r="2" fill="currentColor" />
                        <line x1="50" y1="50" x2="30" y2="40" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="50" y1="50" x2="70" y2="40" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="50" y1="50" x2="40" y2="70" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="50" y1="50" x2="60" y2="70" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="30" y1="40" x2="40" y2="70" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="70" y1="40" x2="60" y2="70" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                </div>
            }
          />

          {/* USER CHATBOT CARD */}
          <InterfaceCard 
            title="EXPLORER NET"
            subtitle="Encrypted Fleet Comms"
            description="Join the global observation network. Coordinate with other sentries, share sighting logs, and access the community signal feed."
            status="ACTIVE"
            icon={<Users size={32} />}
            index={1}
            onClick={() => {}} // Placeholder for now
            visual={
                <div className="relative w-80 h-80">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-24 bg-purple-500/10 blur-2xl transform -rotate-12" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-full bg-purple-500/10 blur-2xl transform -rotate-12" />
                     
                     {/* Connecting Lines */}
                     <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-purple-400/50 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                        <path d="M10 50 Q 25 25 50 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-[pulse_3s_infinite]" />
                        <path d="M10 50 Q 25 75 50 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-[pulse_3s_infinite_delay-75]" />
                        <circle cx="10" cy="50" r="3" fill="currentColor" />
                        <circle cx="50" cy="50" r="4" fill="currentColor" />
                        <circle cx="90" cy="50" r="3" fill="currentColor" />
                     </svg>

                     {/* Chat Bubbles */}
                     <div className="absolute top-24 left-16 w-12 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center animate-bounce">
                        <MessageSquare size={12} className="text-purple-300" />
                     </div>
                     <div className="absolute bottom-24 right-16 w-12 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center animate-bounce delay-100">
                        <MessageSquare size={12} className="text-purple-300" />
                     </div>
                </div>
            }
          />
        </div>
      </div>
    </section>
  );
};
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Radio, Terminal, Cpu, User, MessageSquare } from 'lucide-react';

// ------------------------------------------------------------------
// DATA: RECENT ASTEROIDS & CELESTIAL BODIES
// ------------------------------------------------------------------
const sightings = [
  {
    id: 1,
    title: 'Asteroid 2024 YR4',
    description: 'Rare collision risk detected. 1.2% probability of Earth impact in 2032. Currently monitored by Sentinel.',
    details: 'Type: Apollo | Dia: 45m | Vel: 12.4 km/s',
    status: 'WARNING',
    logs: [
        { time: '08:42:15', source: 'SYSTEM', type: 'system', message: 'Tracking lock established. Target ID: 2024 YR4.' },
        { time: '08:42:40', source: 'OP_KEPLER', type: 'human', message: 'Confirmed. Speed is anomalous. Check for gravitational perturbations.' },
        { time: '08:42:55', source: 'AI_CORE', type: 'ai', message: 'Calculating... Deviation detected. 1.2% probability intersect vector found for 2032.' },
        { time: '08:43:10', source: 'OP_KEPLER', type: 'human', message: 'Flag it immediately. Level 4 warning. Alert Sentinel command.' },
        { time: '08:43:12', source: 'SENTINEL', type: 'system', message: 'Packet received. Planetary Defense protocols: STANDBY.' }
    ]
  },
  {
    id: 2,
    title: 'Asteroid 2024 MK',
    description: 'A massive 150m object that recently passed within lunar distance (290,000 km). Captured in high detail.',
    details: 'Type: Aten | Dia: 150m | Vel: 9.8 km/s',
    status: 'OBSERVATION',
    logs: [
        { time: '14:20:00', source: 'AUTO_OBS', type: 'system', message: 'Object entering lunar proximity. Apparent magnitude: 14.2.' },
        { time: '14:20:15', source: 'ASTRO_LIA', type: 'human', message: 'Look at that radar resolution! We are getting surface features.' },
        { time: '14:20:45', source: 'AI_CORE', type: 'ai', message: 'Surface composition scan complete: Silicate rich. No volatiles detected.' },
        { time: '14:21:00', source: 'ASTRO_LIA', type: 'human', message: 'It is huge. 150 meters. Close shave.' },
        { time: '14:21:05', source: 'AI_CORE', type: 'ai', message: 'Simulation: "City-killer" class impact energy. Current miss distance: Safe (> 290k km).' }
    ]
  },
  {
    id: 3,
    title: 'Asteroid 2011 UL21',
    description: 'The "Planet Killer". One of the largest objects (2.3km) to pass Earth safely in the last decade.',
    details: 'Type: Apollo | Dia: 2.3km | Vel: 25 km/s',
    status: 'SECURE',
    logs: [
        { time: '22:00:05', source: 'DEEP_NET', type: 'system', message: 'Signal acquisition. Massive signature detected. Target: 2011 UL21.' },
        { time: '22:00:30', source: 'CMD_JONES', type: 'human', message: 'The "Planet Killer". It has been a while since we saw this one.' },
        { time: '22:01:00', source: 'AI_CORE', type: 'ai', message: 'Diameter confirmed: 2.31km. Relative velocity: 25 km/s. Kinetic potential: Extreme.' },
        { time: '22:01:15', source: 'CMD_JONES', type: 'human', message: 'Safe distance confirmed?' },
        { time: '22:01:18', source: 'AI_CORE', type: 'ai', message: 'Affirmative. Perigee > 17 Lunar Distances. No threat posed.' },
        { time: '22:01:45', source: 'CMD_JONES', type: 'human', message: 'Good. Log coordinates for future resource extraction. That is a lot of metal.' }
    ]
  }
];

// ------------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------------
export const Trips: React.FC = () => {
  const [hoveredTrip, setHoveredTrip] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const activeSighting = sightings.find(s => s.id === hoveredTrip);

  return (
    <section 
      id="sightings" 
      className="py-24 bg-transparent relative overflow-hidden" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
       <div className="container mx-auto px-6 md:px-12 relative z-20">
          <h2 className="text-6xl md:text-8xl font-light mb-16 tracking-tight">Recent Sightings</h2>
          
          <div className="relative">
             {sightings.map((sighting) => (
               <div 
                  key={sighting.id}
                  className="group relative border-t border-white/10 py-16 flex flex-col md:flex-row items-center justify-between cursor-pointer transition-colors duration-300 hover:bg-white/5"
                  onMouseEnter={() => setHoveredTrip(sighting.id)}
                  onMouseLeave={() => setHoveredTrip(null)}
               >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 w-full md:w-2/3">
                     <div className={`w-4 h-4 rounded-full border border-white transition-all duration-300 ${hoveredTrip === sighting.id ? 'bg-white scale-125' : 'bg-transparent'}`} />
                     <div>
                        <h3 className="text-3xl md:text-5xl font-light transition-opacity duration-300 group-hover:opacity-100 opacity-70 mb-2">{sighting.title}</h3>
                        <p className={`text-sm text-cyan-400 font-mono transition-all duration-300 ${hoveredTrip === sighting.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                            {sighting.details}
                        </p>
                     </div>
                  </div>
                  
                  <div className="w-full md:w-1/3 flex justify-end">
                     <p className="text-gray-400 text-right max-w-xs transition-colors group-hover:text-gray-200">{sighting.description}</p>
                  </div>
               </div>
             ))}
             <div className="border-t border-white/10" />
          </div>
       </div>

       {/* Floating Data Log Reveal */}
       <AnimatePresence>
         {hoveredTrip && activeSighting && (
           <motion.div
             key={activeSighting.id}
             className="absolute w-[500px] rounded-xl overflow-hidden pointer-events-none z-30 hidden md:flex flex-col bg-black/95 border border-white/20 backdrop-blur-xl shadow-2xl"
             style={{
               top: 0,
               left: 0,
               boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)'
             }}
             animate={{
               x: mousePos.x + 40, // Offset to right of cursor
               y: mousePos.y - 150, // Slightly above center
               opacity: 1,
               scale: 1,
             }}
             initial={{ opacity: 0, scale: 0.9, y: mousePos.y }}
             exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
             transition={{ type: "spring", stiffness: 300, damping: 25 }}
           >
             {/* Header */}
             <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase">
                    <Radio size={14} className="animate-pulse text-green-400" />
                    LIVE DATA STREAM
                </div>
                <div className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${
                    activeSighting.status === 'WARNING' ? 'border-red-500 text-red-500 bg-red-500/10' :
                    activeSighting.status === 'OBSERVATION' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                    'border-green-500 text-green-500 bg-green-500/10'
                }`}>
                    {activeSighting.status}
                </div>
             </div>

             {/* Conversation / Logs */}
             <div className="p-5 space-y-4 font-mono text-xs bg-black/50">
                {activeSighting.logs.map((log, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }} // Slower stagger for "typing" feel
                        className="flex gap-3 items-start"
                    >
                        <div className="text-gray-600 shrink-0 w-14 text-[10px] mt-0.5">{log.time}</div>
                        
                        <div className="shrink-0 mt-0.5">
                            {log.type === 'ai' && <Cpu size={14} className="text-cyan-400" />}
                            {log.type === 'human' && <User size={14} className="text-yellow-400" />}
                            {log.type === 'system' && <Terminal size={14} className="text-gray-500" />}
                        </div>

                        <div className="flex-1">
                            <span className={`font-bold mr-2 text-[10px] tracking-wide ${
                                log.type === 'ai' ? 'text-cyan-400' : 
                                log.type === 'human' ? 'text-yellow-400' : 'text-gray-400'
                            }`}>
                                {log.source}:
                            </span>
                            <span className={`leading-relaxed ${
                                log.type === 'ai' ? 'text-cyan-100' : 
                                log.type === 'human' ? 'text-yellow-100' : 'text-gray-400'
                            }`}>
                                {log.message}
                            </span>
                        </div>
                    </motion.div>
                ))}
             </div>

             {/* Footer */}
             <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-gray-500 text-[10px]">
                     <Activity size={12} />
                     <span>Signal Integrity: 100%</span>
                 </div>
                 <div className="flex items-center gap-2 text-gray-500 text-[10px]">
                     <ShieldAlert size={12} />
                     <span>Secure Channel</span>
                 </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </section>
  );
};
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Radar, Navigation, Ruler, Clock, Orbit, Scan } from 'lucide-react';

interface ProximityObject {
  id: string;
  name: string;
  close_approach_date_full: string;
  miss_distance_km: string;
  miss_distance_au: string;
  relative_velocity: string;
  orbiting_body: string;
  diameter_min: number;
  diameter_max: number;
  is_hazardous: boolean;
}

interface ProximityProps {
  onBack: () => void;
}

export const Proximity: React.FC<ProximityProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [objects, setObjects] = useState<ProximityObject[]>([]);
  const [stats, setStats] = useState({
    closestName: 'Scanning...',
    minDistance: '0',
    nextApproach: '00:00:00',
    avgVelocity: '0',
    status: 'Tracking'
  });

  const fetchProximityData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&api_key=DEMO_KEY`);
      
      if (!response.ok) throw new Error('API_FAILED');

      const data = await response.json();
      const all: any[] = Object.values(data.near_earth_objects).flat();

      // Transform and sort by closest miss distance
      const processed = all.map((obj: any) => {
          const approach = obj.close_approach_data[0];
          return {
              id: obj.id,
              name: obj.name,
              close_approach_date_full: approach.close_approach_date_full,
              miss_distance_km: approach.miss_distance.kilometers,
              miss_distance_au: approach.miss_distance.astronomical,
              relative_velocity: approach.relative_velocity.kilometers_per_hour,
              orbiting_body: approach.orbiting_body,
              diameter_min: obj.estimated_diameter.meters.estimated_diameter_min,
              diameter_max: obj.estimated_diameter.meters.estimated_diameter_max,
              is_hazardous: obj.is_potentially_hazardous_asteroid
          };
      });

      // Sort ascending by distance (closest first)
      processed.sort((a, b) => parseFloat(a.miss_distance_km) - parseFloat(b.miss_distance_km));
      
      const topList = processed.slice(0, 30);
      setObjects(topList);

      if (topList.length > 0) {
          const closest = topList[0];
          const avgVel = topList.reduce((acc, curr) => acc + parseFloat(curr.relative_velocity), 0) / topList.length;
          
          setStats({
              closestName: closest.name.replace(/[()]/g, ''),
              minDistance: parseFloat(closest.miss_distance_km).toLocaleString(),
              nextApproach: closest.close_approach_date_full?.split(' ')[1] || 'Today',
              avgVelocity: avgVel.toFixed(0),
              status: 'Orbit Locked'
          });
      }

    } catch (error) {
      console.warn("Using simulation data due to API limits");
      const mockProximity = Array.from({ length: 25 }).map((_, i) => {
          // Generate exponentially increasing distances to simulate "closest" first
          const distBase = 100000 + (i * i * 50000); 
          const velocity = 25000 + Math.random() * 40000;
          
          return {
              id: `2024-${9000+i}`,
              name: `(2024 PROX-${i})`,
              close_approach_date_full: `2024-03-${10 + (i%20)} ${String(Math.floor(Math.random()*24)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`,
              miss_distance_km: distBase.toString(),
              miss_distance_au: (distBase / 149597870.7).toFixed(6),
              relative_velocity: velocity.toString(),
              orbiting_body: 'Earth',
              diameter_min: 10 + i,
              diameter_max: 20 + i,
              is_hazardous: i % 10 === 0
          };
      });
      
      setObjects(mockProximity);
      setStats({
          closestName: "2024 PROX-0",
          minDistance: "100,000",
          nextApproach: "14:30:00",
          avgVelocity: "45,200",
          status: 'Simulated Feed'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProximityData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-[#02080a] text-white overflow-y-auto custom-scrollbar"
    >
      {/* Background Radar Effect */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] opacity-5 pointer-events-none z-0">
         <div className="absolute inset-0 rounded-full border border-cyan-500/30" />
         <div className="absolute inset-[15%] rounded-full border border-cyan-500/30" />
         <div className="absolute inset-[30%] rounded-full border border-cyan-500/30" />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-cyan-500/20" />
         <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-0.5 bg-cyan-500/20" />
      </div>

      {/* Header */}
      <div className="sticky top-0 bg-cyan-950/20 backdrop-blur-md border-b border-cyan-500/20 p-6 z-20 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
               <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
                <Radar className="text-cyan-400 animate-[spin_4s_linear_infinite]" />
                <h1 className="text-2xl font-light tracking-tight text-cyan-50">Proximity & Trajectory Tracker</h1>
            </div>
         </div>
         <div className="flex items-center gap-4 text-sm text-cyan-300/60">
             <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-cyan-200 animate-ping' : 'bg-cyan-500'}`} />
                {loading ? 'Calculating Trajectories...' : 'Real-time Telemetry'}
             </span>
             <button onClick={fetchProximityData} className="p-2 hover:text-white transition-colors">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
             </button>
         </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
         
         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 text-cyan-400 mb-2">
                    <Scan size={20} />
                    <span className="text-xs uppercase tracking-widest font-bold">Closest Object</span>
                </div>
                <div className="text-2xl font-light text-cyan-100 truncate">{stats.closestName}</div>
                <div className="text-xs text-cyan-400/60 mt-2">Incoming Trajectory</div>
            </div>

            <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 text-teal-400 mb-2">
                    <Ruler size={20} />
                    <span className="text-xs uppercase tracking-widest font-bold">Nearest Distance</span>
                </div>
                <div className="text-3xl font-light text-teal-100">{stats.minDistance} <span className="text-sm text-teal-500/70">km</span></div>
                <div className="text-xs text-teal-400/60 mt-2">Critical Proximity</div>
            </div>

             <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 text-blue-400 mb-2">
                    <Clock size={20} />
                    <span className="text-xs uppercase tracking-widest font-bold">Approach Time</span>
                </div>
                <div className="text-2xl font-light text-blue-100">{stats.nextApproach}</div>
                <div className="text-xs text-blue-400/60 mt-2">UTC Standard Time</div>
            </div>

            <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 text-indigo-400 mb-2">
                    <Navigation size={20} />
                    <span className="text-xs uppercase tracking-widest font-bold">Avg Velocity</span>
                </div>
                <div className="text-2xl font-light text-indigo-100">{parseInt(stats.avgVelocity).toLocaleString()} <span className="text-sm text-indigo-500/70">km/h</span></div>
                <div className="text-xs text-indigo-400/60 mt-2">Relative to Earth</div>
            </div>
         </div>

         {/* List Header */}
         <div className="mb-6 flex items-end justify-between border-b border-cyan-500/20 pb-4">
             <div>
                <h2 className="text-xl font-medium text-cyan-50">Close Approaches</h2>
                <p className="text-cyan-400/50 text-sm mt-1">Sorted by nearest distance to Earth. (1 Lunar Distance ≈ 384,400 km)</p>
             </div>
             <div className="flex items-center gap-2 text-xs text-cyan-600">
                <Orbit size={14} />
                <span>Geocentric Orbit Data</span>
             </div>
         </div>

         {/* Proximity Table */}
         {loading && objects.length === 0 ? (
             <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
             </div>
         ) : (
             <div className="grid grid-cols-1 gap-3">
                {/* Header Row */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs uppercase tracking-widest text-cyan-600/70 font-bold bg-cyan-900/10 rounded-lg">
                    <div className="col-span-3">Object / Date</div>
                    <div className="col-span-3">Miss Distance (km)</div>
                    <div className="col-span-2">Distance (AU)</div>
                    <div className="col-span-2">Velocity (km/h)</div>
                    <div className="col-span-2 text-right">Orbit Info</div>
                </div>

                {objects.map((obj, index) => {
                    // Calculate a "Proximity Intensity" for visual feedback
                    const distKm = parseFloat(obj.miss_distance_km);
                    const intensity = Math.max(0.1, 1 - (distKm / 10000000)); // 0 to 1 based on 10M km cap

                    return (
                        <motion.div 
                           key={`${obj.id}-${index}`}
                           initial={{ opacity: 0, scale: 0.98 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: index * 0.03 }}
                           className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border border-cyan-500/10 rounded-xl items-center bg-black/40 hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group relative overflow-hidden"
                        >
                            {/* Proximity Bar Indicator */}
                            <div 
                                className="absolute left-0 top-0 bottom-0 bg-cyan-500/20 transition-all duration-1000" 
                                style={{ width: `${intensity * 4}px` }} 
                            />

                            <div className="col-span-3 font-medium text-white flex flex-col">
                                <span className="group-hover:text-cyan-300 transition-colors">{obj.name.replace(/[()]/g, '')}</span>
                                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                    <Clock size={10} />
                                    {obj.close_approach_date_full}
                                </span>
                            </div>

                            <div className="col-span-3 text-xl font-light text-cyan-100 tracking-wide">
                                {parseFloat(obj.miss_distance_km).toLocaleString()}
                            </div>

                            <div className="col-span-2 text-sm text-cyan-400/70 font-mono">
                                {parseFloat(obj.miss_distance_au).toFixed(5)} AU
                            </div>

                            <div className="col-span-2 text-sm text-gray-400 font-mono">
                                {parseFloat(obj.relative_velocity).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>

                            <div className="col-span-2 flex justify-end">
                                <span className="flex items-center gap-1 text-xs text-cyan-600 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/10">
                                    <Orbit size={10} />
                                    Orbiting {obj.orbiting_body}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
             </div>
         )}
      </div>
    </motion.div>
  );
};
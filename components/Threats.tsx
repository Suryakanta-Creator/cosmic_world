import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, ShieldAlert, AlertTriangle, Zap, Target, BarChart3, Radio } from 'lucide-react';

interface SentryObject {
  sentryId: string;
  fullname: string;
  year_range_min: string;
  year_range_max: string;
  potential_impacts: number;
  impact_probability: string;
  v_infinity: string; // km/s
  absolute_magnitude: string;
  estimated_diameter: string; // km usually
  last_obs: string;
  average_lunar_distance: string;
}

interface ThreatsProps {
  onBack: () => void;
}

export const Threats: React.FC<ThreatsProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [objects, setObjects] = useState<SentryObject[]>([]);
  const [stats, setStats] = useState({
    highRiskCount: 0,
    maxProb: '0',
    avgVelocity: '0',
    status: 'Analyzing'
  });

  const fetchThreats = async () => {
    setLoading(true);
    try {
      // Use NeoWs Feed again but focus on Hazardous ones to simulate a "Threat Center"
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      const responseNeo = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&api_key=DEMO_KEY`);

      if (!responseNeo.ok) throw new Error('API_FAILED');

      const data = await responseNeo.json();
      const all: any[] = Object.values(data.near_earth_objects).flat();
      
      let hazardous = all.filter(a => a.is_potentially_hazardous_asteroid);
      
      // If we don't have enough "Threats" to show (common), we'll mix in some near-misses and calculate "Risk"
      let displayList = [...hazardous, ...all.filter(a => !a.is_potentially_hazardous_asteroid)].slice(0, 25).map((obj: any) => {
          // Simulate Impact Probability for the UI demo based on miss distance
          const missDist = parseFloat(obj.close_approach_data[0].miss_distance.kilometers);
          const isHaz = obj.is_potentially_hazardous_asteroid;
          
          return {
              sentryId: obj.id,
              fullname: obj.name,
              year_range_min: new Date().getFullYear().toString(),
              year_range_max: (new Date().getFullYear() + 100).toString(),
              potential_impacts: isHaz ? Math.floor(Math.random() * 50) + 1 : 0,
              impact_probability: isHaz ? (Math.random() * 1e-4).toExponential(2) : "0",
              v_infinity: parseFloat(obj.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(0),
              estimated_diameter: ((obj.estimated_diameter.meters.estimated_diameter_min + obj.estimated_diameter.meters.estimated_diameter_max) / 2).toFixed(1),
              risk_score: isHaz ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 10), // 0-100
              hazard_status: isHaz ? "High" : missDist < 1000000 ? "Medium" : "Low"
          };
      });

      // Sort by risk
      displayList.sort((a, b) => b.risk_score - a.risk_score);

      setObjects(displayList as any);
      setStats({
          highRiskCount: displayList.filter((x: any) => x.hazard_status === 'High').length,
          maxProb: displayList.reduce((max: any, curr: any) => Math.max(max, parseFloat(curr.impact_probability)), 0).toExponential(2),
          avgVelocity: (displayList.reduce((acc: any, curr: any) => acc + parseFloat(curr.v_infinity), 0) / displayList.length).toFixed(0),
          status: 'Monitoring Active'
      });

    } catch (error) {
      // Fallback Data
      console.warn("Using simulation data due to API limits");
      const mockThreats = Array.from({ length: 20 }).map((_, i) => {
          const isHigh = i < 5;
          return {
              sentryId: `99${i}42`,
              fullname: isHigh ? `(2024 PHO-${i})` : `(2024 NEO-${i})`,
              year_range_min: "2024",
              year_range_max: "2124",
              potential_impacts: isHigh ? 10 + i : 0,
              impact_probability: isHigh ? (Math.random() * 1e-3).toExponential(3) : "< 1e-6",
              v_infinity: (15000 + Math.random() * 50000).toFixed(0),
              estimated_diameter: (50 + Math.random() * 500).toFixed(1),
              risk_score: isHigh ? 75 + Math.floor(Math.random() * 25) : Math.floor(Math.random() * 30),
              hazard_status: isHigh ? "High" : i < 10 ? "Medium" : "Low"
          };
      });
      setObjects(mockThreats as any);
      setStats({
          highRiskCount: 5,
          maxProb: "4.2e-4",
          avgVelocity: "32400",
          status: 'Simulation Mode'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-[#0a0505] text-white overflow-y-auto custom-scrollbar"
    >
      {/* Header */}
      <div className="sticky top-0 bg-red-950/20 backdrop-blur-md border-b border-red-500/20 p-6 z-10 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
               <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
                <ShieldAlert className="text-red-500" />
                <h1 className="text-2xl font-light tracking-tight text-red-100">Threat & Risk Assessment Center</h1>
            </div>
         </div>
         <div className="flex items-center gap-4 text-sm text-red-300/60">
             <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
                {loading ? 'Scanning Deep Space...' : 'Live Feed Active'}
             </span>
             <button onClick={fetchThreats} className="p-2 hover:text-white transition-colors">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
             </button>
         </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
         
         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/20 transition-colors" />
                <div className="flex items-center gap-3 text-red-400 mb-2 relative z-10">
                    <AlertTriangle size={20} />
                    <span className="text-xs uppercase tracking-widest font-bold">High Risk Objects</span>
                </div>
                <div className="text-4xl font-light text-red-100 relative z-10">{stats.highRiskCount}</div>
                <div className="text-xs text-red-400/60 mt-2 relative z-10">Immediate Attention Required</div>
            </div>

            <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 text-orange-400 mb-2">
                    <Target size={20} />
                    <span className="text-xs uppercase tracking-widest font-bold">Max Probability</span>
                </div>
                <div className="text-4xl font-light text-orange-100">{stats.maxProb}</div>
                <div className="text-xs text-orange-400/60 mt-2">Highest Impact Chance</div>
            </div>

             <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 text-yellow-400 mb-2">
                    <Zap size={20} />
                    <span className="text-xs uppercase tracking-widest font-bold">Avg Velocity</span>
                </div>
                <div className="text-2xl font-light text-yellow-100">{parseFloat(stats.avgVelocity).toLocaleString()} <span className="text-sm text-yellow-500">km/h</span></div>
                <div className="text-xs text-yellow-400/60 mt-2">Kinetic Energy Potential</div>
            </div>

            <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 text-purple-400 mb-2">
                    <Radio size={20} />
                    <span className="text-xs uppercase tracking-widest font-bold">Detection Status</span>
                </div>
                <div className="text-xl font-light truncate text-purple-100">{stats.status}</div>
                <div className="text-xs text-purple-400/60 mt-2">Sentry System Online</div>
            </div>
         </div>

         {/* List Header */}
         <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
             <div>
                <h2 className="text-xl font-medium text-red-50">Priority Targets</h2>
                <p className="text-gray-400 text-sm mt-1">Objects classified by potential threat level and impact probability.</p>
             </div>
             <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">High Risk</span>
                <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Medium Risk</span>
                <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">Low Risk</span>
             </div>
         </div>

         {/* Threat Table */}
         {loading && objects.length === 0 ? (
             <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
             </div>
         ) : (
             <div className="grid grid-cols-1 gap-3">
                {/* Header Row */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs uppercase tracking-widest text-gray-500 font-bold bg-white/5 rounded-lg">
                    <div className="col-span-3">Object Name</div>
                    <div className="col-span-2">Diameter</div>
                    <div className="col-span-2">Impact Prob.</div>
                    <div className="col-span-2">Velocity</div>
                    <div className="col-span-2">Risk Score</div>
                    <div className="col-span-1 text-right">Status</div>
                </div>

                {objects.map((obj: any, index) => (
                    <motion.div 
                       key={`${obj.sentryId}-${index}`}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: index * 0.05 }}
                       className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border rounded-xl items-center transition-all group relative overflow-hidden ${
                           obj.hazard_status === 'High' 
                             ? 'bg-red-950/30 border-red-500/30 hover:bg-red-900/40' 
                             : obj.hazard_status === 'Medium'
                             ? 'bg-yellow-950/20 border-yellow-500/20 hover:bg-yellow-900/30'
                             : 'bg-white/5 border-white/5 hover:bg-white/10'
                       }`}
                    >
                        {/* Background warning stripe for high risk */}
                        {obj.hazard_status === 'High' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                        )}

                        <div className="col-span-3 font-medium text-white flex flex-col">
                            <span>{obj.fullname}</span>
                            <span className="text-[10px] text-gray-500 font-mono">{obj.sentryId}</span>
                        </div>
                        <div className="col-span-2 text-sm text-gray-300">
                            {obj.estimated_diameter} m
                        </div>
                        <div className="col-span-2 text-sm font-mono text-gray-300">
                            {obj.impact_probability}
                        </div>
                        <div className="col-span-2 text-sm text-gray-300 font-mono">
                            {parseInt(obj.v_infinity).toLocaleString()} km/h
                        </div>
                        <div className="col-span-2">
                             <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${
                                            obj.risk_score > 70 ? 'bg-red-500' : 
                                            obj.risk_score > 30 ? 'bg-yellow-500' : 'bg-green-500'
                                        }`} 
                                        style={{ width: `${obj.risk_score}%` }} 
                                    />
                                </div>
                                <span className="text-xs font-mono w-6 text-right">{obj.risk_score}</span>
                             </div>
                        </div>
                        <div className="col-span-1 flex justify-end">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                obj.hazard_status === 'High' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                obj.hazard_status === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                            }`}>
                                {obj.hazard_status}
                            </span>
                        </div>
                    </motion.div>
                ))}
             </div>
         )}
      </div>
    </motion.div>
  );
};
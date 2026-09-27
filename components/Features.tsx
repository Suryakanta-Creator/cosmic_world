import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const features = [
  {
    id: 1,
    name: 'C-Type',
    description: 'The most common variety (chondrite), consisting of clay and silicate rocks. These ancient, dark, carbon-rich objects date back to the very dawn of the solar system.',
    visual: 'c-type'
  },
  {
    id: 2,
    name: 'S-Type',
    description: 'Stony (silicaceous) asteroids made up of silicate materials and nickel-iron. They dominate the inner asteroid belt and are brighter than their carbon counterparts.',
    visual: 's-type'
  },
  {
    id: 3,
    name: 'M-Type',
    description: 'Metallic asteroids primarily composed of nickel-iron. These rare, shiny objects are thought to be the exposed cores of fragmented protoplanets that formed early in history.',
    visual: 'm-type'
  },
  {
    id: 4,
    name: 'NEOs',
    description: 'Near-Earth Objects: Comets and asteroids nudged by gravitational attraction into orbits that allow them to enter Earth\'s neighborhood, posing potential risks and research opportunities.',
    visual: 'neos'
  }
];

export const Features: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section className="min-h-screen py-24 relative overflow-hidden flex items-center bg-transparent">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between relative z-10">
        
        {/* Left Navigation */}
        <div className="w-full md:w-1/4 mb-12 md:mb-0">
          <div className="space-y-8">
            {features.map((feature) => (
              <div 
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                className={`cursor-pointer transition-all duration-300 group flex items-baseline gap-4 text-3xl md:text-5xl font-light ${activeFeature.id === feature.id ? 'text-white opacity-100 scale-105 origin-left' : 'text-gray-400 hover:text-gray-300'}`}
              >
                <span className="text-sm font-bold tracking-widest align-top mt-2 block">{feature.id}</span>
                <span>{feature.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Visual */}
        <div className="w-full md:w-2/4 flex justify-center items-center h-[400px] md:h-[600px] relative perspective-1000">
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center"
            >
               {/* 1. C-Type: Dark Particle Sphere (Carbon) */}
               {activeFeature.visual === 'c-type' && (
                  <div className="relative w-full h-full animate-[spin_30s_linear_infinite]">
                     {Array.from({ length: 120 }).map((_, i) => {
                        const theta = Math.random() * 2 * Math.PI;
                        const phi = Math.acos(2 * Math.random() - 1);
                        const r = 120; // radius
                        const x = r * Math.sin(phi) * Math.cos(theta);
                        const y = r * Math.sin(phi) * Math.sin(theta);
                        const z = r * Math.cos(phi);
                        return (
                          <div 
                             key={i} 
                             className="absolute rounded-full bg-neutral-800"
                             style={{
                                width: Math.random() * 15 + 5 + 'px',
                                height: Math.random() * 15 + 5 + 'px',
                                transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                                boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.8)'
                             }} 
                          />
                        )
                     })}
                     <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
                  </div>
               )}

               {/* 2. S-Type: Jagged Rocky Asteroid (Silicaceous) */}
               {activeFeature.visual === 's-type' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                     <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_20s_linear_infinite] drop-shadow-[0_0_15px_rgba(200,200,200,0.1)]">
                        <defs>
                          <radialGradient id="rockGradient" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#a8a29e" />
                            <stop offset="100%" stopColor="#44403c" />
                          </radialGradient>
                          <filter id="roughness">
                            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                            <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2">
                              <feDistantLight azimuth="45" elevation="60" />
                            </feDiffuseLighting>
                          </filter>
                        </defs>
                        <path 
                          d="M100,20 L140,40 L175,60 L185,110 L150,160 L100,180 L50,160 L15,110 L25,60 L60,30 Z" 
                          fill="url(#rockGradient)" 
                          filter="url(#roughness)"
                          stroke="#292524"
                          strokeWidth="1"
                        />
                     </svg>
                  </div>
               )}

               {/* 3. M-Type: Metallic Sphere (Nickel-Iron) */}
               {activeFeature.visual === 'm-type' && (
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full relative overflow-hidden animate-[pulse_4s_ease-in-out_infinite]"
                       style={{
                           background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #9ca3af 20%, #4b5563 50%, #1f2937 100%)',
                           boxShadow: '0 0 50px rgba(255, 255, 255, 0.1), inset -20px -20px 50px rgba(0,0,0,0.5)'
                       }}
                  >
                     {/* Specular highlights moving across */}
                     <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 animate-[shimmer_3s_infinite_linear]" />
                     <style>{`
                       @keyframes shimmer {
                         0% { left: -100%; }
                         100% { left: 200%; }
                       }
                     `}</style>
                  </div>
               )}

               {/* 4. NEOs: Orbit Animation */}
               {activeFeature.visual === 'neos' && (
                   <div className="w-full h-full relative flex items-center justify-center">
                      {/* Earth */}
                      <div className="w-24 h-24 rounded-full bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.5)] relative z-10 overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.4),_transparent)]" />
                         {/* Continents approximation */}
                         <div className="absolute top-4 left-6 w-8 h-10 bg-green-500/50 rounded-full blur-[2px]" />
                         <div className="absolute bottom-6 right-6 w-10 h-8 bg-green-500/50 rounded-full blur-[2px]" />
                      </div>
                      
                      {/* Orbit Path 1 */}
                      <div className="absolute w-[120%] h-[60%] border border-dashed border-white/20 rounded-[50%] rotate-[-15deg]" />
                      
                      {/* Orbit Path 2 (Crossing) */}
                      <div className="absolute w-[60%] h-[120%] border border-dashed border-red-500/30 rounded-[50%] rotate-[15deg]" />

                      {/* Moving Asteroid */}
                      <div className="absolute w-[120%] h-[60%] rounded-[50%] rotate-[-15deg] animate-[spin_6s_linear_infinite]">
                         <div className="absolute top-1/2 right-0 w-6 h-6 bg-gray-400 rounded-full shadow-lg translate-x-1/2 -translate-y-1/2" />
                      </div>

                       {/* Danger Asteroid */}
                      <div className="absolute w-[60%] h-[120%] rounded-[50%] rotate-[15deg] animate-[spin_8s_linear_infinite_reverse]">
                         <div className="absolute top-0 left-1/2 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_red] -translate-x-1/2 -translate-y-1/2" />
                      </div>
                   </div>
               )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Description */}
        <div className="w-full md:w-1/4 relative">
          <div className="absolute -top-20 right-0">
             <Star className="w-8 h-8 text-white stroke-[0.5]" />
          </div>
          <motion.div
             key={activeFeature.id}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5 }}
          >
             <h3 className="text-xl text-white font-medium mb-4">{activeFeature.name} Asteroids</h3>
             <p className="text-gray-300 text-lg leading-relaxed">
               {activeFeature.description}
             </p>
             <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest">
               Classifying the building blocks of our solar system
             </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
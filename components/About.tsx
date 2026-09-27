import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

interface AboutProps {
  onOpenAsteroidPage?: () => void;
  onOpenThreatsPage?: () => void;
  onOpenProximityPage?: () => void;
  onOpenMonitoringPage?: () => void;
}

const aboutItems = [
  {
    id: 1,
    title: "Global Asteroids Overview",
    description: "Real-time tracking and visualization of near-Earth objects, providing comprehensive data on their composition and orbits.",
  },
  {
    id: 2,
    title: "Threat & Risk Assessment Center",
    description: "Advanced algorithmic analysis to evaluate potential impact risks and classify hazardous space objects.",
  },
  {
    id: 3,
    title: "Proximity & Trajectory Tracker",
    description: "Precise monitoring of celestial paths to predict close approaches and ensure planetary safety.",
  },
  {
    id: 4,
    title: "User Monitoring & Alert System",
    description: "Personalized notification services keeping you informed about significant astronomical events and potential threats.",
  }
];

export const About: React.FC<AboutProps> = ({ onOpenAsteroidPage, onOpenThreatsPage, onOpenProximityPage, onOpenMonitoringPage }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="dashboard" className="py-24 bg-transparent text-white relative overflow-hidden">
       {/* Top Star */}
       <div className="absolute top-10 right-10">
          <Star className="text-white w-12 h-12 stroke-[0.5]" />
       </div>

      <div className="container mx-auto px-6 md:px-12 mb-16">
        <h2 className="text-6xl md:text-8xl font-light tracking-tight">DASHBOARD</h2>
      </div>

      <div className="container mx-auto px-6 md:px-12 h-[500px] flex gap-4 md:gap-0 flex-col md:flex-row">
        {aboutItems.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <motion.div
              key={item.id}
              className={`relative flex flex-col justify-between p-8 border-l border-white/10 first:border-l-0 cursor-pointer overflow-hidden transition-colors duration-500 ease-in-out ${isActive ? 'bg-white text-black' : 'bg-black/20 text-white'}`}
              onMouseEnter={() => setActiveIndex(index)}
              initial={false}
              animate={{ flex: isActive ? 2 : 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h3 className="text-2xl font-medium max-w-[200px] leading-snug z-10">
                {item.title}
              </h3>

              <div className="mt-auto relative z-10">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm mb-8 text-gray-600 leading-relaxed max-w-sm">
                        {item.description}
                      </p>
                      
                      {/* Interactive Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent parent container logic
                          if (item.id === 1 && onOpenAsteroidPage) {
                             onOpenAsteroidPage();
                          } else if (item.id === 2 && onOpenThreatsPage) {
                             onOpenThreatsPage();
                          } else if (item.id === 3 && onOpenProximityPage) {
                             onOpenProximityPage();
                          } else if (item.id === 4 && onOpenMonitoringPage) {
                             onOpenMonitoringPage();
                          }
                        }}
                        className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform hover:bg-gray-800"
                      >
                         <ArrowRight size={20} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="w-4 h-4 rounded-full border border-white/30"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative Blur for Active Card */}
               {isActive && (
                 <motion.div 
                    className="absolute -bottom-20 -right-20 w-64 h-64 bg-gray-200 rounded-full blur-3xl z-0 pointer-events-none" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                 />
               )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
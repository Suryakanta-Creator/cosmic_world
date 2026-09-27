import React, { useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

// Added direction prop to control entrance side
const FloatingChar = ({ char, delayOffset, direction = 'random' }: { char: string, delayOffset: number, direction?: 'left' | 'right' | 'random' }) => {
    // Generate random starting values based on direction
    const randomValues = useMemo(() => {
        let xRange = 0;
        
        // Determine X start position based on direction
        if (direction === 'left') {
            // Arrive from Left (Negative X)
            xRange = -200 - Math.random() * 600; 
        } else if (direction === 'right') {
            // Arrive from Right (Positive X)
            xRange = 200 + Math.random() * 600;
        } else {
            // Random scatter
            xRange = (Math.random() - 0.5) * 800;
        }

        return {
            x: xRange,
            y: (Math.random() - 0.5) * 500, // Vertical scatter for "floating" feel
            z: (Math.random() - 0.5) * 300, // Depth scatter
            rotate: (Math.random() - 0.5) * 120, // Random rotation
            scale: 1.2 + Math.random(), // Slight scale variation
        };
    }, [direction]);

    return (
        <motion.span
            initial={{ 
                opacity: 0, 
                x: randomValues.x, 
                y: randomValues.y, 
                rotate: randomValues.rotate, 
                scale: randomValues.scale,
                filter: "blur(15px)"
            }}
            animate={{ 
                opacity: 1, 
                x: 0, 
                y: 0, 
                rotate: 0, 
                scale: 1,
                filter: "blur(0px)"
            }}
            transition={{
                duration: 2.5,
                delay: delayOffset + Math.random() * 0.5, // Organic staggered arrival
                ease: [0.16, 1, 0.3, 1] // Apple-like easeOut
            }}
            className="inline-block origin-center"
        >
            {char}
        </motion.span>
    );
};

// Added direction prop to FloatingText
const FloatingText = ({ text, className, delayOffset = 0, direction = 'random' }: { text: string, className?: string, delayOffset?: number, direction?: 'left' | 'right' | 'random' }) => {
    const words = text.split(" ");
    return (
        <h1 className={`flex flex-wrap justify-center gap-x-[0.25em] ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="whitespace-nowrap inline-block">
                    {Array.from(word).map((char, j) => (
                        <FloatingChar 
                            key={`${i}-${j}`} 
                            char={char} 
                            delayOffset={delayOffset} 
                            direction={direction} 
                        />
                    ))}
                </span>
            ))}
        </h1>
    );
};

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const [isHovered, setIsHovered] = useState(false);

  const handleScrollToExplore = () => {
    const dashboardElement = document.getElementById('dashboard');
    if (dashboardElement) {
      dashboardElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-transparent perspective-[1000px]">
      
      {/* Blur Overlay when Hovered - Focus effect */}
      <AnimatePresence>
        {isHovered && (
            <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-40 bg-black/40 pointer-events-none"
            />
        )}
      </AnimatePresence>

      {/* ------------------ CONTENT ------------------ */}
      <div className="container mx-auto px-6 md:px-12 relative z-30 w-full h-full flex flex-col justify-center">
         
         <div className="flex flex-col justify-center items-center w-full h-full pt-20">
            
            {/* Center Text with Floating Animation */}
            <motion.div 
                style={{ y: yText }} 
                className={`flex flex-col items-center text-center z-20 transition-all duration-500 ${isHovered ? 'blur-sm scale-95 opacity-50' : ''}`}
            >
                <FloatingText 
                    text="WELCOME" 
                    direction="left" 
                    className="text-[12vw] lg:text-[9rem] font-light leading-[0.85] tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-2"
                    delayOffset={0.1}
                />
                
                <FloatingText 
                    text="TO THE VOID" 
                    direction="right"
                    className="text-[8vw] lg:text-[6rem] font-light leading-[0.9] tracking-tighter text-gray-200 blur-[0.5px] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    delayOffset={0.8}
                />
            </motion.div>
            
            {/* Scroll Button (Enhanced) */}
            <motion.div
                className="absolute bottom-20 z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.5 }}
            >
                <button 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleScrollToExplore}
                    className={`
                        relative group cursor-pointer border-none outline-none
                        flex items-center gap-6 px-8 py-4 
                        transition-all duration-500 ease-out
                        ${isHovered ? 'scale-110' : 'scale-100'}
                    `}
                >
                    {/* Glowing Background (Active on Hover) */}
                    <div className={`
                        absolute inset-0 rounded-full bg-white/5 border border-white/10 
                        backdrop-blur-md transition-all duration-500
                        ${isHovered ? 'opacity-100 shadow-[0_0_40px_rgba(255,255,255,0.3),inset_0_0_20px_rgba(255,255,255,0.2)] border-white/40' : 'opacity-0 border-transparent'}
                    `} />
                    
                    {/* Left Line */}
                    <div className={`
                        h-[1px] bg-gradient-to-r from-transparent via-white to-transparent 
                        transition-all duration-500 relative z-10
                        ${isHovered ? 'w-12 opacity-100 shadow-[0_0_10px_white]' : 'w-8 opacity-50'}
                    `} />

                    {/* Text */}
                    <p className={`
                        text-sm uppercase tracking-[0.3em] font-medium relative z-10
                        transition-all duration-500 flex items-center gap-3
                        ${isHovered ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-gray-400'}
                    `}>
                        Scroll to explore
                        <ArrowDown size={16} className={`
                            transition-all duration-500 
                            ${isHovered ? 'opacity-100 translate-y-1 drop-shadow-[0_0_5px_white]' : 'opacity-0 -translate-y-2'}
                        `} />
                    </p>

                    {/* Right Line */}
                    <div className={`
                        h-[1px] bg-gradient-to-r from-transparent via-white to-transparent 
                        transition-all duration-500 relative z-10
                        ${isHovered ? 'w-12 opacity-100 shadow-[0_0_10px_white]' : 'w-8 opacity-50'}
                    `} />
                </button>
            </motion.div>

         </div>

      </div>

    </section>
  );
};
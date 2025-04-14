
import React from 'react';
import GameContainer from '@/components/GameContainer';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              backgroundColor: i % 5 === 0 ? '#A6E1FA' : 
                               i % 5 === 1 ? '#0CA5E9' : 
                               i % 5 === 2 ? '#F97316' : 
                               i % 5 === 3 ? '#8B5CF6' : 
                               '#10B981',
              width: `${Math.random() * 120 + 40}px`,
              height: `${Math.random() * 120 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -150 - 50],
              opacity: [0.2, 0],
              scale: [1, 0.8]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          />
        ))}
        
        {/* Light rays */}
        <motion.div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[70vh] opacity-50 dark:opacity-10"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
          }}
          animate={{
            opacity: [0.5, 0.3, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
      </div>
      
      <GameContainer />
    </div>
  );
};

export default Index;

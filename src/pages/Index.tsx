
import React from 'react';
import GameContainer from '@/components/GameContainer';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8 relative overflow-hidden">
      {/* Enhanced background animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              backgroundColor: i % 4 === 0 ? '#A6E1FA' : i % 4 === 1 ? '#0CA5E9' : i % 4 === 2 ? '#F97316' : '#8B5CF6',
              width: `${Math.random() * 120 + 40}px`,
              height: `${Math.random() * 120 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -120 - 50],
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
      </div>
      
      <GameContainer />
    </div>
  );
};

export default Index;

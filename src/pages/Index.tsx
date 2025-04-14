
import React, { useState, useEffect } from 'react';
import GameContainer from '@/components/GameContainer';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

const Index = () => {
  // State for animated elements
  const [showEnterAnimation, setShowEnterAnimation] = useState(true);
  
  // Hide animation after it completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnterAnimation(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              backgroundColor: i % 6 === 0 ? '#A6E1FA' : 
                               i % 6 === 1 ? '#0CA5E9' : 
                               i % 6 === 2 ? '#F97316' : 
                               i % 6 === 3 ? '#8B5CF6' : 
                               i % 6 === 4 ? '#10B981' :
                               '#EC4899',
              width: `${Math.random() * 150 + 40}px`,
              height: `${Math.random() * 150 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(5px)',
            }}
            animate={{
              y: [0, Math.random() * -200 - 50],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0.2, 0],
              scale: [1, 0.8]
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          />
        ))}
        
        {/* Glowing orbs in the background */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-30 bg-gradient-radial blur-xl"
            style={{
              background: i % 3 === 0 ? 'rgba(124, 58, 237, 0.5)' : 
                    i % 3 === 1 ? 'rgba(236, 72, 153, 0.5)' : 
                    'rgba(6, 182, 212, 0.5)',
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Light rays */}
        <motion.div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[80vh] opacity-60 dark:opacity-15"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
          }}
          animate={{
            opacity: [0.6, 0.4, 0.6],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" 
             style={{ backgroundSize: '30px 30px' }}
        />
      </div>
      
      {/* Entry animation overlay */}
      {showEnterAnimation && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-primary to-violet-800 z-30 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 1.2 }}
          >
            <div className="relative">
              <Sparkles className="h-24 w-24 text-white opacity-90" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                }}
              >
                <Zap className="h-10 w-10 text-yellow-300" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <GameContainer />
    </div>
  );
};

export default Index;

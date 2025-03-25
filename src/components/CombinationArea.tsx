
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Element from './Element';
import ElementParticle from './ElementParticle';
import { Element as ElementType } from '@/utils/elementData';
import { getElementByID } from '@/utils/gameLogic';
import { GameState } from '@/utils/gameLogic';
import { Sparkles, Zap, ArrowDown } from 'lucide-react';

interface CombinationAreaProps {
  gameState: GameState;
  onRemoveElement: (elementId: string) => void;
  onCombine: () => void;
}

// Default empty game state
const defaultGameState: GameState = {
  elements: [],
  discoveries: [],
  combiningElements: [null, null],
  level: 1,
  score: 0,
  successfulCombosInARow: 0,
  lastCombinationSuccess: null,
  viewedElementDetails: null
};

const CombinationArea: React.FC<CombinationAreaProps> = ({
  gameState = defaultGameState,
  onRemoveElement,
  onCombine,
}) => {
  // Add default value to handle undefined gameState
  const combiningElements = gameState?.combiningElements || [null, null];
  const [element1, element2] = combiningElements;
  
  const elementObj1 = element1 && gameState ? getElementByID(gameState, element1) : null;
  const elementObj2 = element2 && gameState ? getElementByID(gameState, element2) : null;
  
  const [combining, setCombining] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; success: boolean; size: 'small' | 'medium' | 'large' }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Show instructions initially but hide after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCombine = () => {
    if (element1 && element2) {
      setCombining(true);
      setShowParticles(true);
      setIsAnimating(true);
      
      // Create particles with improved visual effects
      if (containerRef.current && elementObj1 && elementObj2) {
        const centerX = containerRef.current.offsetWidth / 2;
        const centerY = containerRef.current.offsetHeight / 2;
        
        // Create a variety of particles with different sizes
        const newParticles = [
          // Small particles (more numerous)
          ...Array.from({ length: 25 }, (_, i) => ({
            id: i,
            x: centerX,
            y: centerY,
            color: i % 2 === 0 ? elementObj1.color : elementObj2.color,
            success: true,
            size: 'small' as const
          })),
          // Medium particles
          ...Array.from({ length: 18 }, (_, i) => ({
            id: i + 25,
            x: centerX,
            y: centerY,
            color: i % 2 === 0 ? elementObj1.color : elementObj2.color,
            success: true,
            size: 'medium' as const
          })),
          // Large particles (fewer)
          ...Array.from({ length: 8 }, (_, i) => ({
            id: i + 43,
            x: centerX,
            y: centerY,
            color: i % 2 === 0 ? elementObj1.color : elementObj2.color,
            success: true,
            size: 'large' as const
          }))
        ];
        
        setParticles(newParticles);
      }
      
      // Hide particles after animation and call the combine callback
      setTimeout(() => {
        setShowParticles(false);
        setCombining(false);
        setIsAnimating(false);
        onCombine();
      }, 1200);
    }
  };

  const bothElementsSelected = element1 !== null && element2 !== null;

  // Reset hint timeout when elements change
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((element1 && !element2) || (!element1 && element2)) {
        setShowHint(true);
      } else {
        setShowHint(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [element1, element2]);

  // Handle drag over effects
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "combination-area h-36 sm:h-40 md:h-48 relative rounded-xl border-2 border-dashed transition-all overflow-hidden",
        dropZoneActive ? "border-primary/70 bg-primary/10" : "border-gray-300/50 bg-white/10 dark:bg-slate-800/10",
        combining ? "animate-pulse-soft" : ""
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={() => setDropZoneActive(false)}
    >
      {/* Improved background glow effect when active */}
      {dropZoneActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 animate-pulse-soft" />
      )}

      {/* Initial instructions overlay */}
      <AnimatePresence>
        {showInstructions && !element1 && !element2 && (
          <motion.div 
            className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-white font-medium mb-2">Drag elements here to combine</p>
            <ArrowDown className="text-white animate-bounce" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-around w-full relative h-full">
        {/* First element slot */}
        <AnimatePresence mode="wait">
          {elementObj1 ? (
            <motion.div
              key="element1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(isAnimating ? "animate-pulse-soft" : "", "relative")}
            >
              <div className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs cursor-pointer z-10"
                 onClick={() => onRemoveElement(element1)}
              >
                ×
              </div>
              <Element
                element={elementObj1}
                onClick={() => onRemoveElement(element1)}
                size="lg"
                isDraggable={false}
                glow={combining}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty1"
              className={cn(
                "w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400",
                dropZoneActive && "border-primary/50 bg-primary/5"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-3xl">+</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced connection line between elements */}
        {bothElementsSelected && (
          <motion.div 
            className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent z-0"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
          />
        )}

        {/* Plus sign */}
        <div className="mx-4 text-2xl font-bold text-gray-400 z-10 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">+</div>

        {/* Second element slot */}
        <AnimatePresence mode="wait">
          {elementObj2 ? (
            <motion.div
              key="element2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(isAnimating ? "animate-pulse-soft" : "", "relative")}
            >
              <div className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs cursor-pointer z-10"
                 onClick={() => onRemoveElement(element2)}
              >
                ×
              </div>
              <Element
                element={elementObj2}
                onClick={() => onRemoveElement(element2)}
                size="lg"
                isDraggable={false}
                glow={combining}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty2"
              className={cn(
                "w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400",
                dropZoneActive && "border-primary/50 bg-primary/5"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-3xl">+</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Improved combine button */}
        <AnimatePresence>
          {bothElementsSelected && !combining && (
            <motion.button
              className="absolute -bottom-5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              onClick={handleCombine}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={16} className="animate-pulse" />
              <span>Combine</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Enhanced reaction effect */}
        {combining && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Zap 
              className="text-yellow-400 animate-pulse z-10" 
              size={50} 
              strokeWidth={3} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-pulse"></div>
          </motion.div>
        )}

        {/* Improved hint message */}
        <AnimatePresence>
          {showHint && !bothElementsSelected && (
            <motion.div
              className="absolute -bottom-10 text-sm text-white px-4 py-2 bg-primary/70 backdrop-blur-sm rounded-full shadow-lg"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              Drag another element here to combine
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particles */}
        {showParticles && (
          <>
            {particles.map(particle => (
              <ElementParticle
                key={particle.id}
                color={particle.color}
                posX={particle.x}
                posY={particle.y}
                success={particle.success}
                size={particle.size}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CombinationArea;

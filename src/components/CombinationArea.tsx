
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Element from './Element';
import ElementParticle from './ElementParticle';
import { Element as ElementType } from '@/utils/elementData';
import { getElementByID } from '@/utils/gameLogic';
import { GameState } from '@/utils/gameLogic';
import { Sparkles, Zap, ArrowDown, Plus, XCircle, Lightbulb } from 'lucide-react';

interface CombinationAreaProps {
  gameState: GameState;
  onRemoveElement: (elementId: string) => void;
  onCombine: () => void;
}

// Default empty game state with all required properties
const defaultGameState: GameState = {
  elements: [],
  discoveries: [],
  combiningElements: [null, null],
  level: 1,
  score: 0,
  successfulCombosInARow: 0,
  lastCombinationSuccess: null,
  viewedElementDetails: null,
  combinationCounts: {},
  favorites: [],
  currentComboChain: 0,
  maxComboChain: 0,
  elementPowers: {},
  comboMultiplier: 1,
  totalPowerGained: 0
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
  const [showPulse, setShowPulse] = useState(false);

  // Show instructions initially but hide after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Add a pulsing effect when both elements are selected
  useEffect(() => {
    if (element1 && element2) {
      setShowPulse(true);
      const timer = setTimeout(() => {
        setShowPulse(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [element1, element2]);

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
          ...Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: centerX,
            y: centerY,
            color: i % 2 === 0 ? elementObj1.color : elementObj2.color,
            success: true,
            size: 'small' as const
          })),
          // Medium particles
          ...Array.from({ length: 20 }, (_, i) => ({
            id: i + 30,
            x: centerX,
            y: centerY,
            color: i % 2 === 0 ? elementObj1.color : elementObj2.color,
            success: true,
            size: 'medium' as const
          })),
          // Large particles (fewer)
          ...Array.from({ length: 10 }, (_, i) => ({
            id: i + 50,
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
        "combination-area h-40 sm:h-44 md:h-52 relative rounded-xl border-2 border-dashed transition-all overflow-hidden",
        dropZoneActive ? "border-primary/70 bg-primary/10" : "border-gray-300/50 dark:border-gray-600/50 bg-white/10 dark:bg-slate-800/10",
        combining ? "animate-pulse-soft" : "",
        bothElementsSelected && showPulse ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background" : ""
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={() => setDropZoneActive(false)}
    >
      {/* Enhanced background glow effect when active */}
      {dropZoneActive && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse-soft"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Initial instructions overlay with improved visuals */}
      <AnimatePresence>
        {showInstructions && !element1 && !element2 && (
          <motion.div 
            className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white/20 dark:bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white font-medium mb-2 flex items-center justify-center">
                <Lightbulb size={16} className="mr-2 text-yellow-300" />
                Drag elements here to combine
              </p>
              <ArrowDown className="text-white animate-bounce mx-auto" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-around w-full relative h-full">
        {/* First element slot with improved visuals */}
        <AnimatePresence mode="wait">
          {elementObj1 ? (
            <motion.div
              key="element1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                isAnimating ? "animate-pulse-soft" : "", 
                "relative rounded-xl p-1 group"
              )}
            >
              <motion.div 
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full 
                          flex items-center justify-center text-xs cursor-pointer z-10
                          hover:bg-red-600 transition-colors shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemoveElement(element1)}
              >
                <XCircle size={14} />
              </motion.div>
              <div className="relative">
                <Element
                  element={elementObj1}
                  onClick={() => {}}
                  size="lg"
                  isDraggable={false}
                  glow={combining}
                />
                {!element2 && (
                  <motion.div 
                    className="absolute -right-4 top-1/2 -translate-y-1/2 text-primary animate-bounce"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Plus size={18} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty1"
              className={cn(
                "w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center",
                dropZoneActive 
                  ? "border-primary/70 bg-primary/10 text-primary" 
                  : "border-gray-300/50 dark:border-gray-600/50 text-gray-400 dark:text-gray-500"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
            >
              <Plus size={24} className={dropZoneActive ? "animate-pulse" : ""} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced connection line between elements */}
        <AnimatePresence>
          {bothElementsSelected && (
            <motion.div 
              className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary/80 to-transparent z-0"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {/* Plus sign with improved styling */}
        <div className={cn(
          "mx-4 text-2xl font-bold z-10 rounded-full w-8 h-8 flex items-center justify-center",
          "transition-colors duration-300",
          bothElementsSelected 
            ? "bg-primary/20 text-primary" 
            : "bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm text-gray-400 dark:text-gray-500"
        )}>
          <Plus size={20} className={bothElementsSelected ? "animate-pulse" : ""} />
        </div>

        {/* Second element slot with improved visuals */}
        <AnimatePresence mode="wait">
          {elementObj2 ? (
            <motion.div
              key="element2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                isAnimating ? "animate-pulse-soft" : "", 
                "relative rounded-xl p-1 group"
              )}
            >
              <motion.div 
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full 
                          flex items-center justify-center text-xs cursor-pointer z-10
                          hover:bg-red-600 transition-colors shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemoveElement(element2)}
              >
                <XCircle size={14} />
              </motion.div>
              <Element
                element={elementObj2}
                onClick={() => {}}
                size="lg"
                isDraggable={false}
                glow={combining}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty2"
              className={cn(
                "w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center",
                dropZoneActive 
                  ? "border-primary/70 bg-primary/10 text-primary" 
                  : "border-gray-300/50 dark:border-gray-600/50 text-gray-400 dark:text-gray-500"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
            >
              <Plus size={24} className={dropZoneActive ? "animate-pulse" : ""} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Improved combine button with animation */}
        <AnimatePresence>
          {bothElementsSelected && !combining && (
            <motion.button
              className="absolute -bottom-6 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground 
                        font-medium py-2 px-8 rounded-full shadow-lg hover:shadow-xl transition-all 
                        flex items-center gap-2 border border-primary/20"
              onClick={handleCombine}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={16} className="animate-pulse" />
              <span>Combine</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Enhanced reaction effect */}
        <AnimatePresence>
          {combining && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1.5, 1], rotate: [0, 45, 0] }}
                transition={{ duration: 0.6 }}
              >
                <Zap 
                  className="text-yellow-400 animate-pulse z-10" 
                  size={60} 
                  strokeWidth={2} 
                />
              </motion.div>
              <motion.div 
                className="absolute inset-0 bg-gradient-radial from-yellow-400/30 to-transparent animate-pulse"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{ duration: 1 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Improved hint message */}
        <AnimatePresence>
          {showHint && !bothElementsSelected && (
            <motion.div
              className="absolute -bottom-10 text-sm text-white px-4 py-2 bg-primary/80 backdrop-blur-sm rounded-full shadow-lg flex items-center"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Lightbulb size={14} className="mr-2 text-yellow-300 animate-pulse" />
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

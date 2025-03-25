import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Element as ElementType } from '@/utils/elementData';

interface ElementProps {
  element: ElementType;
  onClick?: () => void;
  onFavorite?: () => void;
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isDraggable?: boolean;
  className?: string;
  onDragEnd?: (info: any) => void;
  combineZoneRef?: React.RefObject<HTMLDivElement>;
  glow?: boolean;
  isFavorite?: boolean;
  usageCount?: number;
  powerLevel?: number;
}

const Element: React.FC<ElementProps> = ({
  element,
  onClick,
  onFavorite,
  isSelected = false,
  size = 'md',
  isDraggable = true,
  className,
  onDragEnd,
  combineZoneRef,
  glow = false,
  isFavorite = false,
  usageCount = 0,
  powerLevel = 0
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Reset drag state when component remounts
  useEffect(() => {
    setHasBeenDragged(false);
  }, [element.id]);
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-xl',
    lg: 'w-20 h-20 text-2xl',
  };

  const variants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
    selected: { 
      scale: 1.1, 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
      borderWidth: '2px',
      borderColor: 'rgba(255, 255, 255, 0.5)'
    },
    drag: { 
      scale: 1.15, 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
      zIndex: 50
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setShowLabel(false);
    setHasBeenDragged(true);
    
    // Create a custom cursor effect
    if (elementRef.current) {
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleDragEnd = (info: any) => {
    setIsDragging(false);
    setShowLabel(true);
    document.body.style.cursor = 'default';
    
    // Check if element was dropped in the combination area
    if (combineZoneRef && combineZoneRef.current && info && info.point) {
      const combineRect = combineZoneRef.current.getBoundingClientRect();
      const { clientX, clientY } = info.point;
      
      if (
        clientX >= combineRect.left &&
        clientX <= combineRect.right &&
        clientY >= combineRect.top &&
        clientY <= combineRect.bottom
      ) {
        if (onDragEnd) {
          onDragEnd(info);
        } else {
          onClick();
        }
      }
    } else if (onDragEnd) {
      onDragEnd(info);
    } else if (hasBeenDragged) {
      // Fallback to onClick if dragging fails but only if it has been dragged
      // This prevents accidental clicks when the user is just clicking on an element
      onClick();
    }
  };

  // Determine border and background colors based on element's category
  const getCategoryStyles = () => {
    switch (element.category) {
      case 'basic':
        return 'border-primary/70';
      case 'compound':
        return 'border-green-500/70';
      case 'advanced':
        return 'border-purple-500/70';
      case 'rare':
        return 'border-amber-500/70';
      case 'scientific':
        return 'border-blue-500/70';
      default:
        return 'border-gray-500/70';
    }
  };

  return (
    <div 
      className={cn("flex flex-col items-center", isDragging ? "z-50" : "")}
      ref={elementRef}
    >
      <motion.div
        className={cn(
          'element-card rounded-lg border-2 flex items-center justify-center cursor-pointer',
          sizeClasses[size],
          isDragging ? "z-50" : "",
          glow && "animate-pulse shadow-lg",
          getCategoryStyles(),
          element.rarity === 'legendary' ? 'border-yellow-400/90 dark:border-yellow-300/90' : '',
          className
        )}
        style={{
          backgroundColor: `${element.color}40`, // Adding transparency
          boxShadow: glow ? `0 0 15px ${element.color}80` : undefined,
        }}
        variants={variants}
        initial="idle"
        animate={isDragging ? "drag" : isSelected ? 'selected' : 'idle'}
        whileHover={!isDragging ? "hover" : undefined}
        whileTap={{ scale: 0.95 }}
        onClick={!isDraggable && !isDragging ? onClick : undefined}
        drag={isDraggable}
        dragConstraints={isDraggable ? { left: 0, right: 0, top: 0, bottom: 0 } : false}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <span className="text-2xl pointer-events-none select-none">{element.symbol}</span>
        
        {/* Element atomic number for scientific elements */}
        {element.category === 'scientific' && element.atomicNumber && (
          <span className="absolute top-0.5 left-1.5 text-xs font-mono opacity-70">
            {element.atomicNumber}
          </span>
        )}
        
        {/* Add a subtle glow effect */}
        {(glow || isSelected || element.rarity === 'legendary') && (
          <motion.div 
            className={cn(
              "absolute inset-0 rounded-lg",
              element.rarity === 'legendary' ? "animate-pulse-soft" : ""
            )}
            style={{ 
              background: `radial-gradient(circle, ${element.color}30 0%, transparent 70%)`,
              zIndex: -1 
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {isFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.();
            }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"
          >
            <Star size={12} className="text-white" fill="white" />
          </button>
        )}
        
        {usageCount > 0 && (
          <div className="absolute -bottom-1 -right-1 text-xs bg-primary/80 text-white rounded-full w-5 h-5 flex items-center justify-center">
            {usageCount}
          </div>
        )}
        
        {element.rarity === 'legendary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 animate-gradient rounded-xl" />
        )}

        {powerLevel > 0 && (
          <div className="absolute -top-1 -left-1">
            <div className="relative w-5 h-5 bg-yellow-400/90 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-background">
                {powerLevel >= 1000 ? `${(powerLevel/1000).toFixed(1)}k` : powerLevel}
              </span>
              <motion.div 
                className="absolute inset-0 rounded-full bg-yellow-400"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ opacity: 0.3 }}
              />
            </div>
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {showLabel && (
          <motion.span 
            className="element-label mt-1 text-sm font-medium select-none"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {element.name}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Element;

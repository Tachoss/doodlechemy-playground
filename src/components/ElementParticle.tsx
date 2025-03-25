
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ElementParticleProps {
  color: string;
  posX: number;
  posY: number;
  success?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ElementParticle: React.FC<ElementParticleProps> = ({ 
  color, 
  posX, 
  posY, 
  success = true,
  size = 'medium'
}) => {
  const [style, setStyle] = useState({});
  
  useEffect(() => {
    // Random translation values - larger range for success
    const tx = (Math.random() * (success ? 140 : 80) - (success ? 70 : 40)) + 'px';
    const ty = (Math.random() * (success ? -100 : -60) - (success ? 30 : 20)) + 'px';
    
    // Size based on prop with some randomness
    const sizeValue = Math.random() * 
      (size === 'small' ? 6 : size === 'medium' ? 10 : 14) + 
      (success ? 4 : 2);
    
    // Apply random position and animation
    setStyle({
      position: 'absolute',
      left: `${posX}px`,
      top: `${posY}px`,
      width: `${sizeValue}px`,
      height: `${sizeValue}px`,
      borderRadius: '50%',
      backgroundColor: color,
      opacity: Math.random() * 0.6 + 0.4,
      '--tx': tx,
      '--ty': ty,
      boxShadow: success ? `0 0 ${sizeValue * 0.7}px ${color}80` : 'none',
    } as React.CSSProperties);
    
    // Remove component after animation completes
    const timer = setTimeout(() => {
      setStyle({ display: 'none' });
    }, success ? 1400 : 1000);
    
    return () => clearTimeout(timer);
  }, [color, posX, posY, success, size]);

  return (
    <motion.div
      className={cn(
        "pointer-events-none",
        success ? "animate-particle-success" : "animate-particle-fail"
      )}
      style={style}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    />
  );
};

export default ElementParticle;

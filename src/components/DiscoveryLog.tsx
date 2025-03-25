
import React from 'react';
import { motion } from 'framer-motion';
import { Discovery } from '@/utils/gameLogic';
import { Element as ElementType } from '@/utils/elementData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Info } from 'lucide-react';

interface DiscoveryLogProps {
  discoveries: Discovery[];
  elements: ElementType[];
  className?: string;
  onElementClick?: (elementId: string) => void;
}

const DiscoveryLog: React.FC<DiscoveryLogProps> = ({ 
  discoveries = [], // Default to empty array
  elements = [], // Default to empty array
  className,
  onElementClick
}) => {
  // Add null checks to all element-related functions
  const getElementName = (id: string) => {
    if (!elements || !elements.length) return id;
    return elements.find(e => e.id === id)?.name || id;
  };
  
  const getElementSymbol = (id: string) => {
    if (!elements || !elements.length) return '';
    return elements.find(e => e.id === id)?.symbol || '';
  };
  
  const getElementColor = (id: string) => {
    if (!elements || !elements.length) return '#333';
    return elements.find(e => e.id === id)?.color || '#333';
  };
  
  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };
  
  const handleElementClick = (id: string) => {
    if (onElementClick) {
      onElementClick(id);
    }
  };

  return (
    <div className={cn("rounded-xl", className)}>
      {!discoveries || discoveries.length === 0 ? (
        <div className="text-center text-muted-foreground py-6">
          <p>Start combining elements to record your discoveries!</p>
        </div>
      ) : (
        <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3">
          {discoveries.map((discovery, index) => (
            <motion.div
              key={discovery.id}
              className="bg-white/10 dark:bg-gray-800/20 rounded-lg p-3 transition-colors hover:bg-white/20 dark:hover:bg-gray-800/30"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <div className="flex items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mr-3 text-xl relative cursor-pointer transition-transform hover:scale-105",
                    onElementClick ? "hover:shadow-md" : ""
                  )}
                  style={{ 
                    backgroundColor: `${getElementColor(discovery.result)}40`,
                    borderColor: `${getElementColor(discovery.result)}80`,
                    borderWidth: '2px' 
                  }}
                  onClick={() => handleElementClick(discovery.result)}
                >
                  {getElementSymbol(discovery.result)}
                  
                  {onElementClick && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                      <Info size={10} className="text-blue-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium mb-1 flex items-center">
                    {getElementName(discovery.result)}
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatTime(discovery.timestamp)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex items-center flex-wrap">
                    <span 
                      className={cn(
                        "inline-block w-6 h-6 rounded-full flex items-center justify-center mr-1 cursor-pointer",
                        onElementClick ? "hover:scale-110 transition-transform" : ""
                      )}
                      style={{ backgroundColor: `${getElementColor(discovery.elements[0])}30` }}
                      onClick={() => handleElementClick(discovery.elements[0])}
                    >
                      {getElementSymbol(discovery.elements[0])}
                    </span>
                    <span>+</span>
                    <span 
                      className={cn(
                        "inline-block w-6 h-6 rounded-full flex items-center justify-center mx-1 cursor-pointer",
                        onElementClick ? "hover:scale-110 transition-transform" : ""
                      )}
                      style={{ backgroundColor: `${getElementColor(discovery.elements[1])}30` }}
                      onClick={() => handleElementClick(discovery.elements[1])}
                    >
                      {getElementSymbol(discovery.elements[1])}
                    </span>
                    <span className="ml-1">{discovery.description}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoveryLog;

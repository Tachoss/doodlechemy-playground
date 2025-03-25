
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Clock, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Element } from '@/utils/elementData';
import { formatDistanceToNow } from 'date-fns';
import { Discovery } from '@/utils/gameLogic';

interface ElementDetailsProps {
  element: Element;
  onClose: () => void;
  discovery?: Discovery;
  elementCounts: Record<string, number>;
}

const ElementDetails: React.FC<ElementDetailsProps> = ({
  element,
  onClose,
  discovery,
  elementCounts
}) => {
  const getCategoryLabel = (category: Element['category']) => {
    switch (category) {
      case 'basic': return 'Basic Element';
      case 'compound': return 'Compound';
      case 'advanced': return 'Advanced Element';
      case 'rare': return 'Rare Element';
      case 'scientific': return 'Scientific Element';
      default: return 'Unknown';
    }
  };
  
  const getRarityColor = (rarity: Element['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-200 text-gray-800';
      case 'uncommon': return 'bg-green-200 text-green-800';
      case 'rare': return 'bg-blue-200 text-blue-800';
      case 'legendary': return 'bg-amber-200 text-amber-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };
  
  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };
  
  const usageCount = elementCounts[element.id] || 0;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ 
                    backgroundColor: `${element.color}40`,
                    borderColor: `${element.color}80`,
                    borderWidth: '2px'
                  }}
                >
                  {element.symbol}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{element.name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getCategoryLabel(element.category)}
                    </span>
                    {element.rarity && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRarityColor(element.rarity)}`}>
                        {element.rarity.charAt(0).toUpperCase() + element.rarity.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X size={16} />
              </Button>
            </div>
            
            {element.description && (
              <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-start">
                  <Info size={16} className="mr-2 mt-1 text-blue-500 shrink-0" />
                  <p className="text-sm">{element.description}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {element.atomicNumber && (
                <div className="text-sm">
                  <span className="font-medium">Atomic Number:</span> {element.atomicNumber}
                </div>
              )}
              
              {element.group && (
                <div className="text-sm">
                  <span className="font-medium">Group:</span> {element.group}
                </div>
              )}
              
              <div className="text-sm">
                <span className="font-medium">Times Used in Combinations:</span> {usageCount}
              </div>
              
              {discovery && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Clock size={14} className="mr-1" />
                    Discovery Details
                  </h3>
                  <div className="text-sm">
                    <div>Discovered {formatTime(discovery.timestamp)}</div>
                    <div className="mt-1">{discovery.description}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t flex justify-end">
              <Button
                variant="default"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ElementDetails;

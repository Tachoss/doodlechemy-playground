
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameState } from '@/utils/gameLogic';

interface GameTipsProps {
  gameState: GameState;
}

const GameTips = ({ gameState }: GameTipsProps) => {
  const [open, setOpen] = useState(false);
  
  // Generate tip based on player's progress
  const getTip = () => {
    const discoveredCount = gameState.elements.filter(e => e.discovered).length;
    const tips = [
      "Try combining the four basic elements: Air, Water, Fire, and Earth to discover new elements.",
      "You can combine any two elements, even ones you've just created!",
      "Look for combinations that make sense in the real world.",
      "Some elements can only be created by combining advanced elements.",
      "Keep track of your discoveries in the Discoveries tab.",
      "Power-ups can help you when you're stuck.",
      "Add elements to your favorites to find them more easily later.",
    ];
    
    // Show different tips based on progress
    if (discoveredCount < 5) {
      return tips[0];
    } else if (discoveredCount < 10) {
      return tips[1];
    } else if (discoveredCount < 20) {
      return tips[2];
    } else {
      // Return a random tip for advanced players
      return tips[Math.floor(Math.random() * tips.length)];
    }
  };

  return (
    <div className="mb-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-lg">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-medium">Game Tips</h3>
          </div>
          
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
              {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 mt-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm">{getTip()}</p>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default GameTips;

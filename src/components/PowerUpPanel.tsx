
import React from 'react';
import { motion } from 'framer-motion';
import { PowerUp, isPowerUpAvailable } from '@/utils/powerUpsSystem';
import { GameState } from '@/utils/gameLogic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Battery, Eye, Lightbulb, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PowerUpPanelProps {
  powerUps: PowerUp[];
  gameState: GameState;
  onActivate: (powerUpId: string) => void;
}

const PowerUpPanel: React.FC<PowerUpPanelProps> = ({
  powerUps,
  gameState,
  onActivate
}) => {
  // Get the appropriate icon component for each power-up
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="h-5 w-5" />;
      case 'Eye':
        return <Eye className="h-5 w-5" />;
      case 'Battery':
        return <Battery className="h-5 w-5" />;
      case 'Lightbulb':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <Zap className="h-5 w-5" />;
    }
  };
  
  // Calculate cooldown percentage for a power-up
  const getCooldownPercentage = (powerUp: PowerUp): number => {
    if (!powerUp.lastUsed) return 100;
    
    const elapsedSeconds = (Date.now() - powerUp.lastUsed) / 1000;
    const percentRemaining = (elapsedSeconds / powerUp.cooldown) * 100;
    
    return Math.min(Math.max(percentRemaining, 0), 100);
  };
  
  // Check if the player can afford this power-up
  const canAfford = (powerUp: PowerUp): boolean => {
    return gameState.totalPowerGained >= powerUp.cost;
  };

  return (
    <Card className="p-4 shadow-lg border-t-4 border-amber-500/50">
      <div className="flex items-center mb-4">
        <Zap className="w-5 h-5 mr-2 text-amber-500" />
        <h3 className="text-lg font-bold">Power-ups</h3>
      </div>
      
      <div className="grid gap-3">
        {powerUps.map(powerUp => {
          const { available, reason } = isPowerUpAvailable(powerUp, gameState);
          const cooldownPercentage = getCooldownPercentage(powerUp);
          
          return (
            <motion.div
              key={powerUp.id}
              className={cn(
                "relative p-3 rounded-lg border transition-colors",
                available && canAfford(powerUp) 
                  ? "border-primary/40 bg-primary/5 hover:bg-primary/10" 
                  : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30"
              )}
              whileHover={{ scale: available ? 1.02 : 1 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center p-2 rounded-full",
                    available ? "bg-primary/20 text-primary" : "bg-gray-200 text-gray-500 dark:bg-gray-700"
                  )}>
                    {getIcon(powerUp.icon)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-sm">{powerUp.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{powerUp.description}</p>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!available || !canAfford(powerUp)}
                  onClick={() => onActivate(powerUp.id)}
                  className={cn(
                    "min-w-20 ml-2",
                    available && canAfford(powerUp) ? "border-primary/50" : ""
                  )}
                >
                  <span className="mr-1">{powerUp.cost}</span>
                  <Zap className="h-3 w-3" />
                </Button>
              </div>
              
              {powerUp.lastUsed && cooldownPercentage < 100 && (
                <div className="mt-2">
                  <Progress 
                    value={cooldownPercentage} 
                    className="h-1" 
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {reason}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default PowerUpPanel;


import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Element } from '@/utils/elementData';

interface GameStatsProps {
  totalPowerGained: number;
  elementPowers: Record<string, number>;
  elements: Element[];
  comboMultiplier: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  totalPowerGained,
  elementPowers,
  elements,
  comboMultiplier
}) => {
  const topElements = elements
    .filter(e => elementPowers[e.id])
    .sort((a, b) => (elementPowers[b.id] || 0) - (elementPowers[a.id] || 0))
    .slice(0, 5);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold mb-4">Element Power Stats</h3>
      
      <div className="grid gap-4">
        <div className="flex justify-between items-center">
          <span>Total Power Gained:</span>
          <span className="font-bold">{totalPowerGained}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Current Multiplier:</span>
          <span className="font-bold text-primary">{comboMultiplier.toFixed(1)}x</span>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Most Powerful Elements</h4>
          {topElements.map((element, index) => (
            <motion.div
              key={element.id}
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="w-8 h-8 rounded flex items-center justify-center"
                style={{ backgroundColor: `${element.color}40` }}
              >
                {element.symbol}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{element.name}</div>
                <div className="text-xs text-muted-foreground">
                  Power: {elementPowers[element.id]}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

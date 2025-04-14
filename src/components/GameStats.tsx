
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card } from '@/components/ui/card';
import { Element } from '@/utils/elementData';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp } from 'lucide-react';

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
    
  // Create data for chart visualization
  const chartData = topElements.map(element => ({
    name: element.name.length > 6 ? element.name.substring(0, 6) + '...' : element.name,
    power: elementPowers[element.id] || 0,
    color: element.color
  }));

  return (
    <Card className="p-4 shadow-lg border-t-4 border-primary/50">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
        Element Power Stats
      </h3>
      
      <div className="grid gap-4">
        <div className="flex justify-between items-center p-2 bg-primary/10 rounded-lg">
          <span className="font-medium">Total Power Gained:</span>
          <motion.span 
            className="font-bold text-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {totalPowerGained}
          </motion.span>
        </div>

        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-amber-500/20 to-amber-300/10 rounded-lg">
          <span className="font-medium flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Current Multiplier:
          </span>
          <motion.span 
            className="font-bold text-primary text-lg"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            {comboMultiplier.toFixed(1)}x
          </motion.span>
        </div>

        {chartData.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Power Distribution</h4>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    cursor={{ fill: 'rgba(180, 180, 180, 0.1)' }}
                  />
                  <Bar 
                    dataKey="power" 
                    radius={[4, 4, 0, 0]}
                    fill="#8884d8"
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Most Powerful Elements</h4>
          {topElements.map((element, index) => (
            <motion.div
              key={element.id}
              className="flex items-center gap-2 mb-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${element.color}40` }}
              >
                {element.symbol}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{element.name}</div>
                <div className="w-full mt-1">
                  <Progress 
                    value={elementPowers[element.id] / (elementPowers[topElements[0]?.id] || 1) * 100} 
                    className="h-1.5"
                    style={{ 
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '--tw-progress-bar-background': element.color + '80'
                    } as React.CSSProperties}
                  />
                </div>
              </div>
              <div className="text-xs font-semibold">
                {elementPowers[element.id]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

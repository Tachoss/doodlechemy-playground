import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Element } from '@/utils/elementData';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, Award, Crown, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    
  const chartData = topElements.map(element => ({
    name: element.name.length > 6 ? element.name.substring(0, 6) + '...' : element.name,
    power: elementPowers[element.id] || 0,
    color: element.color
  }));

  const isHighMultiplier = comboMultiplier > 1.5;

  return (
    <Card className="p-4 shadow-lg border-t-4 border-primary/50 overflow-hidden relative">
      <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-radial from-primary/10 to-transparent opacity-60 rounded-full -mr-10 -mt-10" />
      <div className="absolute left-0 bottom-0 w-24 h-24 bg-gradient-radial from-secondary/10 to-transparent opacity-50 rounded-full -ml-10 -mb-10" />
      
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
        Element Power Stats
      </h3>
      
      <div className="grid gap-4">
        <motion.div 
          className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-medium flex items-center">
            <Award className="w-4 h-4 mr-2 text-amber-500" />
            Total Power Gained:
          </span>
          <motion.div
            className="font-bold text-lg flex items-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span>{totalPowerGained}</span>
            
            {totalPowerGained > 100 && (
              <motion.div 
                className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.3 }}
              >
                <Crown className="w-3 h-3 mr-1" /> 
                Master
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        <motion.div 
          className={cn(
            "flex justify-between items-center p-3 rounded-lg",
            isHighMultiplier 
              ? "bg-gradient-to-r from-amber-500/20 to-amber-300/10" 
              : "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
          )}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="font-medium flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-primary" />
            Current Multiplier:
          </span>
          <motion.div 
            className={cn(
              "font-bold text-lg flex items-center gap-1.5",
              isHighMultiplier ? "text-amber-500" : "text-primary"
            )}
            animate={{ 
              scale: isHighMultiplier ? [1, 1.1, 1] : 1,
              opacity: isHighMultiplier ? [1, 0.8, 1] : 1
            }}
            transition={{ 
              duration: 1.5, 
              repeat: isHighMultiplier ? Infinity : 0,
              repeatType: "reverse" 
            }}
          >
            {comboMultiplier.toFixed(1)}x
            
            {isHighMultiplier && (
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Flame className="w-4 h-4 text-amber-500" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {chartData.length > 0 && (
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Crown className="w-4 h-4 mr-1 text-amber-500" />
              Power Distribution
            </h4>
            <div className="h-36 w-full mt-2 px-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10}
                    tick={{ fill: '#888' }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    cursor={{ fill: 'rgba(180, 180, 180, 0.1)' }}
                    formatter={(value: number, name: string) => [`${value} Power`, 'Power']}
                  />
                  <Bar 
                    dataKey="power" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        <motion.div 
          className="mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Flame className="w-4 h-4 mr-1 text-orange-500" />
            Most Powerful Elements
          </h4>
          {topElements.map((element, index) => (
            <motion.div
              key={element.id}
              className="flex items-center gap-2 mb-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center relative"
                style={{ backgroundColor: `${element.color}40` }}
              >
                <span>{element.symbol}</span>
                {index === 0 && (
                  <motion.div 
                    className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    1
                  </motion.div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{element.name}</div>
                <div className="w-full mt-1 relative">
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
        </motion.div>
      </div>
    </Card>
  );
};

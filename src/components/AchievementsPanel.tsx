
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Achievement, getAchievementProgress } from '@/utils/achievementSystem';
import { Progress } from '@/components/ui/progress';

interface AchievementsPanelProps {
  achievements: Achievement[];
  onClose: () => void;
  showLocked?: boolean;
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  achievements,
  onClose,
  showLocked = true
}) => {
  const [filter, setFilter] = React.useState<'all' | 'unlocked' | 'locked'>('all');
  
  const { total, unlocked, percentage } = getAchievementProgress(achievements);
  
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });
  
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
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center">
                <Award className="mr-2 text-yellow-500" />
                Achievements
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X size={16} />
              </Button>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{unlocked} of {total} achievements unlocked</span>
              <Progress value={percentage} className="w-24 h-2" />
              <span>{percentage}%</span>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className="text-xs"
              >
                All
              </Button>
              <Button
                variant={filter === 'unlocked' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unlocked')}
                className="text-xs"
              >
                <CheckCircle size={12} className="mr-1" />
                Unlocked
              </Button>
              <Button
                variant={filter === 'locked' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('locked')}
                className="text-xs"
              >
                <Lock size={12} className="mr-1" />
                Locked
              </Button>
            </div>
          </div>
          
          <div className="overflow-y-auto p-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    className={`border rounded-lg p-3 ${
                      achievement.unlocked ? 'bg-gray-50 dark:bg-gray-900' : 'opacity-70'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                        {achievement.unlocked ? (
                          <span className="text-xl">{achievement.icon}</span>
                        ) : (
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
                            <Lock size={12} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-sm font-semibold">
                            {achievement.name}
                          </h3>
                          {achievement.unlocked && (
                            <CheckCircle size={12} className="ml-1 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-6 text-gray-500">
                  No achievements match your filter
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementsPanel;

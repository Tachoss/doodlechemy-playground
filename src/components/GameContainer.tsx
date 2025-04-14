import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStats } from './GameStats';
import ElementGrid from './ElementGrid';
import DiscoveryLog from './DiscoveryLog';
import CombinationArea from './CombinationArea';
import ElementDetails from './ElementDetails';
import AchievementsPanel from './AchievementsPanel';
import { Badge } from './ui/badge';
import PowerUpPanel from './PowerUpPanel';
import GameTips from './GameTips';
import { toast } from '@/hooks/use-toast';
import { 
  addElementToCombination, 
  attemptCombination, 
  getDiscoveredElements,
  getElementByID,
  getGameStats,
  initializeGame,
  removeElementFromCombination,
  toggleFavorite, 
  viewElementDetails
} from '@/utils/gameLogic';
import { PowerUp, PowerUpsState, initializePowerUps, activatePowerUp } from '@/utils/powerUpsSystem';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Achievement } from '@/utils/achievementSystem';
import { Element } from '@/utils/elementData';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  Award, 
  BookOpenText, 
  Filter, 
  Heart, 
  Info, 
  Library, 
  Search, 
  Settings, 
  Sparkles, 
  Zap,
  Atom // Using Atom as an icon for Elements
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from './ui/label';

const GameContainer = () => {
  // Initialize game state
  const [gameProgress, setGameProgress] = useState(initializeGame());
  const [powerUpsState, setPowerUpsState] = useState<PowerUpsState>(initializePowerUps());
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const isMobile = useIsMobile();
  const [lastUnlockedAchievement, setLastUnlockedAchievement] = useState<Achievement | null>(null);
  const [newlyDiscoveredElement, setNewlyDiscoveredElement] = useState<Element | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const { gameState } = gameProgress;
  const discoveredElements = getDiscoveredElements(gameState);

  // Set last unlocked achievement when it changes
  useEffect(() => {
    if (gameProgress.achievementState.lastUnlocked) {
      setLastUnlockedAchievement(gameProgress.achievementState.lastUnlocked);
    }
  }, [gameProgress.achievementState.lastUnlocked]);

  const handleDrop = (elementId: string) => {
    setGameProgress(addElementToCombination(gameProgress, elementId));
  };

  const handleRemoveElement = (elementId: string) => {
    setGameProgress(removeElementFromCombination(gameProgress, elementId));
  };

  const handleCombine = () => {
    const { newGameProgress, success, newElement } = attemptCombination(gameProgress);
    setGameProgress(newGameProgress);

    if (success && newElement) {
      if (!newGameProgress.gameState.elements.find(e => e.id === newElement.id)?.discovered) {
        setNewlyDiscoveredElement(newElement);
      }
    }
  };

  const handleViewDetails = (elementId: string | null) => {
    setGameProgress(viewElementDetails(gameProgress, elementId));
  };

  const handleToggleFavorite = (elementId: string) => {
    setGameProgress(toggleFavorite(gameProgress, elementId));
  };

  const handleActivatePowerUp = (powerUpId: string) => {
    const { newGameState, newPowerUpState } = activatePowerUp(
      gameState, 
      powerUpId, 
      powerUpsState
    );
    
    setGameProgress({
      ...gameProgress,
      gameState: newGameState
    });
    
    setPowerUpsState(newPowerUpState);
  };

  const filteredElements = activeCategory 
    ? discoveredElements.filter(element => element.category === activeCategory) 
    : discoveredElements;

  const searchFilteredElements = filter 
    ? filteredElements.filter(element => 
        element.name.toLowerCase().includes(filter.toLowerCase()) || 
        element.symbol.toLowerCase().includes(filter.toLowerCase())
      ) 
    : filteredElements;

  const displayedElements = showFavoritesOnly 
    ? searchFilteredElements.filter(element => gameState.favorites.includes(element.id)) 
    : searchFilteredElements;

  // Used for category counts in tabs
  const categoryElementCounts = discoveredElements.reduce((acc, element) => {
    acc[element.category] = (acc[element.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = getGameStats(gameState);
  
  // Create the combinationCounts for ElementGrid
  const combinationCounts: Record<string, number> = {};
  gameState.discoveries.forEach(discovery => {
    discovery.elements.forEach(element => {
      combinationCounts[element] = (combinationCounts[element] || 0) + 1;
    });
  });

  // Calculate a dummy selectedElements array to match ElementGrid props
  const selectedElements = gameState.combiningElements.filter(el => el !== null) as string[];

  return (
    <div className="container mx-auto px-4 md:px-6 pb-8 relative">
      <header className="py-6 text-center mb-6">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Element Alchemy
        </motion.h1>
        <motion.p 
          className="text-gray-600 dark:text-gray-300 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Combine elements to discover the world
        </motion.p>
        
        <motion.div 
          className="flex items-center justify-center mt-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-yellow-500" />
            Level {gameState.level}
          </Badge>
          
          <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 shadow-sm">
            <Library className="h-3.5 w-3.5 mr-1 text-indigo-500" />
            {stats.discoveredElements} / {stats.totalElements}
          </Badge>
          
          <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50 shadow-sm">
            <Zap className="h-3.5 w-3.5 mr-1 text-amber-500" />
            {gameState.totalPowerGained} Power
          </Badge>
        </motion.div>
      </header>

      <GameTips gameState={gameState} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CombinationArea 
              gameState={gameState}
              onRemoveElement={handleRemoveElement}
              onCombine={handleCombine}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Tabs defaultValue="elements" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="elements" className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Elements</span>
                  </TabsTrigger>
                  <TabsTrigger value="discoveries" className="flex items-center">
                    <BookOpenText className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Discoveries</span>
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Achievements</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </div>
              </div>
              
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-500" />
                        Display Options
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="element-search" className="text-xs">Search Elements</Label>
                          <div className="flex mt-1">
                            <Input
                              id="element-search"
                              type="text"
                              placeholder="Search..."
                              value={filter}
                              onChange={(e) => setFilter(e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-xs">Options</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              variant={showFavoritesOnly ? "default" : "outline"}
                              size="sm"
                              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                              className="h-8 text-xs"
                            >
                              <Heart className={`h-3.5 w-3.5 mr-1 ${showFavoritesOnly ? 'text-white' : 'text-pink-500'}`} />
                              Favorites
                            </Button>
                            
                            {activeCategory && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveCategory(null)}
                                className="h-8 text-xs"
                              >
                                <Filter className="h-3.5 w-3.5 mr-1" />
                                Clear Filters
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <TabsContent value="elements" className="mt-0">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4">
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
                      <Button
                        variant={activeCategory === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveCategory(null)}
                        className="h-8"
                      >
                        All ({discoveredElements.length})
                      </Button>
                      {Object.keys(categoryElementCounts).map(category => (
                        <Button
                          key={category}
                          variant={activeCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveCategory(category)}
                          className="h-8 whitespace-nowrap"
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)} ({categoryElementCounts[category]})
                        </Button>
                      ))}
                    </div>
                    
                    <ScrollArea className="h-[50vh]">
                      <ElementGrid 
                        elements={displayedElements} 
                        selectedElements={selectedElements}
                        onElementClick={handleViewDetails}
                        favorites={gameState.favorites || []}
                        onElementFavorite={handleToggleFavorite}
                        combinationCounts={combinationCounts}
                        elementPowers={gameState.elementPowers || {}}
                        comboMultiplier={gameState.comboMultiplier || 1}
                      />
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="discoveries" className="mt-0">
                <DiscoveryLog 
                  discoveries={gameState.discoveries}
                  elements={gameState.elements}
                  onElementClick={handleViewDetails}
                />
              </TabsContent>
              
              <TabsContent value="achievements" className="mt-0">
                <AchievementsPanel 
                  achievements={gameProgress.achievementState.achievements} 
                  onClose={() => {}}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <PowerUpPanel 
              powerUps={powerUpsState.availablePowerUps}
              gameState={gameState}
              onActivate={handleActivatePowerUp}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <GameStats 
              totalPowerGained={gameState.totalPowerGained} 
              elementPowers={gameState.elementPowers}
              elements={gameState.elements}
              comboMultiplier={gameState.comboMultiplier}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <AnimatePresence>
              {gameState.viewedElementDetails && (
                <ElementDetails 
                  element={getElementByID(gameState, gameState.viewedElementDetails)}
                  onClose={() => handleViewDetails(null)}
                  elementCounts={combinationCounts}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {lastUnlockedAchievement && (
          <motion.div
            className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-md"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center">
              <Award className="h-12 w-12 mr-3 text-white" />
              <div>
                <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                <p className="text-yellow-100">{lastUnlockedAchievement.name}</p>
                <p className="text-sm text-yellow-50 mt-1">{lastUnlockedAchievement.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {newlyDiscoveredElement && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNewlyDiscoveredElement(null)}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md text-center shadow-xl"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <Sparkles className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">New Discovery!</h2>
              <p className="text-lg font-medium mb-4 text-primary">{newlyDiscoveredElement.name}</p>
              
              <div className="flex justify-center mb-6">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-semibold"
                  style={{ backgroundColor: `${newlyDiscoveredElement.color}30` }}
                >
                  {newlyDiscoveredElement.symbol}
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">{newlyDiscoveredElement.description}</p>
              
              <Button onClick={() => setNewlyDiscoveredElement(null)}>
                Continue
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameContainer;

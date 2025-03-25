
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ElementGrid from './ElementGrid';
import CombinationArea from './CombinationArea';
import DiscoveryLog from './DiscoveryLog';
import AchievementsPanel from './AchievementsPanel';
import ElementDetails from './ElementDetails';
import { 
  GameProgress,
  GameState, 
  initializeGame, 
  saveGame, 
  resetGame,
  addElementToCombination,
  removeElementFromCombination,
  attemptCombination,
  getDiscoveredElements,
  getPossibleCombinations,
  getElementByID,
  viewElementDetails,
  getGameStats,
  getRandomHint,
  getAIAssistantMessage
} from '@/utils/gameLogic';
import { toast } from '@/hooks/use-toast';
import { 
  FolderHeart, 
  BookMarked, 
  HelpCircle, 
  RefreshCw, 
  Award, 
  Settings,
  Info,
  BarChart3,
  Layers,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from '@/components/ui/progress';

// Create a default empty state to use when needed
const defaultGameState: GameState = {
  elements: [],
  discoveries: [],
  combiningElements: [null, null],
  level: 1,
  score: 0,
  successfulCombosInARow: 0,
  lastCombinationSuccess: null,
  viewedElementDetails: null
};

const GameContainer: React.FC = () => {
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'elements' | 'discoveries' | 'achievements'>('elements');
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [elementCounts, setElementCounts] = useState<Record<string, number>>({});
  const [aiAssistantMessage, setAiAssistantMessage] = useState<string>("");
  const [aiThinking, setAiThinking] = useState(false);
  
  const combineZoneRef = useRef<HTMLDivElement>(null);
  
  // Initialize game on first render
  useEffect(() => {
    const initialGameProgress = initializeGame();
    setGameProgress(initialGameProgress);
    
    // Set initial AI assistant message
    setAiAssistantMessage(getAIAssistantMessage(initialGameProgress.gameState));

    // Show tutorial for new players
    const hasSeenTutorial = localStorage.getItem('elementAlchemyTutorialSeen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      localStorage.setItem('elementAlchemyTutorialSeen', 'true');
    }
  }, []);
  
  // Add safeguards for undefined gameState or achievementState
  const { gameState = defaultGameState, achievementState = { achievements: [], lastUnlocked: null } } = gameProgress || {};
  
  // Use safe versions of functions that handle potential undefined values
  const safeGetDiscoveredElements = () => {
    if (!gameState || !gameState.elements) return [];
    return getDiscoveredElements(gameState);
  };
  
  const safeGetGameStats = () => {
    if (!gameState) return {
      totalElements: 0,
      discoveredElements: 0,
      percentComplete: 0,
      basicElements: 0,
      compoundElements: 0,
      advancedElements: 0,
      rareElements: 0,
      scientificElements: 0
    };
    return getGameStats(gameState);
  };
  
  const discoveredElements = safeGetDiscoveredElements();
  const stats = safeGetGameStats();
  
  // Calculate element usage in combinations
  useEffect(() => {
    if (!gameState || !gameState.discoveries) {
      setElementCounts({});
      return;
    }
    
    const counts: Record<string, number> = {};
    gameState.discoveries.forEach(discovery => {
      discovery.elements.forEach(elementId => {
        counts[elementId] = (counts[elementId] || 0) + 1;
      });
    });
    setElementCounts(counts);
  }, [gameState?.discoveries]);
  
  useEffect(() => {
    // Save game state when it changes
    if (gameProgress) {
      saveGame(gameProgress);
      
      // Update AI assistant message when game state changes
      setAiThinking(true);
      // Simulate AI "thinking" with a slight delay
      setTimeout(() => {
        setAiAssistantMessage(getAIAssistantMessage(gameProgress.gameState));
        setAiThinking(false);
      }, 800);
    }
  }, [gameProgress]);

  // Show tutorial on first load
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('elementAlchemyTutorialSeen');
    if (!hasSeenTutorial && !hasShownIntro) {
      setShowTutorial(true);
      setHasShownIntro(true);
      
      // Mark as seen after a delay
      setTimeout(() => {
        localStorage.setItem('elementAlchemyTutorialSeen', 'true');
      }, 2000);
    }
  }, [hasShownIntro]);

  const handleElementClick = (elementId: string) => {
    setGameProgress(prevState => prevState ? addElementToCombination(prevState, elementId) : prevState);
  };

  const handleRemoveElement = (elementId: string) => {
    setGameProgress(prevState => prevState ? removeElementFromCombination(prevState, elementId) : prevState);
  };

  const handleCombine = () => {
    if (!gameProgress) return;
    
    const { newGameProgress, success, newElement } = attemptCombination(gameProgress);
    
    setGameProgress(newGameProgress);
    
    if (!success) {
      setTimeout(() => {
        toast({
          title: "No Reaction",
          description: "These elements don't combine into anything.",
          variant: "destructive",
        });
      }, 500);
    }
  };

  const handleReset = () => {
    const freshGame = resetGame();
    setGameProgress(freshGame);
    setShowResetConfirm(false);
    toast({
      title: "Game Reset",
      description: "Your progress has been reset.",
    });
    
    // Update AI message for new game
    setAiAssistantMessage(getAIAssistantMessage(freshGame.gameState));
  };

  // Improved hint system with visual cues
  const checkForHints = () => {
    if (!gameState) return;
    
    const hintResult = getRandomHint(gameState);
    
    if (hintResult.hint) {
      toast({
        title: "Hint",
        description: hintResult.hint,
        variant: "default"
      });
      
      // If we have specific elements to highlight, we could add visual cues
      if (hintResult.elements) {
        // Make the AI suggest these elements
        setAiAssistantMessage(`AI Suggestion: ${hintResult.hint}`);
      }
    }
  };
  
  const handleViewElementDetails = (elementId: string) => {
    setGameProgress(prevState => prevState ? viewElementDetails(prevState, elementId) : prevState);
  };
  
  const handleCloseElementDetails = () => {
    setGameProgress(prevState => prevState ? viewElementDetails(prevState, null) : prevState);
  };

  // Get the currently viewed element
  const viewedElement = gameState?.viewedElementDetails 
    ? getElementByID(gameState, gameState.viewedElementDetails) 
    : null;
    
  // Find the discovery for the viewed element
  const viewedElementDiscovery = viewedElement && gameState?.discoveries 
    ? gameState.discoveries.find(d => d.result === viewedElement.id) 
    : null;

  // If gameProgress is null, show improved loading state
  if (!gameProgress) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <div className="text-center glass-panel p-8 rounded-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Element Alchemy...</p>
          <p className="text-sm text-muted-foreground mt-2">Preparing your alchemical workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="glass-panel rounded-2xl p-6 mb-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <motion.div 
            className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold flex items-center">
              <span className="mr-1">Element</span>
              <span className="relative">
                Alchemy
                <motion.span 
                  className="absolute -top-2 -right-2 text-base text-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  ✨
                </motion.span>
              </span>
            </h1>
            
            <div className="flex items-center mt-2 sm:mt-0 sm:ml-4">
              <div className="bg-primary/20 rounded-full px-3 py-1 text-sm flex items-center">
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-1"
                >
                  <Layers size={14} />
                </motion.div>
                <span>Level {gameState.level}</span>
              </div>
              <div className="bg-amber-500/20 rounded-full px-3 py-1 text-sm flex items-center ml-2">
                <Award size={14} className="mr-1" />
                <span>{gameState.score} pts</span>
              </div>
            </div>
          </motion.div>
          
          <div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <motion.div 
                className="text-sm font-medium bg-white/50 dark:bg-black/30 rounded-full px-3 py-1 flex items-center gap-1"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <FolderHeart size={14} />
                <span>{stats.discoveredElements} / {stats.totalElements}</span>
              </motion.div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setShowAchievements(true)}
                    >
                      <Award size={14} className="mr-1" />
                      <span>{achievementState.achievements.filter(a => a.unlocked).length}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View Achievements</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full hover:bg-secondary"
                      onClick={checkForHints}
                    >
                      <HelpCircle size={14} className="mr-1" />
                      <span>Hint</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Get a hint for a new combination</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setShowStats(true)}
                    >
                      <BarChart3 size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View Statistics</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {showResetConfirm ? (
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleReset} 
                    variant="destructive"
                    size="sm"
                    className="rounded-full"
                  >
                    Confirm
                  </Button>
                  <Button 
                    onClick={() => setShowResetConfirm(false)} 
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                        onClick={() => setShowResetConfirm(true)}
                      >
                        <RefreshCw size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset Game</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
        
        {/* AI Assistant message with thinking animation */}
        <motion.div
          className="mb-4 bg-primary/10 rounded-lg p-3 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-2">
            <div className="mt-0.5 text-primary">
              {aiThinking ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={16} />
                </motion.div>
              ) : (
                <Info size={16} />
              )}
            </div>
            <p>{aiThinking ? "Analyzing your progress..." : aiAssistantMessage}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          ref={combineZoneRef}
        >
          <CombinationArea 
            gameState={gameState}
            onRemoveElement={handleRemoveElement}
            onCombine={handleCombine}
          />
        </motion.div>
        
        <motion.div
          className="w-full bg-white/10 dark:bg-black/20 rounded-full h-2 mb-4"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Progress value={stats.percentComplete} className="h-2" />
          <div className="flex justify-between text-xs mt-1 text-muted-foreground">
            <span>Progress</span>
            <span>{stats.percentComplete}%</span>
          </div>
        </motion.div>
      </div>
      
      {/* Mobile Tab Navigation - improved styling */}
      <div className="flex lg:hidden mb-4 border-b bg-white/5 backdrop-blur-sm rounded-t-lg overflow-hidden">
        <button
          className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'elements' ? 'border-b-2 border-primary font-medium bg-primary/10' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('elements')}
        >
          <FolderHeart size={16} className="inline mr-1" />
          Elements
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'discoveries' ? 'border-b-2 border-primary font-medium bg-primary/10' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('discoveries')}
        >
          <BookMarked size={16} className="inline mr-1" />
          Discoveries
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'achievements' ? 'border-b-2 border-primary font-medium bg-primary/10' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('achievements')}
        >
          <Award size={16} className="inline mr-1" />
          Achievements
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className={`lg:col-span-2 ${activeTab === 'elements' || window.innerWidth >= 1024 ? 'block' : 'hidden'}`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FolderHeart size={18} className="mr-2" />
              Elements
            </h2>
            <ElementGrid 
              elements={discoveredElements}
              onElementClick={handleElementClick}
              selectedElements={gameState.combiningElements as string[]}
              combineZoneRef={combineZoneRef}
              onElementDetails={handleViewElementDetails}
            />
          </div>
        </motion.div>
        
        <motion.div
          className={`${activeTab === 'discoveries' || window.innerWidth >= 1024 ? 'block' : 'hidden'}`}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BookMarked size={18} className="mr-2" />
              Discoveries
            </h2>
            <DiscoveryLog 
              discoveries={gameState.discoveries || []}
              elements={gameState.elements || []}
              onElementClick={handleViewElementDetails}
            />
          </div>
        </motion.div>
        
        <motion.div
          className={`${activeTab === 'achievements' && window.innerWidth < 1024 ? 'block' : 'hidden'}`}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Award size={18} className="mr-2" />
              Achievements
            </h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{achievementState.achievements.filter(a => a.unlocked).length} of {achievementState.achievements.length} unlocked</span>
                <span>{Math.round((achievementState.achievements.filter(a => a.unlocked).length / achievementState.achievements.length) * 100)}%</span>
              </div>
              <Progress value={(achievementState.achievements.filter(a => a.unlocked).length / achievementState.achievements.length) * 100} className="h-2" />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {achievementState.achievements
                .filter(a => a.unlocked)
                .slice(0, 5)
                .map(achievement => (
                  <div key={achievement.id} className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg flex items-start">
                    <div className="mr-3 text-xl">{achievement.icon}</div>
                    <div>
                      <div className="font-medium text-sm">{achievement.name}</div>
                      <div className="text-xs text-gray-500">{achievement.description}</div>
                    </div>
                  </div>
                ))}
            </div>
            <Button 
              className="w-full mt-4"
              onClick={() => setShowAchievements(true)}
              variant="outline"
            >
              View All Achievements
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Improved tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTutorial(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full shadow-xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Welcome to Element Alchemy</h2>
              <div className="space-y-4 mb-6">
                <p>Combine elements to discover new ones in this alchemical adventure!</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong>Drag and drop</strong> elements into the combination area</li>
                  <li><strong>Experiment</strong> with different combinations</li>
                  <li><strong>Discover</strong> all elements</li>
                  <li><strong>Earn achievements</strong> as you progress</li>
                </ol>
                <p>Start with the basic elements: Air, Water, Fire, and Earth.</p>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary/80" 
                onClick={() => setShowTutorial(false)}
              >
                Let's Begin!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Achievements panel */}
      <AnimatePresence>
        {showAchievements && (
          <AchievementsPanel 
            achievements={achievementState.achievements}
            onClose={() => setShowAchievements(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Element details panel */}
      <AnimatePresence>
        {viewedElement && (
          <ElementDetails 
            element={viewedElement}
            onClose={handleCloseElementDetails}
            discovery={viewedElementDiscovery}
            elementCounts={elementCounts}
          />
        )}
      </AnimatePresence>
      
      {/* Improved stats modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStats(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full shadow-xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <BarChart3 className="mr-2" />
                  Game Statistics
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowStats(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Elements Discovered</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{stats.discoveredElements} of {stats.totalElements}</span>
                    <span>{stats.percentComplete}%</span>
                  </div>
                  <Progress value={stats.percentComplete} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 dark:bg-gray-800/20 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Basic Elements</div>
                    <div className="text-lg font-semibold">{stats.basicElements}</div>
                  </div>
                  <div className="bg-white/10 dark:bg-gray-800/20 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Compounds</div>
                    <div className="text-lg font-semibold">{stats.compoundElements}</div>
                  </div>
                  <div className="bg-white/10 dark:bg-gray-800/20 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Advanced</div>
                    <div className="text-lg font-semibold">{stats.advancedElements}</div>
                  </div>
                  <div className="bg-white/10 dark:bg-gray-800/20 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Scientific</div>
                    <div className="text-lg font-semibold">{stats.scientificElements}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Combinations Found</h3>
                  <div className="bg-white/10 dark:bg-gray-800/20 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Total Discoveries</div>
                    <div className="text-lg font-semibold">{gameState.discoveries ? gameState.discoveries.length : 0}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Game Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 dark:bg-gray-800/20 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Level</div>
                      <div className="text-lg font-semibold">{gameState.level}</div>
                    </div>
                    <div className="bg-white/10 dark:bg-gray-800/20 p-3 rounded-lg">
                      <div className="text-xs text-gray-500">Score</div>
                      <div className="text-lg font-semibold">{gameState.score}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80" 
                onClick={() => setShowStats(false)}
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameContainer;

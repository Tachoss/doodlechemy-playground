import { Element, Combination, initialElements, getAllCombinations } from './elementData';
import { Achievement, initializeAchievements, processAchievements, AchievementState } from './achievementSystem';
import { toast } from '@/hooks/use-toast';

export interface GameState {
  elements: Element[];
  discoveries: Discovery[];
  combiningElements: [string | null, string | null];
  level: number;
  score: number;
  successfulCombosInARow: number;
  lastCombinationSuccess: boolean | null;
  viewedElementDetails: string | null;
  combinationCounts: Record<string, number>;
  favorites: string[];
  currentComboChain: number;
  maxComboChain: number;
  elementPowers: Record<string, number>;
  comboMultiplier: number;
  totalPowerGained: number;
}

export interface Discovery {
  id: string;
  result: string;
  timestamp: number;
  elements: [string, string];
  description: string;
}

export interface GameProgress {
  gameState: GameState;
  achievementState: AchievementState;
}

// Default empty game state to use when needed
const defaultGameState: GameState = {
  elements: initialElements,
  discoveries: [],
  combiningElements: [null, null],
  level: 1,
  score: 0,
  successfulCombosInARow: 0,
  lastCombinationSuccess: null,
  viewedElementDetails: null,
  combinationCounts: {},
  favorites: [],
  currentComboChain: 0,
  maxComboChain: 0,
  elementPowers: {},
  comboMultiplier: 1,
  totalPowerGained: 0
};

export const initializeGame = (): GameProgress => {
  // Check if we have saved game state
  const savedState = localStorage.getItem('elementAlchemyState');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      // Make sure the parsed state has the expected structure
      if (parsedState && 
          parsedState.gameState && 
          Array.isArray(parsedState.gameState.elements) &&
          Array.isArray(parsedState.gameState.discoveries)) {
        return parsedState;
      }
    } catch (e) {
      console.error('Error loading saved game:', e);
    }
  }
  
  // Return default state with initial elements
  return {
    gameState: {
      elements: initialElements,
      discoveries: [],
      combiningElements: [null, null],
      level: 1,
      score: 0,
      successfulCombosInARow: 0,
      lastCombinationSuccess: null,
      viewedElementDetails: null,
      combinationCounts: {},
      favorites: [],
      currentComboChain: 0,
      maxComboChain: 0,
      elementPowers: {},
      comboMultiplier: 1,
      totalPowerGained: 0
    },
    achievementState: {
      achievements: initializeAchievements(),
      lastUnlocked: null
    }
  };
};

export const saveGame = (gameProgress: GameProgress): void => {
  if (!gameProgress || !gameProgress.gameState) {
    console.error('Invalid game progress, cannot save');
    return;
  }
  localStorage.setItem('elementAlchemyState', JSON.stringify(gameProgress));
};

export const resetGame = (): GameProgress => {
  localStorage.removeItem('elementAlchemyState');
  return initializeGame();
};

const calculatePowerGain = (combination: Combination, currentMultiplier: number): number => {
  const basePower = {
    'easy': 1,
    'medium': 2,
    'hard': 4,
    'very-hard': 8
  }[combination.difficulty] || 1;

  return Math.round(basePower * currentMultiplier);
};

export const combineElements = (
  gameProgress: GameProgress,
  elementIds: [string, string]
): { 
  newGameProgress: GameProgress, 
  newDiscovery: Discovery | null,
  success: boolean,
  powerGained?: number
} => {
  // Add null checks
  if (!gameProgress || !gameProgress.gameState || !gameProgress.achievementState) {
    console.error('Invalid gameProgress in combineElements');
    return { 
      newGameProgress: gameProgress || initializeGame(),
      newDiscovery: null,
      success: false
    };
  }
  
  const { gameState, achievementState } = gameProgress;
  const [elementId1, elementId2] = elementIds;
  
  // Sort the elements to match how they're stored in combinations
  const sortedIds: [string, string] = [elementId1, elementId2].sort() as [string, string];
  
  // Get all possible combinations including the extra ones
  const allCombinations = getAllCombinations();
  
  // Check for combination in either direction
  const combination = allCombinations.find(
    c => (c.elements[0] === sortedIds[0] && c.elements[1] === sortedIds[1]) ||
         (c.elements[0] === sortedIds[1] && c.elements[1] === sortedIds[0])
  );
  
  if (!combination) {
    const newGameState: GameState = {
      ...gameState,
      combiningElements: [null, null],
      successfulCombosInARow: 0,
      lastCombinationSuccess: false
    };
    
    return { 
      newGameProgress: {
        gameState: newGameState,
        achievementState
      },
      newDiscovery: null,
      success: false
    };
  }
  
  // Find the result element
  const resultElement = gameState.elements.find(e => e.id === combination.result);
  
  if (!resultElement) {
    console.error(`Result element ${combination.result} not found!`);
    return { 
      newGameProgress: {
        gameState: {
          ...gameState,
          combiningElements: [null, null],
          successfulCombosInARow: 0,
          lastCombinationSuccess: false
        },
        achievementState
      },
      newDiscovery: null,
      success: false
    };
  }
  
  // Check if this is a new discovery
  const isNewDiscovery = !resultElement.discovered;
  
  // Create updated elements array with the result marked as discovered
  const updatedElements = gameState.elements.map(element => 
    element.id === resultElement.id
      ? { ...element, discovered: true }
      : element
  );
  
  // Create discovery record
  const discoveryRecord: Discovery = {
    id: `${Date.now()}`,
    result: resultElement.id,
    timestamp: Date.now(),
    elements: sortedIds,
    description: combination.description
  };
  
  // Calculate score based on difficulty and if it's a new discovery
  let pointsGained = 0;
  switch (combination.difficulty) {
    case 'easy':
      pointsGained = isNewDiscovery ? 10 : 1;
      break;
    case 'medium':
      pointsGained = isNewDiscovery ? 25 : 3;
      break;
    case 'hard':
      pointsGained = isNewDiscovery ? 50 : 5;
      break;
    case 'very-hard':
      pointsGained = isNewDiscovery ? 100 : 10;
      break;
    default:
      pointsGained = isNewDiscovery ? 15 : 2;
  }
  
  // Calculate level based on discoveries
  const discoveryCount = isNewDiscovery 
    ? gameState.elements.filter(e => e.discovered).length + 1 
    : gameState.elements.filter(e => e.discovered).length;
  
  const newLevel = Math.floor(discoveryCount / 5) + 1;
  
  // Update combo counter
  const newSuccessfulCombosInARow = gameState.successfulCombosInARow + 1;
  
  // Update combination counts
  const combinationCounts = gameState.combinationCounts || {};
  elementIds.forEach(id => {
    combinationCounts[id] = (combinationCounts[id] || 0) + 1;
  });

  // Update combo chain
  const currentComboChain = true ? (gameState.currentComboChain || 0) + 1 : 0;
  const maxComboChain = Math.max(currentComboChain, gameState.maxComboChain || 0);

  // Update state
  let newGameState: GameState = {
    elements: updatedElements,
    discoveries: isNewDiscovery 
      ? [discoveryRecord, ...gameState.discoveries]
      : gameState.discoveries,
    combiningElements: [null, null],
    level: newLevel,
    score: gameState.score + pointsGained,
    successfulCombosInARow: newSuccessfulCombosInARow,
    lastCombinationSuccess: true,
    viewedElementDetails: gameState.viewedElementDetails,
    combinationCounts,
    favorites: gameState.favorites || [],
    currentComboChain,
    maxComboChain,
    elementPowers: gameState.elementPowers || {},
    comboMultiplier: gameState.comboMultiplier || 1,
    totalPowerGained: gameState.totalPowerGained || 0
  };
  
  if (true) {
    // Calculate power gain
    const powerGain = calculatePowerGain(combination, gameState.comboMultiplier);
    const newElementPowers = { ...gameState.elementPowers };
    elementIds.forEach(id => {
      newElementPowers[id] = (newElementPowers[id] || 0) + powerGain;
    });

    // Update multiplier
    const newMultiplier = Math.min(gameState.comboMultiplier + 0.1, 3.0);

    newGameState = {
      ...newGameState,
      elementPowers: newElementPowers,
      comboMultiplier: newMultiplier,
      totalPowerGained: (gameState.totalPowerGained || 0) + powerGain
    };
  } else {
    // Reset multiplier on failure
    newGameState.comboMultiplier = 1;
  }

  // Process achievements after state update
  const { updatedAchievementState, rewards } = processAchievements(newGameState, achievementState);
  
  // Apply any rewards
  let rewardedGameState = newGameState;
  if (rewards.length > 0) {
    rewards.forEach(reward => {
      if (reward) {
        // Handle different types of rewards
        switch (reward.type) {
          case 'element':
            // Unlock a specific element
            rewardedGameState.elements = rewardedGameState.elements.map(element => 
              element.id === reward.value
                ? { ...element, discovered: true }
                : element
            );
            toast({
              title: "New Element Unlocked!",
              description: `You've unlocked the ${reward.value} element as a reward!`,
              variant: "default"
            });
            break;
          case 'category':
            // Reveal a whole category for discovery
            toast({
              title: "New Category Unlocked!",
              description: `You can now discover elements in the ${reward.value} category!`,
              variant: "default"
            });
            break;
          case 'hint':
            // Provide a hint about a combination
            toast({
              title: "Hint Unlocked!",
              description: reward.value,
              variant: "default"
            });
            break;
        }
      }
    });
  }
  
  // If this is a new discovery, return it
  const newDiscovery = isNewDiscovery ? discoveryRecord : null;
  
  // Level up notification
  if (newLevel > gameState.level) {
    toast({
      title: "Level Up!",
      description: `You've reached level ${newLevel}!`,
      variant: "default"
    });
  }
  
  // Save state
  const newGameProgress = {
    gameState: rewardedGameState,
    achievementState: updatedAchievementState
  };
  saveGame(newGameProgress);
  
  return { 
    newGameProgress, 
    newDiscovery, 
    success: true 
  };
};

export const getElementByID = (gameState: GameState, id: string): Element | undefined => {
  // Add null check to prevent accessing properties of undefined
  if (!gameState || !gameState.elements) {
    console.error('GameState or gameState.elements is undefined in getElementByID');
    return undefined;
  }
  return gameState.elements.find(e => e.id === id);
};

export const getDiscoveredElements = (gameState: GameState): Element[] => {
  // Add null check to prevent accessing properties of undefined
  if (!gameState || !gameState.elements) {
    console.error('GameState or gameState.elements is undefined in getDiscoveredElements');
    return [];
  }
  return gameState.elements.filter(e => e.discovered);
};

export const getElementsByCategory = (gameState: GameState): Record<string, Element[]> => {
  if (!gameState || !gameState.elements) {
    return {};
  }
  
  const discovered = getDiscoveredElements(gameState);
  
  return discovered.reduce((acc, element) => {
    const category = element.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(element);
    return acc;
  }, {} as Record<string, Element[]>);
};

export const getGameStats = (gameState: GameState): {
  totalElements: number;
  discoveredElements: number;
  percentComplete: number;
  basicElements: number;
  compoundElements: number;
  advancedElements: number;
  rareElements: number;
  scientificElements: number;
} => {
  // Add null check to prevent accessing properties of undefined
  if (!gameState || !gameState.elements) {
    console.error('GameState or gameState.elements is undefined in getGameStats');
    return {
      totalElements: 0,
      discoveredElements: 0,
      percentComplete: 0,
      basicElements: 0,
      compoundElements: 0,
      advancedElements: 0,
      rareElements: 0,
      scientificElements: 0
    };
  }
  
  const discovered = getDiscoveredElements(gameState);
  
  // Add null check for discovered
  if (!discovered) {
    return {
      totalElements: gameState.elements.length,
      discoveredElements: 0,
      percentComplete: 0,
      basicElements: 0,
      compoundElements: 0,
      advancedElements: 0,
      rareElements: 0,
      scientificElements: 0
    };
  }
  
  const total = gameState.elements.length;
  
  return {
    totalElements: total,
    discoveredElements: discovered.length,
    percentComplete: Math.round((discovered.length / total) * 100),
    basicElements: discovered.filter(e => e.category === 'basic').length,
    compoundElements: discovered.filter(e => e.category === 'compound').length,
    advancedElements: discovered.filter(e => e.category === 'advanced').length,
    rareElements: discovered.filter(e => e.category === 'rare').length,
    scientificElements: discovered.filter(e => e.category === 'scientific').length
  };
};

export const getRandomHint = (gameState: GameState): { 
  hint: string, 
  elements?: [string, string] 
} => {
  if (!gameState || !gameState.elements) {
    return { hint: "Try combining the basic elements to get started!" };
  }
  
  const possibleCombinations = getPossibleCombinations(gameState);
  
  // If no possible combinations are found
  if (!possibleCombinations || possibleCombinations.length === 0) {
    const discoveredElements = getDiscoveredElements(gameState);
    
    // Check if the player has discovered almost everything
    if (discoveredElements.length > gameState.elements.length * 0.8) {
      return { hint: "You've discovered most elements! Keep combining to find the rare ones." };
    }
    
    // If they're stuck at the beginning
    if (discoveredElements.length <= 6) {
      return { hint: "Try combining the basic elements (Air, Water, Fire, Earth) in different ways." };
    }
    
    // General hint
    return { hint: "Try combining elements you haven't paired yet." };
  }
  
  // Get a random combination hint
  const randomCombo = possibleCombinations[Math.floor(Math.random() * possibleCombinations.length)];
  const element1 = gameState.elements.find(e => e.id === randomCombo.elements[0]);
  const element2 = gameState.elements.find(e => e.id === randomCombo.elements[1]);
  
  if (element1 && element2) {
    // Different hint types for variety
    const hintTypes = [
      `Try combining ${element1.name} with ${element2.name}.`,
      `What happens when ${element1.name} meets ${element2.name}?`,
      `Have you tried mixing ${element1.name} and ${element2.name} yet?`,
      `A magical reaction might occur between ${element1.name} and ${element2.name}.`,
      `${element1.name} and ${element2.name} might create something interesting!`
    ];
    
    const randomHint = hintTypes[Math.floor(Math.random() * hintTypes.length)];
    return { 
      hint: randomHint,
      elements: [element1.id, element2.id]
    };
  }
  
  return { hint: "Keep experimenting with different combinations!" };
};

export const viewElementDetails = (
  gameProgress: GameProgress,
  elementId: string | null
): GameProgress => {
  if (!gameProgress) {
    return initializeGame();
  }
  
  return {
    ...gameProgress,
    gameState: {
      ...(gameProgress.gameState || defaultGameState),
      viewedElementDetails: elementId
    }
  };
};

export const attemptCombination = (gameProgress: GameProgress): {
  newGameProgress: GameProgress;
  success: boolean;
  newElement?: Element;
} => {
  if (!gameProgress || !gameProgress.gameState) {
    console.error('Invalid gameProgress in attemptCombination');
    return { 
      newGameProgress: gameProgress || initializeGame(), 
      success: false 
    };
  }
  
  const { gameState } = gameProgress;
  const [element1, element2] = gameState.combiningElements;
  
  // If either slot is empty, can't combine
  if (element1 === null || element2 === null) {
    return { newGameProgress: gameProgress, success: false };
  }
  
  // Try to combine
  const { newGameProgress, newDiscovery, success } = combineElements(
    gameProgress, 
    [element1, element2]
  );
  
  // If successful and it's a new discovery, show toast
  if (success && newDiscovery) {
    const newElement = newGameProgress.gameState.elements.find(e => e.id === newDiscovery.result);
    
    toast({
      title: "New Discovery!",
      description: `You created ${newElement?.name || newDiscovery.result}`,
      variant: "default"
    });
    
    return { 
      newGameProgress, 
      success: true,
      newElement: newElement
    };
  }
  
  if (success) {
    // Get all possible combinations
    const allCombinations = getAllCombinations();
    
    const resultElement = newGameProgress.gameState.elements.find(
      e => e.id === allCombinations.find(
        c => (c.elements[0] === element1 && c.elements[1] === element2) ||
             (c.elements[0] === element2 && c.elements[1] === element1)
      )?.result
    );
    
    return { 
      newGameProgress, 
      success: true,
      newElement: resultElement 
    };
  }
  
  return { newGameProgress, success: false };
};

export const getPossibleCombinations = (gameState: GameState): Combination[] => {
  if (!gameState || !gameState.elements) {
    return [];
  }
  
  const discoveredElements = getDiscoveredElements(gameState);
  const discoveredIds = discoveredElements.map(e => e.id);
  
  // Get all possible combinations
  const allCombinations = getAllCombinations();
  
  // Find combinations where both elements are discovered
  const possibleCombinations = allCombinations.filter(c => {
    const [elementId1, elementId2] = c.elements;
    
    // Check if both elements are discovered
    const bothElementsDiscovered = 
      discoveredIds.includes(elementId1) && 
      discoveredIds.includes(elementId2);
    
    // Check if result is still undiscovered
    const resultElement = gameState.elements.find(e => e.id === c.result);
    const resultUndiscovered = resultElement && !resultElement.discovered;
    
    return bothElementsDiscovered && resultUndiscovered;
  });
  
  return possibleCombinations;
};

export const getAIAssistantMessage = (gameState: GameState): string => {
  if (!gameState || !gameState.elements) {
    return "Welcome to Element Alchemy! Try combining the basic elements to start your journey.";
  }
  
  const discoveredCount = getDiscoveredElements(gameState).length;
  const totalElements = gameState.elements.length;
  const percentDiscovered = Math.round((discoveredCount / totalElements) * 100);
  
  // Get hints for potential combinations
  const hintInfo = getRandomHint(gameState);
  
  // Different messages based on game progress
  if (percentDiscovered < 10) {
    return "Start by combining the basic elements - Air, Water, Fire, and Earth. Try different combinations to see what you can create!";
  } else if (percentDiscovered < 25) {
    return `Great progress! You've discovered ${discoveredCount} elements so far. Remember that you can combine newly created elements with basic ones to discover more complex elements.`;
  } else if (percentDiscovered < 50) {
    return `You've discovered ${discoveredCount} elements (${percentDiscovered}%)! Keep experimenting with different combinations to unlock rare elements. ${hintInfo.hint}`;
  } else if (percentDiscovered < 75) {
    return `You're becoming a master alchemist with ${discoveredCount} elements discovered! Try some unexpected combinations - sometimes the most unlikely pairs create amazing results.`;
  } else {
    return `Impressive! You've discovered ${discoveredCount} out of ${totalElements} elements (${percentDiscovered}%). Only the rarest combinations remain! Keep experimenting to find them all.`;
  }
};

export const toggleFavorite = (gameProgress: GameProgress, elementId: string): GameProgress => {
  if (!gameProgress?.gameState) return gameProgress;
  
  const favorites = gameProgress.gameState.favorites || [];
  const newFavorites = favorites.includes(elementId) 
    ? favorites.filter(id => id !== elementId)
    : [...favorites, elementId];
    
  return {
    ...gameProgress,
    gameState: {
      ...gameProgress.gameState,
      favorites: newFavorites
    }
  };
};

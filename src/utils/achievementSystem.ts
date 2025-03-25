
import { GameState, Discovery } from './gameLogic';
import { Element } from './elementData';
import { toast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  condition: (state: GameState) => boolean;
  reward?: {
    type: 'element' | 'hint' | 'category';
    value: string;
  };
}

export interface AchievementState {
  achievements: Achievement[];
  lastUnlocked: string | null;
}

export const initializeAchievements = (): Achievement[] => {
  return [
    {
      id: 'first_discovery',
      name: 'First Steps',
      description: 'Make your first discovery',
      icon: '🥚',
      unlocked: false,
      condition: (state: GameState) => state.discoveries.length > 0
    },
    {
      id: 'five_discoveries',
      name: 'Getting Started',
      description: 'Discover 5 elements',
      icon: '🐣',
      unlocked: false,
      condition: (state: GameState) => state.elements.filter(e => e.discovered).length >= 5
    },
    {
      id: 'ten_discoveries',
      name: 'Chemist Apprentice',
      description: 'Discover 10 elements',
      icon: '🧪',
      unlocked: false,
      condition: (state: GameState) => state.elements.filter(e => e.discovered).length >= 10
    },
    {
      id: 'twenty_discoveries',
      name: 'Mad Scientist',
      description: 'Discover 20 elements',
      icon: '👨‍🔬',
      unlocked: false,
      condition: (state: GameState) => state.elements.filter(e => e.discovered).length >= 20
    },
    {
      id: 'all_basic',
      name: 'Back to Basics',
      description: 'Discover all basic elements',
      icon: '🌍',
      unlocked: false,
      condition: (state: GameState) => {
        const basicElements = state.elements.filter(e => e.category === 'basic');
        return basicElements.every(e => e.discovered);
      }
    },
    {
      id: 'first_compound',
      name: 'Compound Interest',
      description: 'Create your first compound',
      icon: '🧬',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.category === 'compound' && e.discovered);
      }
    },
    {
      id: 'first_advanced',
      name: 'Advanced Placement',
      description: 'Create your first advanced element',
      icon: '🚀',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.category === 'advanced' && e.discovered);
      }
    },
    {
      id: 'first_scientific',
      name: 'For Science!',
      description: 'Discover your first scientific element',
      icon: '⚗️',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.category === 'scientific' && e.discovered);
      },
      reward: {
        type: 'category',
        value: 'scientific'
      }
    },
    {
      id: 'first_rare',
      name: 'Rare Find',
      description: 'Discover your first rare element',
      icon: '💎',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.category === 'rare' && e.discovered);
      },
      reward: {
        type: 'category',
        value: 'rare'
      }
    },
    {
      id: 'first_legendary',
      name: 'Legendary',
      description: 'Discover your first legendary element',
      icon: '👑',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.rarity === 'legendary' && e.discovered);
      }
    },
    {
      id: 'create_life',
      name: 'Genesis',
      description: 'Create life',
      icon: '🌱',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.id === 'life' && e.discovered);
      }
    },
    {
      id: 'create_human',
      name: 'Playing God',
      description: 'Create human life',
      icon: '👤',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.id === 'human' && e.discovered);
      }
    },
    {
      id: 'create_time',
      name: 'Time Lord',
      description: 'Master the flow of time',
      icon: '⏳',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.id === 'time' && e.discovered);
      }
    },
    {
      id: 'dragon_tamer',
      name: 'Dragon Tamer',
      description: 'Discover and tame a dragon',
      icon: '🐉',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.id === 'dragon' && e.discovered);
      }
    },
    {
      id: 'internet_explorer',
      name: 'Internet Explorer',
      description: 'Create the Internet',
      icon: '🌐',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.id === 'internet' && e.discovered);
      }
    },
    {
      id: 'universe_creator',
      name: 'Universal Creator',
      description: 'Create the entire universe',
      icon: '🌌',
      unlocked: false,
      condition: (state: GameState) => {
        return state.elements.some(e => e.id === 'universe' && e.discovered);
      }
    },
    {
      id: 'combo_master',
      name: 'Combo Master',
      description: 'Make 3 discoveries in a row without failures',
      icon: '🔥',
      unlocked: false,
      condition: (state: GameState) => {
        if (state.successfulCombosInARow >= 3) {
          return true;
        }
        return false;
      }
    },
    {
      id: 'element_collector',
      name: 'Element Collector',
      description: 'Discover at least one element from each category',
      icon: '🗃️',
      unlocked: false,
      condition: (state: GameState) => {
        const categories = ['basic', 'compound', 'advanced', 'rare', 'scientific'];
        return categories.every(category => 
          state.elements.some(e => e.category === category && e.discovered)
        );
      }
    }
  ];
};

export const checkAchievements = (
  gameState: GameState, 
  currentAchievements: Achievement[]
): { 
  updatedAchievements: Achievement[], 
  newlyUnlocked: Achievement[]
} => {
  // Add null check for gameState
  if (!gameState) {
    console.error('GameState is undefined in checkAchievements');
    return { updatedAchievements: currentAchievements, newlyUnlocked: [] };
  }
  
  let newlyUnlocked: Achievement[] = [];
  
  const updatedAchievements = currentAchievements.map(achievement => {
    // Skip already unlocked achievements
    if (achievement.unlocked) {
      return achievement;
    }
    
    // Check if condition is met
    if (achievement.condition(gameState)) {
      newlyUnlocked.push({...achievement, unlocked: true});
      return {...achievement, unlocked: true};
    }
    
    return achievement;
  });
  
  return { updatedAchievements, newlyUnlocked };
};

export const processAchievements = (
  gameState: GameState, 
  achievementState: AchievementState
): { 
  updatedAchievementState: AchievementState,
  rewards: Achievement['reward'][]
} => {
  // Add null check for gameState
  if (!gameState || !achievementState) {
    console.error('GameState or achievementState is undefined in processAchievements');
    return { 
      updatedAchievementState: achievementState || { achievements: [], lastUnlocked: null },
      rewards: []
    };
  }
  
  const { updatedAchievements, newlyUnlocked } = checkAchievements(
    gameState, 
    achievementState.achievements
  );
  
  const rewards: Achievement['reward'][] = [];
  
  // Process rewards from newly unlocked achievements
  newlyUnlocked.forEach(achievement => {
    // Show toast notification
    toast({
      title: "Achievement Unlocked!",
      description: `${achievement.icon} ${achievement.name}: ${achievement.description}`,
      variant: "default"
    });
    
    // Collect rewards
    if (achievement.reward) {
      rewards.push(achievement.reward);
    }
    
    // Update last unlocked achievement
    achievementState.lastUnlocked = achievement.id;
  });
  
  return {
    updatedAchievementState: {
      ...achievementState,
      achievements: updatedAchievements,
      lastUnlocked: newlyUnlocked.length > 0 
        ? newlyUnlocked[newlyUnlocked.length - 1].id 
        : achievementState.lastUnlocked
    },
    rewards
  };
};

export const getUnlockedAchievements = (achievements: Achievement[]): Achievement[] => {
  return achievements.filter(a => a.unlocked);
};

export const getLockedAchievements = (achievements: Achievement[]): Achievement[] => {
  return achievements.filter(a => !a.unlocked);
};

export const getAchievementProgress = (achievements: Achievement[]): {
  total: number;
  unlocked: number;
  percentage: number;
} => {
  const total = achievements.length;
  const unlocked = achievements.filter(a => a.unlocked).length;
  const percentage = Math.round((unlocked / total) * 100);
  
  return {
    total,
    unlocked,
    percentage
  };
};

import { toast } from '@/hooks/use-toast';
import { GameState } from './gameLogic';
import { getElementByID } from './gameLogic';

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  cost: number;
  unlocked: boolean;
  cooldown: number; // in seconds
  lastUsed: number | null; // timestamp
  effect: (gameState: GameState) => GameState;
}

export interface PowerUpsState {
  availablePowerUps: PowerUp[];
  activePowerUps: string[]; // IDs of active power-ups
}

// Initialize the power-ups system
export const initializePowerUps = (): PowerUpsState => {
  return {
    availablePowerUps: [
      {
        id: 'multiplier_boost',
        name: 'Multiplier Boost',
        description: 'Doubles your combo multiplier for the next 3 combinations',
        icon: 'Zap',
        cost: 50,
        unlocked: true,
        cooldown: 60, // 1 minute cooldown
        lastUsed: null,
        effect: (gameState: GameState): GameState => {
          return {
            ...gameState,
            comboMultiplier: gameState.comboMultiplier * 2
          };
        }
      },
      {
        id: 'element_revealer',
        name: 'Element Revealer',
        description: 'Reveals a random undiscovered element',
        icon: 'Eye',
        cost: 100,
        unlocked: true,
        cooldown: 180, // 3 minute cooldown
        lastUsed: null,
        effect: (gameState: GameState): GameState => {
          // Find all undiscovered elements
          const undiscoveredElements = gameState.elements.filter(e => !e.discovered);
          
          // If there are no undiscovered elements, return the state unchanged
          if (undiscoveredElements.length === 0) {
            toast({
              title: "No elements to reveal",
              description: "You've discovered all elements!",
              variant: "destructive"
            });
            return gameState;
          }
          
          // Pick a random undiscovered element
          const randomElement = undiscoveredElements[Math.floor(Math.random() * undiscoveredElements.length)];
          
          // Update the elements array with this element marked as discovered
          const updatedElements = gameState.elements.map(element => 
            element.id === randomElement.id
              ? { ...element, discovered: true }
              : element
          );
          
          // Create a discovery record
          const discoveryRecord = {
            id: `power-up-reveal-${Date.now()}`,
            result: randomElement.id,
            timestamp: Date.now(),
            elements: ['power-up', 'revealer'] as [string, string],
            description: "Revealed by using the Element Revealer power-up!"
          };
          
          // Show toast
          toast({
            title: "Element Revealed!",
            description: `You've unlocked the ${randomElement.name} element`,
            variant: "default"
          });
          
          return {
            ...gameState,
            elements: updatedElements,
            discoveries: [discoveryRecord, ...gameState.discoveries]
          };
        }
      },
      {
        id: 'power_surge',
        name: 'Power Surge',
        description: 'Instantly gain power for all your elements',
        icon: 'Battery',
        cost: 75,
        unlocked: true,
        cooldown: 120, // 2 minute cooldown
        lastUsed: null,
        effect: (gameState: GameState): GameState => {
          // Calculate power to give to each element (based on level)
          const powerBoost = gameState.level * 5;
          
          // Get all discovered elements
          const discoveredElements = gameState.elements.filter(e => e.discovered);
          
          // Update element powers
          const updatedPowers = { ...gameState.elementPowers };
          discoveredElements.forEach(element => {
            updatedPowers[element.id] = (updatedPowers[element.id] || 0) + powerBoost;
          });
          
          // Show toast
          toast({
            title: "Power Surge!",
            description: `Added ${powerBoost} power to all your elements`,
            variant: "default"
          });
          
          return {
            ...gameState,
            elementPowers: updatedPowers,
            totalPowerGained: gameState.totalPowerGained + (powerBoost * discoveredElements.length)
          };
        }
      },
      {
        id: 'smart_hint',
        name: 'Smart Hint',
        description: 'Provides a specific hint for a new element combination',
        icon: 'Lightbulb',
        cost: 30,
        unlocked: true,
        cooldown: 90, // 1.5 minute cooldown
        lastUsed: null,
        effect: (gameState: GameState): GameState => {
          // Implementation will use the existing hint system from gameLogic.ts
          // but will provide a more specific hint
          // This doesn't change the gameState directly
          return gameState;
        }
      }
    ],
    activePowerUps: []
  };
};

// Function to check if a power-up is available to use
export const isPowerUpAvailable = (
  powerUp: PowerUp, 
  gameState: GameState
): { available: boolean; reason?: string } => {
  // Check if it's on cooldown
  if (powerUp.lastUsed) {
    const elapsedSeconds = (Date.now() - powerUp.lastUsed) / 1000;
    if (elapsedSeconds < powerUp.cooldown) {
      const remainingSeconds = Math.ceil(powerUp.cooldown - elapsedSeconds);
      return { 
        available: false, 
        reason: `Cooldown: ${remainingSeconds}s remaining` 
      };
    }
  }
  
  // Check if player has enough power to use it
  if (gameState.totalPowerGained < powerUp.cost) {
    return { 
      available: false, 
      reason: `Need ${powerUp.cost - gameState.totalPowerGained} more power` 
    };
  }
  
  return { available: true };
};

// Function to activate a power-up
export const activatePowerUp = (
  gameState: GameState,
  powerUpId: string,
  powerUpState: PowerUpsState
): { newGameState: GameState; newPowerUpState: PowerUpsState } => {
  // Find the power-up
  const powerUp = powerUpState.availablePowerUps.find(p => p.id === powerUpId);
  
  if (!powerUp) {
    toast({
      title: "Error",
      description: "Power-up not found",
      variant: "destructive"
    });
    return { newGameState: gameState, newPowerUpState: powerUpState };
  }
  
  // Check if it's available
  const { available, reason } = isPowerUpAvailable(powerUp, gameState);
  
  if (!available) {
    toast({
      title: "Power-up not available",
      description: reason || "Unable to use this power-up right now",
      variant: "destructive"
    });
    return { newGameState: gameState, newPowerUpState: powerUpState };
  }
  
  // Apply the power-up effect
  const updatedGameState = powerUp.effect(gameState);
  
  // Apply cost
  const newGameState = {
    ...updatedGameState,
    totalPowerGained: updatedGameState.totalPowerGained - powerUp.cost
  };
  
  // Update the power-up state
  const newPowerUpState = {
    ...powerUpState,
    availablePowerUps: powerUpState.availablePowerUps.map(p => 
      p.id === powerUpId
        ? { ...p, lastUsed: Date.now() }
        : p
    ),
    activePowerUps: [...powerUpState.activePowerUps, powerUpId]
  };
  
  toast({
    title: `${powerUp.name} Activated!`,
    description: powerUp.description,
    variant: "default"
  });
  
  return { newGameState, newPowerUpState };
};

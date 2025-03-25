
export interface Element {
  id: string;
  name: string;
  symbol: string;
  color: string;
  category: 'basic' | 'compound' | 'advanced' | 'rare' | 'scientific';
  discovered: boolean;
  description?: string;
  atomicNumber?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  group?: string;
}

export interface Combination {
  elements: [string, string];
  result: string;
  description: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'very-hard';
}

// Basic starter elements
export const initialElements: Element[] = [
  // Basic elements - available at start
  { id: 'air', name: 'Air', symbol: '💨', color: '#A6E1FA', category: 'basic', discovered: true, rarity: 'common', description: 'The atmosphere around us' },
  { id: 'water', name: 'Water', symbol: '💧', color: '#0CA5E9', category: 'basic', discovered: true, rarity: 'common', description: 'The essence of life, H₂O' },
  { id: 'fire', name: 'Fire', symbol: '🔥', color: '#F97316', category: 'basic', discovered: true, rarity: 'common', description: 'Heat and flame' },
  { id: 'earth', name: 'Earth', symbol: '🌍', color: '#A16207', category: 'basic', discovered: true, rarity: 'common', description: 'Solid ground and soil' },
  
  // Compounds - level 1
  { id: 'steam', name: 'Steam', symbol: '♨️', color: '#94A3B8', category: 'compound', discovered: false, rarity: 'common', description: 'Water in gaseous form' },
  { id: 'lava', name: 'Lava', symbol: '🌋', color: '#EF4444', category: 'compound', discovered: false, rarity: 'uncommon', description: 'Molten rock from Earth\'s core' },
  { id: 'mud', name: 'Mud', symbol: '💩', color: '#78350F', category: 'compound', discovered: false, rarity: 'common', description: 'A mixture of earth and water' },
  { id: 'energy', name: 'Energy', symbol: '⚡', color: '#8B5CF6', category: 'compound', discovered: false, rarity: 'uncommon', description: 'The power to do work' },
  { id: 'smoke', name: 'Smoke', symbol: '🌫️', color: '#64748B', category: 'compound', discovered: false, rarity: 'common', description: 'Airborne particles from combustion' },
  { id: 'dust', name: 'Dust', symbol: '🌫️', color: '#D1D5DB', category: 'compound', discovered: false, rarity: 'common', description: 'Tiny particles of solid matter' },
  
  // Compounds - level 2
  { id: 'metal', name: 'Metal', symbol: '⚙️', color: '#71717A', category: 'compound', discovered: false, rarity: 'uncommon', description: 'Strong, conductive material' },
  { id: 'wood', name: 'Wood', symbol: '🌲', color: '#84CC16', category: 'compound', discovered: false, rarity: 'common', description: 'Material from trees' },
  { id: 'stone', name: 'Stone', symbol: '🪨', color: '#6B7280', category: 'compound', discovered: false, rarity: 'common', description: 'Hard mineral matter' },
  { id: 'salt', name: 'Salt', symbol: '🧂', color: '#E2E8F0', category: 'compound', discovered: false, rarity: 'common', description: 'Crystal mineral, NaCl' },
  { id: 'alcohol', name: 'Alcohol', symbol: '🍸', color: '#CBD5E1', category: 'compound', discovered: false, rarity: 'uncommon', description: 'Organic compound with OH group' },
  
  // Advanced compounds
  { id: 'life', name: 'Life', symbol: '🌱', color: '#10B981', category: 'advanced', discovered: false, rarity: 'rare', description: 'Animated, self-sustaining existence' },
  { id: 'bacteria', name: 'Bacteria', symbol: '🦠', color: '#14B8A6', category: 'advanced', discovered: false, rarity: 'uncommon', description: 'Microscopic single-celled organisms' },
  { id: 'plant', name: 'Plant', symbol: '🌿', color: '#22C55E', category: 'advanced', discovered: false, rarity: 'uncommon', description: 'Photosynthesizing organism' },
  { id: 'human', name: 'Human', symbol: '👤', color: '#EC4899', category: 'advanced', discovered: false, rarity: 'rare', description: 'Homo sapiens, advanced life form' },
  { id: 'time', name: 'Time', symbol: '⏳', color: '#8B5CF6', category: 'advanced', discovered: false, rarity: 'legendary', description: 'The fourth dimension, ever-flowing' },
  
  // Scientific elements (periodic table) - first few examples
  { id: 'hydrogen', name: 'Hydrogen', symbol: 'H', color: '#22D3EE', category: 'scientific', discovered: false, atomicNumber: 1, rarity: 'uncommon', description: 'Lightest element, makes stars shine' },
  { id: 'helium', name: 'Helium', symbol: 'He', color: '#FB923C', category: 'scientific', discovered: false, atomicNumber: 2, rarity: 'uncommon', description: 'Noble gas, makes balloons float' },
  { id: 'carbon', name: 'Carbon', symbol: 'C', color: '#4B5563', category: 'scientific', discovered: false, atomicNumber: 6, rarity: 'uncommon', description: 'Foundation of organic chemistry' },
  { id: 'oxygen', name: 'Oxygen', symbol: 'O', color: '#60A5FA', category: 'scientific', discovered: false, atomicNumber: 8, rarity: 'uncommon', description: 'Essential for breathing' },
  { id: 'gold', name: 'Gold', symbol: 'Au', color: '#F59E0B', category: 'scientific', discovered: false, atomicNumber: 79, rarity: 'rare', description: 'Precious metal, never tarnishes' },
  
  // New advanced materials
  { id: 'plastic', name: 'Plastic', symbol: '🧪', color: '#9CA3AF', category: 'advanced', discovered: false, rarity: 'uncommon', description: 'Synthetic polymer material' },
  { id: 'glass', name: 'Glass', symbol: '🪟', color: '#A1A1AA', category: 'compound', discovered: false, rarity: 'common', description: 'Transparent solid material' },
  { id: 'electricity', name: 'Electricity', symbol: '⚡', color: '#FACC15', category: 'advanced', discovered: false, rarity: 'rare', description: 'Flow of electric charge' },
  { id: 'computer', name: 'Computer', symbol: '💻', color: '#3B82F6', category: 'advanced', discovered: false, rarity: 'rare', description: 'Processing machine' },
  { id: 'internet', name: 'Internet', symbol: '🌐', color: '#2563EB', category: 'advanced', discovered: false, rarity: 'legendary', description: 'Global information network' },
  
  // Mythical and conceptual elements
  { id: 'magic', name: 'Magic', symbol: '✨', color: '#C084FC', category: 'rare', discovered: false, rarity: 'legendary', description: 'Mystical supernatural energy' },
  { id: 'dragon', name: 'Dragon', symbol: '🐉', color: '#EF4444', category: 'rare', discovered: false, rarity: 'legendary', description: 'Mythical fire-breathing creature' },
  { id: 'love', name: 'Love', symbol: '❤️', color: '#FB7185', category: 'rare', discovered: false, rarity: 'rare', description: 'Deep affection and attachment' },
  { id: 'knowledge', name: 'Knowledge', symbol: '📚', color: '#A78BFA', category: 'rare', discovered: false, rarity: 'rare', description: 'Information and understanding' },
  { id: 'universe', name: 'Universe', symbol: '🌌', color: '#2DD4BF', category: 'rare', discovered: false, rarity: 'legendary', description: 'All of space, time, matter and energy' },
];

// A subset of the combinations - more will be added via extraCombinations
export const combinations: Combination[] = [
  // Level 1 combinations
  { elements: ['water', 'fire'], result: 'steam', description: 'Water evaporates when heated by fire', difficulty: 'easy' },
  { elements: ['earth', 'fire'], result: 'lava', description: 'Earth melts under extreme heat', difficulty: 'easy' },
  { elements: ['earth', 'water'], result: 'mud', description: 'Earth becomes mud when mixed with water', difficulty: 'easy' },
  { elements: ['fire', 'air'], result: 'energy', description: 'Fire fed by air creates energy', difficulty: 'easy' },
  { elements: ['fire', 'earth'], result: 'smoke', description: 'Burning matter produces smoke', difficulty: 'easy' },
  { elements: ['air', 'earth'], result: 'dust', description: 'Air carrying tiny earth particles', difficulty: 'easy' },
  
  // Level 2 combinations
  { elements: ['fire', 'stone'], result: 'metal', description: 'Stone refined by fire yields metal', difficulty: 'medium' },
  { elements: ['earth', 'life'], result: 'wood', description: 'Life growing from earth forms wood', difficulty: 'medium' },
  { elements: ['earth', 'energy'], result: 'stone', description: 'Earth compressed by energy creates stone', difficulty: 'medium' },
  { elements: ['water', 'energy'], result: 'salt', description: 'Water evaporated by energy leaves salt', difficulty: 'medium' },
  { elements: ['water', 'plant'], result: 'alcohol', description: 'Plant matter fermented in water', difficulty: 'medium' },
  
  // Advanced combinations
  { elements: ['energy', 'water'], result: 'life', description: 'Energy animates water into the first life', difficulty: 'hard' },
  { elements: ['life', 'water'], result: 'bacteria', description: 'Simple life forms in water', difficulty: 'hard' },
  { elements: ['life', 'earth'], result: 'plant', description: 'Life taking root in earth', difficulty: 'hard' },
  { elements: ['life', 'energy'], result: 'human', description: 'Advanced life form with consciousness', difficulty: 'hard' },
  { elements: ['energy', 'energy'], result: 'time', description: 'Energy concentrated creates the fabric of time', difficulty: 'hard' },
  
  // Alternative combinations
  { elements: ['steam', 'earth'], result: 'mud', description: 'Steam condensing onto earth', difficulty: 'medium' },
  { elements: ['lava', 'water'], result: 'stone', description: 'Lava cooled by water hardens into stone', difficulty: 'medium' },
  { elements: ['life', 'mud'], result: 'bacteria', description: 'Life emerging from primordial mud', difficulty: 'medium' },
  
  // Scientific element combinations
  { elements: ['energy', 'air'], result: 'hydrogen', description: 'Energy splits air to release hydrogen', difficulty: 'hard' },
  { elements: ['energy', 'hydrogen'], result: 'helium', description: 'Hydrogen fusion creates helium', difficulty: 'hard' },
  { elements: ['hydrogen', 'oxygen'], result: 'water', description: 'H₂O is the chemical formula for water', difficulty: 'medium' },
  
  // Advanced material combinations
  { elements: ['stone', 'fire'], result: 'glass', description: 'Silica from stone melted by fire forms glass', difficulty: 'medium' },
  { elements: ['oil', 'energy'], result: 'plastic', description: 'Oil refined with energy creates plastic', difficulty: 'hard' },
  { elements: ['metal', 'energy'], result: 'electricity', description: 'Energy flowing through metal creates electricity', difficulty: 'hard' },
  { elements: ['electricity', 'metal'], result: 'computer', description: 'Electricity controlling metal circuits', difficulty: 'very-hard' },
  { elements: ['computer', 'computer'], result: 'internet', description: 'Networked computers share information', difficulty: 'very-hard' },
  
  // Mythical combinations
  { elements: ['fire', 'knowledge'], result: 'dragon', description: 'Knowledge of fire manifests as a dragon', difficulty: 'very-hard' },
  { elements: ['energy', 'knowledge'], result: 'magic', description: 'Knowledge directing energy creates magic', difficulty: 'very-hard' },
  { elements: ['human', 'human'], result: 'love', description: 'The connection between humans', difficulty: 'very-hard' },
  { elements: ['time', 'space'], result: 'universe', description: 'Time and space form the fabric of the universe', difficulty: 'very-hard' },
];

// Additional combinations to be added to the main combinations array
export const extraCombinations: Combination[] = [
  // New scientific elements and compounds
  { elements: ['fire', 'wood'], result: 'ash', description: 'Wood burned by fire leaves ash', difficulty: 'easy' },
  { elements: ['water', 'electricity'], result: 'hydrogen', description: 'Electrolysis splits water into hydrogen', difficulty: 'medium' },
  { elements: ['air', 'electricity'], result: 'ozone', description: 'Electricity through air forms ozone', difficulty: 'medium' },
  { elements: ['carbon', 'oxygen'], result: 'carbon dioxide', description: 'Carbon combines with oxygen', difficulty: 'medium' },
  { elements: ['hydrogen', 'carbon'], result: 'methane', description: 'Hydrogen and carbon form methane', difficulty: 'medium' },
  
  // More advanced scientific elements
  { elements: ['carbon', 'carbon'], result: 'diamond', description: 'Carbon under pressure becomes diamond', difficulty: 'hard' },
  { elements: ['lava', 'pressure'], result: 'diamond', description: 'Alternative way to create diamond', difficulty: 'hard' },
  { elements: ['carbon', 'energy'], result: 'coal', description: 'Carbon compressed by energy', difficulty: 'medium' },
  { elements: ['coal', 'pressure'], result: 'diamond', description: 'Yet another way to create diamond', difficulty: 'hard' },
  
  // Light, color, and optical phenomena
  { elements: ['energy', 'glass'], result: 'light', description: 'Energy passing through glass creates light', difficulty: 'medium' },
  { elements: ['light', 'water'], result: 'rainbow', description: 'Light refracted through water droplets', difficulty: 'medium' },
  { elements: ['light', 'darkness'], result: 'shadow', description: 'Light blocked creates shadow', difficulty: 'easy' },
  
  // Weather and atmospheric phenomena
  { elements: ['water', 'air'], result: 'cloud', description: 'Water vapor suspended in air', difficulty: 'easy' },
  { elements: ['cloud', 'electricity'], result: 'lightning', description: 'Electric discharge from clouds', difficulty: 'medium' },
  { elements: ['cloud', 'cold'], result: 'snow', description: 'Frozen water crystals from clouds', difficulty: 'medium' },
  { elements: ['lightning', 'sand'], result: 'glass', description: 'Lightning striking sand creates glass', difficulty: 'hard' },
  
  // Space and cosmic objects
  { elements: ['fire', 'hydrogen'], result: 'star', description: 'Burning hydrogen creates stars', difficulty: 'hard' },
  { elements: ['star', 'time'], result: 'supernova', description: 'Star reaching the end of its life', difficulty: 'very-hard' },
  { elements: ['star', 'space'], result: 'solar system', description: 'Star with orbiting objects', difficulty: 'very-hard' },
  { elements: ['earth', 'space'], result: 'planet', description: 'Earth is a type of planet', difficulty: 'hard' },
  
  // Technology advancements
  { elements: ['computer', 'knowledge'], result: 'artificial intelligence', description: 'Computer that can learn', difficulty: 'very-hard' },
  { elements: ['metal', 'electricity'], result: 'robot', description: 'Metal animated by electricity', difficulty: 'hard' },
  { elements: ['robot', 'artificial intelligence'], result: 'android', description: 'Robot with human-like intelligence', difficulty: 'very-hard' },
  
  // Philosophical and abstract concepts
  { elements: ['human', 'knowledge'], result: 'philosophy', description: 'Human pursuit of knowledge', difficulty: 'hard' },
  { elements: ['love', 'time'], result: 'eternity', description: 'Love that lasts forever', difficulty: 'very-hard' },
  { elements: ['magic', 'science'], result: 'alchemy', description: 'The mystical precursor to chemistry', difficulty: 'very-hard' },
];

// Combine the main combinations with the extra ones
export const getAllCombinations = (): Combination[] => {
  return [...combinations, ...extraCombinations];
};

// Get elements by category
export const getElementsByCategory = (elements: Element[], category: Element['category']): Element[] => {
  return elements.filter(element => element.category === category);
};

// Get elements by rarity
export const getElementsByRarity = (elements: Element[], rarity: Element['rarity']): Element[] => {
  return elements.filter(element => element.rarity === rarity);
};

// Get all categories
export const getAllCategories = (): Element['category'][] => {
  return ['basic', 'compound', 'advanced', 'rare', 'scientific'];
};

// Get all rarities
export const getAllRarities = (): Element['rarity'][] => {
  return ['common', 'uncommon', 'rare', 'legendary'];
};

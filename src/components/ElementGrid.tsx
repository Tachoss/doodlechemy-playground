
import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Element from './Element';
import { Element as ElementType } from '@/utils/elementData';
import { AlertCircle, Filter, Search, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ElementGridProps {
  elements: ElementType[];
  onElementClick: (elementId: string) => void;
  selectedElements: (string | null)[];
  className?: string;
  combineZoneRef?: React.RefObject<HTMLDivElement>;
  onElementDetails?: (elementId: string) => void;
  onElementFavorite?: (id: string) => void;
  favorites: string[];
  combinationCounts: Record<string, number>;
  elementPowers: Record<string, number>;
  comboMultiplier: number;
}

const ElementGrid: React.FC<ElementGridProps> = memo(({
  elements,
  onElementClick,
  selectedElements,
  className,
  combineZoneRef,
  onElementDetails,
  onElementFavorite,
  favorites = [],
  combinationCounts = {},
  elementPowers = {},
  comboMultiplier = 1
}) => {
  const [filter, setFilter] = useState<'all' | 'basic' | 'compound' | 'advanced' | 'rare' | 'scientific'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [animateNewElement, setAnimateNewElement] = useState<string | null>(null);
  const [sort, setSort] = useState<'default' | 'name' | 'newest' | 'power'>('default');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const categories = ['all', ...new Set(elements.map(e => e.category))];

  // Ensure favorites is always an array before using includes
  const safeIsFavorite = (id: string) => Array.isArray(favorites) && favorites.includes(id);

  const filteredElements = elements.filter(element => {
    // Apply search filter first
    const matchesSearch = !searchTerm || 
      element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Apply favorites filter
    if (showFavoritesOnly) return safeIsFavorite(element.id);
    
    // Apply category filter
    if (activeCategory === 'all') return true;
    return element.category === activeCategory;
  });

  const sortedElements = [...filteredElements].sort((a, b) => {
    if (sort === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sort === 'newest') {
      return -1;
    } else if (sort === 'power') {
      return ((elementPowers && elementPowers[b.id]) || 0) - ((elementPowers && elementPowers[a.id]) || 0);
    }
    if (a.category !== b.category) {
      const categoryOrder = { basic: 1, compound: 2, advanced: 3, rare: 4, scientific: 5 };
      return categoryOrder[a.category] - categoryOrder[b.category];
    }
    return a.name.localeCompare(b.name);
  });

  const handleDragEnd = (elementId: string) => {
    onElementClick(elementId);
  };
  
  const handleElementRightClick = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    if (onElementDetails) {
      onElementDetails(elementId);
    }
  };

  useEffect(() => {
    // Simplified animation trigger to avoid performance issues
    const hasNewDiscoveries = elements.some(e => e.discovered && !selectedElements.includes(e.id));
    if (hasNewDiscoveries && !animateNewElement) {
      const latestElement = elements
        .filter(e => e.discovered)
        .sort((a, b) => a.name.localeCompare(b.name))[0];
      
      if (latestElement) {
        setAnimateNewElement(latestElement.id);
        const timer = setTimeout(() => {
          setAnimateNewElement(null);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [elements.length, selectedElements, animateNewElement]);

  return (
    <div className={className}>
      {comboMultiplier > 1 && (
        <motion.div 
          className="mb-4 p-2 bg-primary/10 rounded-lg flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-sm font-medium">Combo Multiplier:</span>
          <span className="text-lg font-bold text-primary">
            {comboMultiplier.toFixed(1)}x
          </span>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-input text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Search className="absolute left-3 top-1.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="hidden sm:flex justify-center space-x-2 overflow-x-auto pb-2">
          <button
            className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => setFilter('all')}
          >
            All Elements
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
              filter === 'basic' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => setFilter('basic')}
          >
            Basic
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
              filter === 'compound' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => setFilter('compound')}
          >
            Compounds
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
              filter === 'advanced' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => setFilter('advanced')}
          >
            Advanced
          </button>
          {elements.some(e => e.category === 'rare' && e.discovered) && (
            <button
              className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
                filter === 'rare' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => setFilter('rare')}
            >
              Rare
            </button>
          )}
          {elements.some(e => e.category === 'scientific' && e.discovered) && (
            <button
              className={`px-3 py-1 text-sm rounded-full transition-colors whitespace-nowrap ${
                filter === 'scientific' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => setFilter('scientific')}
            >
              Scientific
            </button>
          )}
        </div>
        
        <div className="sm:hidden relative">
          <button
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            <Filter size={14} />
            {filter === 'all' ? 'All Elements' : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
          
          <AnimatePresence>
            {showFilterOptions && (
              <motion.div
                className="absolute top-full mt-1 right-0 bg-background border border-border rounded-md shadow-lg z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="p-1 flex flex-col">
                  <button
                    className={`px-3 py-1 text-sm text-left rounded ${filter === 'all' ? 'bg-primary/10' : 'hover:bg-secondary'}`}
                    onClick={() => {
                      setFilter('all');
                      setShowFilterOptions(false);
                    }}
                  >
                    All Elements
                  </button>
                  <button
                    className={`px-3 py-1 text-sm text-left rounded ${filter === 'basic' ? 'bg-primary/10' : 'hover:bg-secondary'}`}
                    onClick={() => {
                      setFilter('basic');
                      setShowFilterOptions(false);
                    }}
                  >
                    Basic
                  </button>
                  <button
                    className={`px-3 py-1 text-sm text-left rounded ${filter === 'compound' ? 'bg-primary/10' : 'hover:bg-secondary'}`}
                    onClick={() => {
                      setFilter('compound');
                      setShowFilterOptions(false);
                    }}
                  >
                    Compounds
                  </button>
                  <button
                    className={`px-3 py-1 text-sm text-left rounded ${filter === 'advanced' ? 'bg-primary/10' : 'hover:bg-secondary'}`}
                    onClick={() => {
                      setFilter('advanced');
                      setShowFilterOptions(false);
                    }}
                  >
                    Advanced
                  </button>
                  {elements.some(e => e.category === 'rare' && e.discovered) && (
                    <button
                      className={`px-3 py-1 text-sm text-left rounded ${filter === 'rare' ? 'bg-primary/10' : 'hover:bg-secondary'}`}
                      onClick={() => {
                        setFilter('rare');
                        setShowFilterOptions(false);
                      }}
                    >
                      Rare
                    </button>
                  )}
                  {elements.some(e => e.category === 'scientific' && e.discovered) && (
                    <button
                      className={`px-3 py-1 text-sm text-left rounded ${filter === 'scientific' ? 'bg-primary/10' : 'hover:bg-secondary'}`}
                      onClick={() => {
                        setFilter('scientific');
                        setShowFilterOptions(false);
                      }}
                    >
                      Scientific
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          Favorites
        </Button>
      </div>

      {sortedElements.length > 0 ? (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {sortedElements.map((element) => (
            <motion.div
              key={element.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: animateNewElement === element.id ? [0, -10, 0] : 0
              }}
              transition={{ 
                duration: 0.3,
                y: { duration: 0.5, repeat: animateNewElement === element.id ? 3 : 0, repeatType: "reverse" }
              }}
              className={animateNewElement === element.id ? "animate-pulse" : ""}
              onContextMenu={(e) => handleElementRightClick(e, element.id)}
            >
              <div className="relative">
                <Element
                  element={element}
                  onClick={() => onElementClick(element.id)}
                  isSelected={selectedElements.includes(element.id)}
                  size="md"
                  onDragEnd={() => handleDragEnd(element.id)}
                  combineZoneRef={combineZoneRef}
                  glow={animateNewElement === element.id}
                  onFavorite={onElementFavorite ? () => onElementFavorite(element.id) : undefined}
                  isFavorite={safeIsFavorite(element.id)}
                  usageCount={combinationCounts ? combinationCounts[element.id] : undefined}
                  powerLevel={elementPowers ? elementPowers[element.id] || 0 : 0}
                />
                
                {onElementDetails && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background/80 hover:bg-background shadow"
                    onClick={() => onElementDetails(element.id)}
                  >
                    <Info size={12} />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <AlertCircle className="mb-2" />
          <p>No elements found in this category yet!</p>
          <p className="text-sm mt-1">Keep experimenting to discover more</p>
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span>Sort:</span>
          <select 
            className="bg-background/80 border border-input rounded text-xs py-1 px-2"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
          >
            <option value="default">Category</option>
            <option value="name">Name</option>
            <option value="newest">Newest</option>
            <option value="power">Power</option>
          </select>
        </div>
        <span>{sortedElements.length} elements found</span>
      </div>
      
      {onElementDetails && (
        <div className="mt-3 text-xs text-center text-muted-foreground">
          <Info size={12} className="inline mr-1" />
          Click the info icon or right-click an element to view details
        </div>
      )}
    </div>
  );
});

ElementGrid.displayName = 'ElementGrid';

export default ElementGrid;

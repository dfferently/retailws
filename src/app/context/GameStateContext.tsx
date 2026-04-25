import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Upgrade {
  id: string;
  name: string;
  level: number;
  basePrice: number;
  priceMultiplier: number;
  effect: (level: number) => number;
  description: string;
}

interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  image: string;
  reward: number;
}

interface GameState {
  coins: number;
  profitPerHour: number;
  energy: number;
  maxEnergy: number;
  damagePerClick: number;
  combo: number;
  enemiesDefeated: number;
  currentEnemy: Enemy;
  upgrades: Record<string, number>;
  addCoins: (amount: number) => void;
  tap: () => { damage: number; coinsGained: number; critical: boolean } | null;
  buyUpgrade: (id: string) => boolean;
  useRocket: () => void;
}

const GameStateContext = createContext<GameState | undefined>(undefined);

const ENEMIES: Enemy[] = [
  { 
    name: 'МАГНИТ', 
    maxHp: 25000000, 
    hp: 12450000, 
    image: '/src/imports/ChatGPT_Image_24_апр._2026_г.,_14_30_36.png',
    reward: 500000 
  },
  { 
    name: 'ПЯТЕРОЧКА', 
    maxHp: 50000000, 
    hp: 50000000, 
    image: 'https://images.unsplash.com/photo-1761588782163-bc6c50687dc0?auto=format&fit=crop&q=80&w=800',
    reward: 1200000 
  },
  { 
    name: 'АЗБУКА ВКУСА', 
    maxHp: 100000000, 
    hp: 100000000, 
    image: 'https://images.unsplash.com/photo-1582401656474-b65e06392a03?auto=format&fit=crop&q=80&w=800',
    reward: 3000000 
  },
];

export const UPGRADES_DATA: Upgrade[] = [
  {
    id: 'clickDamage',
    name: 'Сила удара',
    level: 1,
    basePrice: 1000,
    priceMultiplier: 1.5,
    effect: (level) => level * 500,
    description: '+500 к урону за тап',
  },
  {
    id: 'profitPerHour',
    name: 'Прибыль в час',
    level: 1,
    basePrice: 2000,
    priceMultiplier: 1.6,
    effect: (level) => level * 1200,
    description: '+1200 монет/час пассивно',
  },
  {
    id: 'maxEnergy',
    name: 'Максимум энергии',
    level: 1,
    basePrice: 500,
    priceMultiplier: 1.3,
    effect: (level) => 5000 + (level - 1) * 500,
    description: '+500 к макс. энергии',
  },
  {
    id: 'energyRegen',
    name: 'Регенерация энергии',
    level: 1,
    basePrice: 3000,
    priceMultiplier: 1.8,
    effect: (level) => 1 + level * 0.5,
    description: '+0.5 энергии в сек.',
  },
];

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState(56782305);
  const [energy, setEnergy] = useState(5000);
  const [combo, setCombo] = useState(0);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [upgrades, setUpgrades] = useState<Record<string, number>>({
    clickDamage: 12,
    profitPerHour: 24,
    maxEnergy: 5,
    energyRegen: 3,
  });
  
  const [currentEnemy, setCurrentEnemy] = useState<Enemy>(ENEMIES[0]);
  const [lastTapTime, setLastTapTime] = useState(0);

  const profitPerHour = (upgrades.profitPerHour || 0) * 1200;
  const maxEnergy = 5000 + ((upgrades.maxEnergy || 1) - 1) * 500;
  const damagePerClick = (upgrades.clickDamage || 1) * 500;
  const energyRegen = 1 + (upgrades.energyRegen || 1) * 0.5;

  // Passive Income and Energy Regen
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev + (profitPerHour / 3600));
      setEnergy(prev => Math.min(maxEnergy, prev + energyRegen));
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour, energyRegen, maxEnergy]);

  // Combo decay
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastTapTime > 2000) {
        setCombo(0);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lastTapTime]);

  const addCoins = (amount: number) => setCoins(prev => prev + amount);

  const tap = useCallback(() => {
    if (energy < 1) return null;

    const critical = Math.random() < 0.1;
    const comboMultiplier = 1 + Math.floor(combo / 10) * 0.1;
    const finalDamage = Math.floor(damagePerClick * (critical ? 2.5 : 1) * comboMultiplier);
    const coinsGained = Math.floor(finalDamage / 1000);

    setEnergy(prev => Math.max(0, prev - 1));
    setCombo(prev => prev + 1);
    setLastTapTime(Date.now());
    setCoins(prev => prev + coinsGained);

    setCurrentEnemy(prev => {
      const newHp = Math.max(0, prev.hp - finalDamage);
      if (newHp === 0) {
        // Enemy defeated
        setCoins(c => c + prev.reward);
        setEnemiesDefeated(d => d + 1);
        const nextIdx = (ENEMIES.indexOf(prev) + 1) % ENEMIES.length;
        return { ...ENEMIES[nextIdx] };
      }
      return { ...prev, hp: newHp };
    });

    return { damage: finalDamage, coinsGained, critical };
  }, [energy, damagePerClick, combo]);

  const buyUpgrade = (id: string) => {
    const upgrade = UPGRADES_DATA.find(u => u.id === id);
    if (!upgrade) return false;

    const currentLevel = upgrades[id] || 0;
    const price = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel));

    if (coins >= price) {
      setCoins(prev => prev - price);
      setUpgrades(prev => ({ ...prev, [id]: currentLevel + 1 }));
      return true;
    }
    return false;
  };

  const useRocket = () => {
    const rocketDamage = damagePerClick * 50;
    setCurrentEnemy(prev => ({ ...prev, hp: Math.max(0, prev.hp - rocketDamage) }));
    // Add logic for rocket cooldown
  };

  return (
    <GameStateContext.Provider value={{
      coins: Math.floor(coins),
      profitPerHour,
      energy: Math.floor(energy),
      maxEnergy,
      damagePerClick,
      combo,
      enemiesDefeated,
      currentEnemy,
      upgrades,
      addCoins,
      tap,
      buyUpgrade,
      useRocket
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error('useGameState must be used within GameStateProvider');
  return context;
};

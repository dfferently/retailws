import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from '../context/GameStateContext';
import { Zap, Rocket, Heart, ShieldAlert } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type PopupType = 'hit' | 'crit' | 'warn';

interface Popup {
  id: number;
  x: number;
  y: number;
  value: string;
  type: PopupType;
}

const getComboTier = (c: number) => {
  if (c >= 100) return 'legendary';
  if (c >= 50)  return 'epic';
  if (c >= 25)  return 'rare';
  if (c >= 10)  return 'uncommon';
  return 'common';
};

const TIER_STYLES = {
  common:    { color: '#ffffff', accent: '#3b82f6', label: 'Common' },
  uncommon:  { color: '#fb923c', accent: '#f97316', label: 'Uncommon' },
  rare:      { color: '#facc15', accent: '#eab308', label: 'Rare' },
  epic:      { color: '#c084fc', accent: '#a855f7', label: 'Epic' },
  legendary: { color: '#fde047', accent: '#eab308', label: 'Legendary' },
};

export const BattleScreen: React.FC = () => {
  const { coins, profitPerHour, energy, maxEnergy, combo, currentEnemy, tap, useRocket, damagePerClick } = useGameState();

  const [popups, setPopups] = useState<Popup[]>([]);
  const [isHitting, setIsHitting] = useState(false);
  const [sessionStolen, setSessionStolen] = useState(0);
  const [lastLocalTap, setLastLocalTap] = useState(0);
  const [comboDecay, setComboDecay] = useState(0);
  
  const popupId = useRef(0);

  // Combo decay tracking for UI
  useEffect(() => {
    const id = setInterval(() => {
      if (combo > 0 && lastLocalTap > 0) {
        const elapsed = Date.now() - lastLocalTap;
        setComboDecay(Math.max(0, 100 - (elapsed / 2000) * 100));
      } else {
        setComboDecay(0);
      }
    }, 50);
    return () => clearInterval(id);
  }, [lastLocalTap, combo]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid double-firing and scrolling
    if (e.cancelable) e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const result = tap();
    if (!result) {
      const id = ++popupId.current;
      setPopups(p => [...p, { id, x: clientX, y: clientY, value: 'Low Energy', type: 'warn' }]);
      setTimeout(() => setPopups(p => p.filter(x => x.id !== id)), 600);
      return;
    }

    setLastLocalTap(Date.now());
    setSessionStolen(prev => prev + result.coinsGained);

    const id = ++popupId.current;
    const popupValue = result.critical ? `CRIT! +${result.coinsGained}₽` : `+${result.coinsGained}₽`;
    
    setPopups(p => [...p, { id, x: clientX, y: clientY, value: popupValue, type: result.critical ? 'crit' : 'hit' }]);
    setTimeout(() => setPopups(p => p.filter(x => x.id !== id)), 800);

    setIsHitting(true);
    setTimeout(() => setIsHitting(false), 100);
  };

  const tier = getComboTier(combo);
  const style = TIER_STYLES[tier];
  const hpPct = (currentEnemy.hp / currentEnemy.maxHp) * 100;
  const energyPct = (energy / maxEnergy) * 100;

  return (
    <div className="relative flex flex-col h-full select-none touch-none overflow-hidden bg-[#0a0a0c]">
      {/* Soft Background Depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-900/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-red-900/5 to-transparent" />
      </div>

      {/* HEADER: Clean & Professional */}
      <div className="relative z-10 grid grid-cols-3 items-center px-4 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1707396174323-dd31d3dd4a97?auto=format&fit=crop&q=80&w=150" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Level 7</p>
            <p className="text-[12px] font-bold text-white leading-none">Legend</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Total Stolen</p>
          <motion.p 
            key={sessionStolen}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-lg font-black text-red-500 tabular-nums"
          >
            {sessionStolen.toLocaleString()}₽
          </motion.p>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest text-right">Profit / hr</p>
          <p className="text-[12px] font-bold text-green-500">
            +{(profitPerHour / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* BALANCE DISPLAY */}
      <div className="relative z-10 flex flex-col items-center py-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💰</span>
          <h1 className="text-4xl font-black text-white tracking-tight tabular-nums">
            {coins.toLocaleString()}
          </h1>
        </div>
      </div>

      {/* MAIN BATTLE AREA */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6">
        {/* Combo Indicator: Minimalist */}
        <AnimatePresence>
          {combo > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-0 right-6 z-20"
            >
              <div 
                className="px-4 py-2 rounded-2xl backdrop-blur-xl border border-white/10 bg-white/5 flex flex-col items-center"
                style={{ borderColor: `${style.color}33` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Combo</p>
                <motion.p 
                  key={combo}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-black italic"
                  style={{ color: style.color }}
                >
                  x{combo}
                </motion.p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full bg-white"
                    style={{ width: `${comboDecay}%`, backgroundColor: style.color }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tappable Shop Photo Card */}
        <motion.div
          className="relative w-full aspect-[4/5] max-h-[420px] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer"
          onMouseDown={handleTap}
          onTouchStart={handleTap}
          animate={isHitting ? { scale: 0.98 } : { scale: 1 }}
          transition={{ duration: 0.05 }}
        >
          {/* Main Photo */}
          <ImageWithFallback
            src={currentEnemy.image}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ 
              filter: isHitting ? 'brightness(1.2) contrast(1.1)' : 'brightness(1) contrast(1)',
              transition: 'filter 0.1s ease-out'
            }}
          />
          
          {/* Glassmorphism Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-white/60 mb-1">Competitor</p>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{currentEnemy.name}</h2>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={14} className="text-red-500 fill-red-500" />
                  <span className="text-sm font-bold text-white tabular-nums">
                    {(currentEnemy.hp / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    animate={{ width: `${hpPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hit Flash - Subdued */}
          <AnimatePresence>
            {isHitting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white pointer-events-none"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="relative z-10 px-6 pb-28 space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap size={16} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-white/40 uppercase">Dmg / Tap</p>
              <p className="text-[13px] font-bold text-white">{(damagePerClick / 1000).toFixed(1)}K</p>
            </div>
          </div>

          <button
            onClick={useRocket}
            className="flex-1 bg-orange-500/10 backdrop-blur-lg border border-orange-500/20 rounded-2xl p-3 flex items-center gap-3 active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Rocket size={16} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-medium text-white/40 uppercase">Rocket</p>
              <p className="text-[13px] font-bold text-orange-400">×50 Strike</p>
            </div>
          </button>
        </div>

        {/* Energy Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap size={14} className={energyPct < 20 ? 'text-red-500' : 'text-yellow-500'} />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">
                {energyPct < 20 ? 'Energy Critical' : 'Energy Reserves'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-white/40 tabular-nums">
              {energy.toLocaleString()} / {maxEnergy.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full rounded-full"
              animate={{ 
                width: `${energyPct}%`,
                backgroundColor: energyPct < 20 ? '#ef4444' : '#eab308'
              }}
              style={{ boxShadow: energyPct < 20 ? '0 0 10px rgba(239,68,68,0.3)' : 'none' }}
            />
          </div>
        </div>
      </div>

      {/* FLOATING POPUPS */}
      <AnimatePresence>
        {popups.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -100, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed pointer-events-none z-50 font-black italic tracking-tighter drop-shadow-lg
              ${p.type === 'crit' ? 'text-yellow-400 text-3xl' : ''}
              ${p.type === 'hit' ? 'text-white text-xl' : ''}
              ${p.type === 'warn' ? 'text-red-500 text-lg' : ''}
            `}
            style={{ left: p.x - 40, top: p.y - 40 }}
          >
            {p.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

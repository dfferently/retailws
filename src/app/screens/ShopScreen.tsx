import React, { useState } from 'react';
import { useGameState, UPGRADES_DATA } from '../context/GameStateContext';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Zap, MousePointer2, ChevronRight, Lock, Sparkles, Gift, ShoppingBag, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const UPGRADE_META: Record<string, {
  icon: React.ReactNode;
  color: string;
  tier: string;
}> = {
  clickDamage: {
    icon: <MousePointer2 size={20} />, color: '#f87171', tier: 'Strike',
  },
  profitPerHour: {
    icon: <TrendingUp size={20} />, color: '#34d399', tier: 'Income',
  },
  maxEnergy: {
    icon: <ShoppingBag size={20} />, color: '#60a5fa', tier: 'Capacity',
  },
  energyRegen: {
    icon: <Zap size={20} />, color: '#fbbf24', tier: 'Recharge',
  },
};

export const ShopScreen: React.FC = () => {
  const { coins, upgrades, buyUpgrade } = useGameState();
  const [filter, setFilter] = useState<'ALL' | 'Strike' | 'Income' | 'Capacity' | 'Recharge'>('ALL');

  const handleBuy = (id: string, name: string) => {
    const success = buyUpgrade(id);
    if (success) {
      toast.success(`Upgraded: ${name}`, {
        style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' }
      });
    } else {
      toast.error('Insufficient funds', {
        style: { background: '#18181b', color: '#fff', border: '1px solid #3f3f46' }
      });
    }
  };

  const filteredUpgrades = UPGRADES_DATA.filter(u =>
    filter === 'ALL' || UPGRADE_META[u.id]?.tier === filter
  );

  const FILTERS: Array<'ALL' | 'Strike' | 'Income' | 'Capacity' | 'Recharge'> = ['ALL', 'Strike', 'Income', 'Capacity', 'Recharge'];

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0c]">
      {/* Visual Header */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1594009385649-60efb664bd80?auto=format&fit=crop&q=80&w=800"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Armory</h1>
          <p className="text-sm font-medium text-white/50 uppercase tracking-widest">Upgrade your retail arsenal</p>
        </div>
      </div>

      <div className="sticky top-0 z-20 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            <Coins size={16} className="text-yellow-500" />
            <span className="text-lg font-black text-white tabular-nums">
              {coins.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                filter === f
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 px-6 pt-6 pb-28">
        {/* Daily Bonus Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 p-6 bg-white/5">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Gift size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Daily Reward</p>
              <p className="text-xl font-black text-white">+500,000₽</p>
            </div>
            <button className="bg-white text-black px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest active:scale-95 transition-transform">
              Claim
            </button>
          </div>
        </div>

        {/* Upgrade List */}
        <div className="space-y-3">
          {filteredUpgrades.map((u) => {
            const level = upgrades[u.id] || 0;
            const price = Math.floor(u.basePrice * Math.pow(u.priceMultiplier, level));
            const canAfford = coins >= price;
            const meta = UPGRADE_META[u.id];

            return (
              <div
                key={u.id}
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-5 flex items-center gap-4 hover:bg-white/[0.05] transition-colors"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5"
                  style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                >
                  {meta.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white uppercase tracking-tight truncate">{u.name}</h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                      LV {level}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/40 font-medium uppercase truncate">{u.description}</p>
                </div>

                <button
                  onClick={() => handleBuy(u.id, u.name)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${
                    canAfford 
                      ? 'bg-white text-black active:scale-95' 
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  {price >= 1000000 ? `${(price / 1000000).toFixed(1)}M` : `${(price / 1000).toFixed(0)}K`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

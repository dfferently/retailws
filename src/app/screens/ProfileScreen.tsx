import React, { useState } from 'react';
import { useGameState } from '../context/GameStateContext';
import { Users, Flame, Trophy, Award, Zap, Target, TrendingUp, Shield, BarChart3, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const ACHIEVEMENTS = [
  { id: 1, icon: <TrendingUp size={24} />, label: 'Millionaire', unlocked: true, color: '#eab308' },
  { id: 2, icon: <Zap size={24} />, label: 'High Voltage', unlocked: true, color: '#f97316' },
  { id: 3, icon: <Flame size={24} />, label: 'On Fire', unlocked: true, color: '#ef4444' },
  { id: 4, icon: <Shield size={24} />, label: 'Guardian', unlocked: false, color: '#3b82f6' },
  { id: 5, icon: <Award size={24} />, label: 'Elite', unlocked: false, color: '#a855f7' },
  { id: 6, icon: <Target size={24} />, label: 'Sniper', unlocked: false, color: '#22d3ee' },
];

export const ProfileScreen: React.FC = () => {
  const { coins, profitPerHour, enemiesDefeated, upgrades } = useGameState();

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0c]">
      {/* Profile Hero Section */}
      <div className="relative h-72">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1764410481612-7544525b2991?auto=format&fit=crop&q=80&w=800"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex items-end gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1707396174323-dd31d3dd4a97?auto=format&fit=crop&q=80&w=200" 
              className="w-28 h-28 rounded-3xl border-2 border-white/10 relative z-10 object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1 mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest">
                Legend Rank
              </span>
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Director_X</h1>
            <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest mt-1">Global ID: 582-990-112</p>
          </div>
          <button className="bg-white/5 border border-white/10 p-3 rounded-2xl text-white/40 mb-2">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 pt-6 pb-28 space-y-8">
        {/* Progress Card */}
        <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Experience Level 7</p>
            <p className="text-[11px] font-bold text-white uppercase tracking-widest">72% to Lvl 8</p>
          </div>
          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
            <motion.div 
              className="h-full bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.3)]"
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
            />
          </div>
          <div className="flex justify-between mt-3 text-[10px] font-medium text-white/30 uppercase">
            <span>72,400 XP</span>
            <span>100,000 XP</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<BarChart3 size={18} />} label="Total Damage" value={`${(enemiesDefeated * 1.5).toFixed(1)}B`} />
          <StatCard icon={<TrendingUp size={18} />} label="Passive Income" value={`+${(profitPerHour/3600).toFixed(0)}/s`} />
          <StatCard icon={<Target size={18} />} label="Enemies Defeated" value={enemiesDefeated.toString()} />
          <StatCard icon={<Trophy size={18} />} label="World Rank" value="#4,201" />
        </div>

        {/* Achievements Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Achievements</h2>
            <span className="text-[11px] font-bold text-yellow-500 uppercase">3 / 6 Unlocked</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((ach) => (
              <div 
                key={ach.id}
                className={`flex flex-col items-center gap-3 p-5 rounded-[2rem] border transition-all ${
                  ach.unlocked 
                    ? 'bg-white/[0.05] border-white/10' 
                    : 'bg-white/[0.02] border-white/5 opacity-40'
                }`}
              >
                <div className={`${ach.unlocked ? 'text-white' : 'text-white/20'}`}>
                  {ach.icon}
                </div>
                <p className="text-[10px] font-bold text-white uppercase tracking-tighter text-center">{ach.label}</p>
                {ach.unlocked && <CheckCircle2 size={12} className="text-green-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 space-y-3">
    <div className="text-white/40">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-white tabular-nums">{value}</p>
    </div>
  </div>
);

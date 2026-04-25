import React, { useState } from 'react';
import { Users, Trophy, UserPlus, Swords, Target, Crown, Flame, TrendingUp, Timer, Shield, LogOut, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const MEMBERS = [
  { name: 'AlexRetail',    contribution: '250M', dmg: 250, rank: 1, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80', streak: 7 },
  { name: 'ShopKing',      contribution: '180M', dmg: 180, rank: 2, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', streak: 3 },
  { name: 'CassierPro',    contribution: '120M', dmg: 120, rank: 3, avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&q=80', streak: 5 },
  { name: 'Director_X',    contribution: '96M',  dmg: 96,  rank: 4, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&q=80', streak: 12 },
];

export const ClanScreen: React.FC = () => {
  const [tab, setTab] = useState<'war' | 'members' | 'log'>('war');
  const warProgress = 68;

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0c]">
      {/* Clan Banner */}
      <div className="relative h-60 overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1737474707380-5ef35770d8a7?auto=format&fit=crop&q=80&w=800"
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex gap-2 mb-3">
                <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest">
                  Elite League
                </span>
                <span className="bg-white/5 text-white/50 border border-white/10 text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest">
                  Season 7
                </span>
              </div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Retail Legends</h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-white/40" />
                  <span className="text-sm font-bold text-white/60">42 / 50</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy size={14} className="text-yellow-500" />
                  <span className="text-sm font-bold text-yellow-500">Rank #12</span>
                </div>
              </div>
            </div>
            <button className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl active:scale-95 transition-transform text-white/60">
              <UserPlus size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 sticky top-0 bg-[#0a0a0c]/80 backdrop-blur-xl z-20 border-b border-white/5">
        <div className="flex gap-2">
          {(['war', 'members', 'log'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                tab === t
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-white/40 border-white/5'
              }`}
            >
              {t === 'war' ? 'Clan War' : t === 'members' ? 'Members' : 'History'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pt-6 pb-28 space-y-6">
        <AnimatePresence mode="wait">
          {tab === 'war' && (
            <motion.div
              key="war"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* War Status Card */}
              <div className="bg-red-500/[0.03] border border-red-500/10 rounded-[2rem] p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Active Raid</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 px-4 py-1.5 rounded-xl border border-white/5">
                    <Timer size={14} className="text-yellow-500" />
                    <span className="text-xs font-bold text-white tabular-nums">02:18:45</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="text-center flex-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Our Team</p>
                    <p className="text-3xl font-black text-white">1.2B</p>
                  </div>
                  <div className="text-white/20">
                    <Swords size={32} />
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Enemy</p>
                    <p className="text-3xl font-black text-red-500">980M</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${warProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-green-500">Winning</span>
                    <span className="text-white/30">{warProgress}% Control</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold uppercase tracking-widest active:scale-95 transition-transform">
                  Strike Now
                </button>
              </div>
            </motion.div>
          )}

          {tab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {MEMBERS.map((m, i) => (
                <div key={m.name} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img src={m.avatar} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black border border-white/10 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white uppercase text-sm tracking-tight">{m.name}</p>
                    <p className="text-[10px] font-medium text-white/40 uppercase">Contributor</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-green-500">{m.contribution}</p>
                    <p className="text-[9px] font-bold text-white/20 uppercase">Total Dmg</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {tab === 'log' && (
            <motion.div
              key="log"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {[
                { opponent: 'Metro Killers', result: 'win', our: '1.2B', their: '980M' },
                { opponent: 'Food Empire', result: 'win', our: '980M', their: '740M' },
                { opponent: 'Shop Bosses', result: 'loss', our: '620M', their: '880M' },
              ].map((log, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.result === 'win' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {log.result === 'win' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white uppercase text-sm tracking-tight">{log.opponent}</p>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-white/30 uppercase">
                      <span>{log.our}</span>
                      <span>vs</span>
                      <span>{log.their}</span>
                    </div>
                  </div>
                  <div className={`text-right ${log.result === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                    <p className="font-bold uppercase text-[10px] tracking-widest">
                      {log.result === 'win' ? 'Victory' : 'Defeat'}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

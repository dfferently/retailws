import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { Sword, ShoppingBag, Users, User } from 'lucide-react';
import { motion } from 'motion/react';

export const MobileLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0c] text-white overflow-hidden font-sans selection:bg-white/10">
      {/* Minimal Overlay Shadow */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-0" />


      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <Outlet />
      </main>

      {/* Navigation Bar */}
    <nav className="fixed bottom-6 left-6 right-6 h-20 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-around z-50 shadow-2xl shrink-0">
      <NavItem to="/" icon={<Swords size={24} />} label="Raid" />
      <NavItem to="/shop" icon={<ShoppingBag size={24} />} label="Shop" />
      <NavItem to="/clan" icon={<Users size={24} />} label="Clan" />
      <NavItem to="/profile" icon={<User size={24} />} label="Profile" />
    </nav>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex flex-col items-center justify-center transition-all duration-300
        ${isActive ? 'text-white' : 'text-white/30'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className="relative">
            {icon}
            {isActive && (
              <motion.div 
                layoutId="nav-dot"
                className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full"
              />
            )}
          </div>
          <span className="text-[10px] mt-1.5 font-bold uppercase tracking-widest">{label}</span>
        </>
      )}
    </NavLink>
  );
};
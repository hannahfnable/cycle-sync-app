import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Calendar, Sparkles, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', page: 'Home' },
  { icon: Calendar, label: 'Schedule', page: 'Schedule' },
  { icon: Sparkles, label: 'Discover', page: 'Discover' },
  { icon: User, label: 'Profile', page: 'Profile' },
];

export default function BottomNav({ currentPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 pb-safe z-40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className="relative flex flex-col items-center justify-center w-16 h-16"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-12 h-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
              <item.icon
                className={`w-6 h-6 mb-1 transition-colors ${
                  isActive ? 'text-violet-600' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-violet-600' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
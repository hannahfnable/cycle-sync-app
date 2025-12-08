import React from 'react';
import { motion } from 'framer-motion';

const phases = {
  menstruation: {
    color: 'from-rose-400 to-red-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    emoji: '🌙',
    description: 'Rest & restore',
  },
  follicular: {
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    emoji: '🌱',
    description: 'Rising energy',
  },
  ovulation: {
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    emoji: '☀️',
    description: 'Peak vitality',
  },
  luteal: {
    color: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    emoji: '🍂',
    description: 'Winding down',
  },
};

export default function PhaseIndicator({ phase, cycleDay, compact = false }) {
  const config = phases[phase] || phases.follicular;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
        <span>{config.emoji}</span>
        <span className={`text-sm font-medium ${config.text} capitalize`}>{phase}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl p-6 ${config.bg} ${config.border} border`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${config.color} opacity-20 blur-2xl`} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{config.emoji}</span>
            <div>
              <h3 className={`text-xl font-semibold ${config.text} capitalize`}>{phase} Phase</h3>
              <p className="text-sm text-slate-500">{config.description}</p>
            </div>
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-lg">Day {cycleDay}</span>
          </div>
        </div>
        
        <div className="flex gap-1 mt-4">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < cycleDay
                  ? `bg-gradient-to-r ${config.color}`
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export { phases };
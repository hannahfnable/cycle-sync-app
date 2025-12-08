import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { phases } from '../cycle/PhaseIndicator';
import { typeColors, typeEmojis } from '../activities/ActivityCard';

export default function ActivityPicker({ 
  activities, 
  isOpen, 
  onClose, 
  onSelect,
  currentPhase 
}) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const types = ['all', 'exercise', 'meal', 'wellbeing', 'self_care', 'productivity'];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Prioritize activities for current phase
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    const aHasPhase = a.phases?.includes(currentPhase) ? 0 : 1;
    const bHasPhase = b.phases?.includes(currentPhase) ? 0 : 1;
    return aHasPhase - bHasPhase;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Add Activity</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search activities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 rounded-2xl border-slate-200"
                />
              </div>

              {/* Type filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedType === type
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'all' ? '✨ All' : `${typeEmojis[type]} ${type.replace('_', ' ')}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Activities list */}
            <div className="flex-1 overflow-y-auto p-4">
              {currentPhase && (
                <div className={`mb-4 p-3 rounded-2xl ${phases[currentPhase]?.bg}`}>
                  <p className={`text-sm ${phases[currentPhase]?.text}`}>
                    {phases[currentPhase]?.emoji} Activities marked with a dot are recommended for your current {currentPhase} phase
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2">
                {sortedActivities.map((activity) => {
                  const typeColor = typeColors[activity.type] || typeColors.wellbeing;
                  const isRecommended = activity.phases?.includes(currentPhase);

                  return (
                    <motion.button
                      key={activity.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelect(activity);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors text-left"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColor} flex items-center justify-center text-2xl`}>
                        {activity.emoji || typeEmojis[activity.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800">{activity.name}</p>
                          {isRecommended && (
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${phases[currentPhase]?.color}`} />
                          )}
                        </div>
                        <p className="text-sm text-slate-500 truncate">
                          {activity.duration_minutes} min • {activity.type?.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-slate-600" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {sortedActivities.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500">No activities found</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
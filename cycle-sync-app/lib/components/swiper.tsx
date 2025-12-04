import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Check, X, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { phases } from '../cycle/PhaseIndicator';
import { typeColors, typeEmojis } from 'ActivityCard';

function SwipeCard({ activity, onSwipe, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const acceptOpacity = useTransform(x, [0, 100], [0, 1]);
  const rejectOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) {
      onSwipe('accept');
    } else if (info.offset.x < -100) {
      onSwipe('reject');
    }
  };

  const typeColor = typeColors[activity.type] || typeColors.wellbeing;

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      exit={{ 
        x: x.get() > 0 ? 300 : -300, 
        opacity: 0,
        transition: { duration: 0.3 }
      }}
    >
      {/* Accept indicator */}
      <motion.div
        className="absolute inset-0 bg-emerald-500/20 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
        style={{ opacity: acceptOpacity }}
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center">
          <Check className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      {/* Reject indicator */}
      <motion.div
        className="absolute inset-0 bg-rose-500/20 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
        style={{ opacity: rejectOpacity }}
      >
        <div className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center">
          <X className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      <div className="h-full bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${typeColor}`} />
        
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${typeColor} flex items-center justify-center text-5xl shadow-xl`}>
              {activity.emoji || typeEmojis[activity.type]}
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-800 text-center mb-2">
            {activity.name}
          </h3>

          <p className="text-sm text-slate-500 text-center mb-4 line-clamp-3">
            {activity.description}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {activity.phases?.map((phase) => (
              <span
                key={phase}
                className={`px-3 py-1 rounded-full text-sm font-medium ${phases[phase]?.bg} ${phases[phase]?.text}`}
              >
                {phases[phase]?.emoji} {phase}
              </span>
            ))}
          </div>

          {activity.benefits?.length > 0 && (
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl">
              <p className="text-xs font-medium text-slate-500 mb-2">Benefits</p>
              <div className="flex flex-wrap gap-1.5">
                {activity.benefits.slice(0, 3).map((benefit, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-white rounded-lg text-slate-600">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            {activity.duration_minutes && (
              <span className="px-3 py-1 bg-slate-100 rounded-full">
                {activity.duration_minutes} min
              </span>
            )}
            <span className="px-3 py-1 bg-slate-100 rounded-full capitalize">
              {activity.type?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SwipeableActivityList({ activities, onAccept, onReject }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const remainingActivities = activities.slice(currentIndex);

  const handleSwipe = (direction) => {
    const activity = remainingActivities[0];
    if (direction === 'accept') {
      onAccept?.(activity);
    } else {
      onReject?.(activity);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  if (remainingActivities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">All done!</h3>
        <p className="text-slate-500 text-center">
          You've reviewed all suggested activities
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative h-[480px]">
        <AnimatePresence>
          {remainingActivities.slice(0, 2).map((activity, index) => (
            <SwipeCard
              key={activity.id}
              activity={activity}
              onSwipe={handleSwipe}
              isTop={index === 0}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-8 mt-6">
        <button
          onClick={() => handleSwipe('reject')}
          className="w-16 h-16 rounded-full bg-white border-2 border-rose-200 flex items-center justify-center shadow-lg hover:bg-rose-50 transition-colors"
        >
          <X className="w-8 h-8 text-rose-500" />
        </button>
        <button
          onClick={() => handleSwipe('accept')}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <Check className="w-8 h-8 text-white" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <ChevronLeft className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-500">
          {currentIndex + 1} of {activities.length}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
}
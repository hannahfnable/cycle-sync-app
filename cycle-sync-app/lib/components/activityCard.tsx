import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, Heart, ChevronRight } from 'lucide-react';
import { phases } from './phase';
import { Activity } from '../interfaces/activity.interface';
import { ActivityColor, ActivityType, Emoji } from '../enums/activity.enum';
import { Phase } from '../interfaces/phase.interface';
import { PhaseType } from '../enums/phase.enum';
import { Button } from 'react-native';

interface ActivityCardProps {
  activity: Activity;
  onSelect?: (activity: Activity) => void;
  onFavorite?: (activity: Activity) => void;
  isFavorite?: boolean;
  showDetails?: boolean;
  compact?: boolean;
  draggable?: boolean;
}

export default function ActivityCard({ 
  activity,
  onSelect, 
  onFavorite, 
  isFavorite = false,
  showDetails = false,
  compact = false,
  draggable = false 
}: ActivityCardProps) {
  const typeColor = ActivityColor[activity.type] || ActivityColor.Wellbeing;

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm"
        onClick={() => onSelect?.(activity)}
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeColor} flex items-center justify-center text-lg`}>
          {activity.emoji || Emoji[activity.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 truncate">{activity.name}</p>
          {activity.duration_minutes && (
            <p className="text-xs text-slate-400">{activity.duration_minutes} min</p>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${typeColor}`} />
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${typeColor} flex items-center justify-center text-2xl shadow-lg`}>
            {activity.emoji || Emoji[activity.type]}
          </div>
          <Button
            onClick={(e : any) => {
              e.stopPropagation();
              onFavorite?.(activity);
            }}
            className="p-2 rounded-full hover:bg-slate-50 transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
              }`}
            />
          </Button>
        </div>

        <h3 className="font-semibold text-lg text-slate-800 mb-1">{activity.name}</h3>
        
        {activity.description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{activity.description}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {activity.phases?.map((phase: PhaseType ) => (
            <span
              key={phase}
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${phases[phase]?.bg} ${phases[phase]?.text}`}
            >
              {phases[phase]?.emoji} {phase}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            {activity.duration_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {activity.duration_minutes} min
              </span>
            )}
            <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
              {activity.type?.replace('_', ' ')}
            </span>
          </div>
          
          {activity.article_url && (
            <a title={activity.article_url}
              href={activity.article_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
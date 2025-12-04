import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, addDays } from 'date-fns';
import { Settings, Bell, ChevronRight, Plus, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import PhaseIndicator, { phases } from '../lib/components/phase';
import { calculateCycleInfo } from '../lib/utils/cycleUtils';
import ActivityCard, { typeEmojis } from '../lib/components/activityCard';
import BottomNav from '../lib/components/BottomNav';

export default function Home() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: cycleSettings } = useQuery({
    queryKey: ['cycleSettings'],
    queryFn: () => base44.entities.CycleSettings.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: () => base44.entities.Activity.list(),
  });

  const { data: userActivities = [] } = useQuery({
    queryKey: ['userActivities'],
    queryFn: () => base44.entities.UserActivity.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: scheduledActivities = [] } = useQuery({
    queryKey: ['scheduledActivities'],
    queryFn: () => base44.entities.ScheduledActivity.filter({ 
      created_by: user?.email,
      week_start: format(startOfWeek(new Date()), 'yyyy-MM-dd')
    }),
    enabled: !!user?.email,
  });

  const settings = cycleSettings?.[0];
  const cycleInfo = calculateCycleInfo(settings);
  const currentPhase = cycleInfo.phase;

  // Get recommended activities for current phase
  const recommendedActivities = activities
    .filter((a) => a.phases?.includes(currentPhase))
    .slice(0, 4);

  // Get today's scheduled activities
  const todayIndex = new Date().getDay();
  const todayActivities = scheduledActivities
    .filter((sa) => sa.day_of_week === todayIndex)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .map((sa) => ({
      ...sa,
      activity: activities.find((a) => a.id === sa.activity_id),
    }))
    .filter((sa) => sa.activity);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-xl font-bold text-slate-800">
              {user?.full_name?.split(' ')[0] || 'Beautiful'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            <Link 
              to={createPageUrl('Profile')}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-600" />
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Phase indicator */}
        {settings ? (
          <PhaseIndicator phase={currentPhase} cycleDay={cycleInfo.cycleDay} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl p-6 border border-violet-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">Set up your cycle</h3>
                <p className="text-sm text-slate-600">Track your cycle to get personalized recommendations</p>
              </div>
            </div>
            <Link
              to={createPageUrl('Profile')}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white text-violet-600 font-medium hover:bg-violet-50 transition-colors"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {/* Today's schedule */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Today's Flow</h2>
            <Link
              to={createPageUrl('Schedule')}
              className="text-sm text-violet-600 font-medium flex items-center gap-1 hover:text-violet-700"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {todayActivities.length > 0 ? (
            <div className="space-y-3">
              {todayActivities.slice(0, 3).map((sa) => (
                <motion.div
                  key={sa.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 ${
                    sa.is_completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{sa.start_time}</p>
                  </div>
                  <div className="w-px h-12 bg-slate-200" />
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{sa.activity.emoji || typeEmojis[sa.activity.type]}</span>
                    <div>
                      <p className="font-medium text-slate-800">{sa.activity.name}</p>
                      <p className="text-sm text-slate-500">{sa.activity.duration_minutes} min</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    sa.is_completed 
                      ? 'bg-emerald-500' 
                      : `bg-gradient-to-r ${phases[currentPhase]?.color}`
                  }`} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <p className="text-slate-500 mb-3">No activities scheduled for today</p>
              <Link
                to={createPageUrl('Schedule')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-100 text-violet-600 font-medium hover:bg-violet-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Activities
              </Link>
            </div>
          )}
        </div>

        {/* Recommended for phase */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              {phases[currentPhase]?.emoji} For Your {currentPhase?.replace(/^\w/, c => c.toUpperCase())} Phase
            </h2>
            <Link
              to={createPageUrl('Discover')}
              className="text-sm text-violet-600 font-medium flex items-center gap-1 hover:text-violet-700"
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recommendedActivities.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {recommendedActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  compact
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">No activities available yet</p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={createPageUrl('Discover')}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
          >
            <Sparkles className="w-6 h-6 mb-2" />
            <p className="font-semibold">Discover</p>
            <p className="text-sm opacity-80">New activities</p>
          </Link>
          <Link
            to={createPageUrl('Schedule')}
            className="p-4 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 text-white"
          >
            <Calendar className="w-6 h-6 mb-2" />
            <p className="font-semibold">Schedule</p>
            <p className="text-sm opacity-80">Plan your week</p>
          </Link>
        </div>
      </div>

      <BottomNav currentPage="Home" />
    </div>
  );
}
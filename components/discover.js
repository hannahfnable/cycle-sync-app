import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, Grid, Layers, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SwipeableActivityList from '../components/activities/SwipeableActivityList';
import ActivityCard from '../components/activities/ActivityCard';
import ActivityDetail from '../components/activities/ActivityDetail';
import { calculateCycleInfo } from '../components/cycle/CycleUtils';
import { phaseConfig } from '../components/cycle/PhaseIndicator';
import BottomNav from '../components/ui/BottomNav';

export default function Discover() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('swipe');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState('all');

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

  const settings = cycleSettings?.[0];
  const cycleInfo = calculateCycleInfo(settings);

  const userActivityMap = userActivities.reduce((acc, ua) => {
    acc[ua.activity_id] = ua;
    return acc;
  }, {});

  // Get activities not yet added by user
  const newActivities = activities.filter(
    (a) => !userActivityMap[a.id] || !userActivityMap[a.id].is_active
  );

  // Filter by phase
  const filteredActivities = selectedPhase === 'all'
    ? newActivities
    : newActivities.filter((a) => a.phases?.includes(selectedPhase));

  // Sort by relevance to current phase
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    const aHasPhase = a.phases?.includes(cycleInfo.phase) ? 0 : 1;
    const bHasPhase = b.phases?.includes(cycleInfo.phase) ? 0 : 1;
    return aHasPhase - bHasPhase;
  });

  const createUserActivityMutation = useMutation({
    mutationFn: (data) => base44.entities.UserActivity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
    },
  });

  const updateUserActivityMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.UserActivity.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
    },
  });

  const handleAcceptActivity = (activity) => {
    const existing = userActivityMap[activity.id];
    if (existing) {
      updateUserActivityMutation.mutate({
        id: existing.id,
        data: { is_active: true },
      });
    } else {
      createUserActivityMutation.mutate({
        activity_id: activity.id,
        is_active: true,
      });
    }
  };

  const handleRejectActivity = (activity) => {
    // Just skip for now, don't save rejection
  };

  const handleToggleFavorite = (activity) => {
    const existing = userActivityMap[activity.id];
    if (existing) {
      updateUserActivityMutation.mutate({
        id: existing.id,
        data: { is_favorite: !existing.is_favorite },
      });
    } else {
      createUserActivityMutation.mutate({
        activity_id: activity.id,
        is_favorite: true,
        is_active: true,
      });
    }
  };

  // My activities (active ones)
  const myActivities = activities.filter(
    (a) => userActivityMap[a.id]?.is_active
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to={createPageUrl('Home')}
              className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Discover</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('swipe')}
                className={`p-2 rounded-xl transition-colors ${
                  viewMode === 'swipe' ? 'bg-violet-100 text-violet-600' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <Layers className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-colors ${
                  viewMode === 'grid' ? 'bg-violet-100 text-violet-600' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="w-full mb-6 bg-slate-100 p-1 rounded-2xl">
            <TabsTrigger value="discover" className="flex-1 rounded-xl data-[state=active]:bg-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="my-activities" className="flex-1 rounded-xl data-[state=active]:bg-white">
              <Heart className="w-4 h-4 mr-2" />
              My Activities ({myActivities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover">
            {/* Phase filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 -mx-2 px-2 mb-4">
              <button
                onClick={() => setSelectedPhase('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedPhase === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                All phases
              </button>
              {Object.entries(phaseConfig).map(([phase, config]) => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedPhase === phase
                      ? `bg-gradient-to-r ${config.color} text-white`
                      : `${config.bg} ${config.text}`
                  }`}
                >
                  {config.emoji} {phase}
                </button>
              ))}
            </div>

            {viewMode === 'swipe' ? (
              <SwipeableActivityList
                activities={sortedActivities}
                onAccept={handleAcceptActivity}
                onReject={handleRejectActivity}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {sortedActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onSelect={setSelectedActivity}
                      onFavorite={handleToggleFavorite}
                      isFavorite={userActivityMap[activity.id]?.is_favorite}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {sortedActivities.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">All caught up!</h3>
                <p className="text-slate-500">You've reviewed all available activities</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-activities">
            {myActivities.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {myActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onSelect={setSelectedActivity}
                      onFavorite={handleToggleFavorite}
                      isFavorite={userActivityMap[activity.id]?.is_favorite}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No activities yet</h3>
                <p className="text-slate-500">Swipe to add activities to your collection</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ActivityDetail
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onAddToSchedule={(activity) => {
          handleAcceptActivity(activity);
          setSelectedActivity(null);
        }}
      />

       <BottomNav currentPage="Discover" />
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfWeek, addDays, addMinutes, parse } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";

import WeeklyTimetable from '../components/schedule/WeeklyTimetable';
import ActivityPicker from '../components/schedule/ActivityPicker';
import { calculateCycleInfo, getPhaseForDate } from '../components/cycle/CycleUtils';
import { phaseConfig } from '../components/cycle/PhaseIndicator';
import BottomNav from '../components/ui/BottomNav';

export default function Schedule() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [showPicker, setShowPicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isAutoDrafting, setIsAutoDrafting] = useState(false);

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
    queryFn: () => base44.entities.UserActivity.filter({ 
      created_by: user?.email,
      is_active: true 
    }),
    enabled: !!user?.email,
  });

  const { data: scheduledActivities = [], isLoading } = useQuery({
    queryKey: ['scheduledActivities', format(weekStart, 'yyyy-MM-dd')],
    queryFn: () => base44.entities.ScheduledActivity.filter({ 
      created_by: user?.email,
      week_start: format(weekStart, 'yyyy-MM-dd')
    }),
    enabled: !!user?.email,
  });

  const settings = cycleSettings?.[0];
  const cycleInfo = calculateCycleInfo(settings);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ScheduledActivity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ScheduledActivity.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ScheduledActivity.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
    },
  });

  const handleAddActivity = (dayIndex, time) => {
    setSelectedSlot({ dayIndex, time });
    setShowPicker(true);
  };

  const handleSelectActivity = (activity) => {
    if (!selectedSlot) return;

    const endTime = format(
      addMinutes(parse(selectedSlot.time, 'HH:mm', new Date()), activity.duration_minutes || 60),
      'HH:mm'
    );

    createMutation.mutate({
      activity_id: activity.id,
      week_start: format(weekStart, 'yyyy-MM-dd'),
      day_of_week: selectedSlot.dayIndex,
      start_time: selectedSlot.time,
      end_time: endTime,
    });

    setSelectedSlot(null);
  };

  const handleMoveActivity = (id, updates) => {
    updateMutation.mutate({ id, data: updates });
  };

  const handleRemoveActivity = (id) => {
    deleteMutation.mutate(id);
  };

  // Auto-draft activities based on user preferences and phase
  const handleAutoDraft = async () => {
    setIsAutoDrafting(true);

    const activeActivityIds = userActivities
      .filter((ua) => ua.is_active)
      .map((ua) => ua.activity_id);

    const activeActivities = activities.filter((a) => activeActivityIds.includes(a.id));
    
    if (activeActivities.length === 0) {
      setIsAutoDrafting(false);
      return;
    }

    // Clear existing scheduled activities for the week
    for (const sa of scheduledActivities) {
      await base44.entities.ScheduledActivity.delete(sa.id);
    }

    // Draft activities for each day based on phase
    const drafts = [];
    const timeSlots = ['07:00', '09:00', '12:00', '15:00', '18:00', '20:00'];
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = addDays(weekStart, dayIndex);
      const phase = getPhaseForDate(settings, date);
      
      // Get activities suitable for this phase
      const phaseActivities = activeActivities.filter((a) => a.phases?.includes(phase));
      const fallbackActivities = activeActivities;
      const availableActivities = phaseActivities.length > 0 ? phaseActivities : fallbackActivities;

      // Assign 2-3 activities per day
      const numActivities = Math.floor(Math.random() * 2) + 2;
      const shuffled = [...availableActivities].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < Math.min(numActivities, shuffled.length); i++) {
        const activity = shuffled[i];
        const time = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        
        drafts.push({
          activity_id: activity.id,
          week_start: format(weekStart, 'yyyy-MM-dd'),
          day_of_week: dayIndex,
          start_time: time,
          end_time: format(
            addMinutes(parse(time, 'HH:mm', new Date()), activity.duration_minutes || 60),
            'HH:mm'
          ),
        });
      }
    }

    // Create all drafts
    for (const draft of drafts) {
      await base44.entities.ScheduledActivity.create(draft);
    }

    queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
    setIsAutoDrafting(false);
  };

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
            <h1 className="text-xl font-bold text-slate-800">Weekly Schedule</h1>
            <div className="w-10" />
          </div>

          {/* Phase legend */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2">
            {Object.entries(phaseConfig).map(([phase, config]) => (
              <div
                key={phase}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} shrink-0`}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color}`} />
                <span className={`text-xs font-medium ${config.text} capitalize`}>{phase}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Auto-draft button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Button
            onClick={handleAutoDraft}
            disabled={isAutoDrafting || userActivities.length === 0}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium"
          >
            {isAutoDrafting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Drafting schedule...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Auto-Draft Week
              </>
            )}
          </Button>
          {userActivities.length === 0 && (
            <p className="text-sm text-slate-500 text-center mt-2">
              Add activities in <Link to={createPageUrl('Discover')} className="text-violet-600 font-medium">Discover</Link> first
            </p>
          )}
        </motion.div>

        {/* Timetable */}
        <WeeklyTimetable
          scheduledActivities={scheduledActivities}
          activities={activities}
          cycleSettings={settings}
          weekStart={weekStart}
          onWeekChange={setWeekStart}
          onAddActivity={handleAddActivity}
          onRemoveActivity={handleRemoveActivity}
          onMoveActivity={handleMoveActivity}
        />
      </div>

      {/* Activity picker */}
      <ActivityPicker
        activities={activities}
        isOpen={showPicker}
        onClose={() => {
          setShowPicker(false);
          setSelectedSlot(null);
        }}
        onSelect={handleSelectActivity}
        currentPhase={cycleInfo.phase}
      />

      <BottomNav currentPage="Schedule" />
    </div>
  );
}
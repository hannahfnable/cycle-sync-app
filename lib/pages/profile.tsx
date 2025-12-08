import React, { useState, useEffect } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { ChevronLeft, Calendar, Clock, Moon, Droplets, Bell, Link as LinkIcon, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button, Switch } from 'react-native';
import { calculateCycleInfo } from '@/utils/cycleUtils';


export default function Profile() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    cycle_length: 28,
    period_length: 5,
    last_period_start: '',
  });

  useEffect(() => {
    auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: cycleSettings } = useQuery({
    queryKey: ['cycleSettings'],
    queryFn: () => base44.entities.CycleSettings.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const settings = cycleSettings?.[0];

  useEffect(() => {
    if (settings) {
      setFormData({
        cycle_length: settings.cycle_length || 28,
        period_length: settings.period_length || 5,
        last_period_start: settings.last_period_start || '',
      });
    }
  }, [settings]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CycleSettings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycleSettings'] });
      setIsEditing(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CycleSettings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycleSettings'] });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    if (settings) {
      updateMutation.mutate({ id: settings.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const cycleInfo = calculateCycleInfo(settings);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link 
            to={createPageUrl('Home')}
            className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Profile</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* User info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-2xl text-white font-bold">
            {user?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.full_name || 'Guest'}</h2>
            <p className="text-sm text-slate-600">{user?.email}</p>
          </div>
        </motion.div>

        {/* Cycle overview */}
        {settings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Moon className="w-5 h-5 text-violet-500" />
                  Cycle Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl ${phases[cycleInfo.phase]?.bg}`}>
                    <p className="text-sm text-slate-500 mb-1">Current Phase</p>
                    <p className={`text-lg font-bold ${phases[cycleInfo.phase]?.text} capitalize`}>
                      {phases[cycleInfo.phase]?.emoji} {cycleInfo.phase}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Cycle Day</p>
                    <p className="text-lg font-bold text-slate-800">Day {cycleInfo.cycleDay}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="w-4 h-4 text-rose-500" />
                    <p className="text-sm text-rose-700">Next period in</p>
                  </div>
                  <p className="text-2xl font-bold text-rose-600">
                    {cycleInfo.daysUntilPeriod} days
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Cycle settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-500" />
                  Cycle Settings
                </CardTitle>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-violet-600"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="last_period_start">Last Period Start Date</Label>
                <Input
                  id="last_period_start"
                  type="date"
                  value={formData.last_period_start}
                  onChange={(e) => setFormData({ ...formData, last_period_start: e.target.value })}
                  disabled={!isEditing}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cycle_length">Cycle Length (days)</Label>
                  <Input
                    id="cycle_length"
                    type="number"
                    min="21"
                    max="40"
                    value={formData.cycle_length}
                    onChange={(e) => setFormData({ ...formData, cycle_length: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period_length">Period Length (days)</Label>
                  <Input
                    id="period_length"
                    type="number"
                    min="2"
                    max="10"
                    value={formData.period_length}
                    onChange={(e) => setFormData({ ...formData, period_length: parseInt(e.target.value) })}
                    disabled={!isEditing}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              {isEditing && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 h-12 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 h-12 rounded-xl bg-violet-600 hover:bg-violet-700"
                  >
                    Save
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Integrations (placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-violet-500" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Apple Calendar</p>
                    <p className="text-sm text-slate-500">Coming soon</p>
                  </div>
                </div>
                <Switch disabled />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Google Calendar</p>
                    <p className="text-sm text-slate-500">Coming soon</p>
                  </div>
                </div>
                <Switch disabled />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-violet-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="font-medium text-slate-800">Period reminders</p>
                  <p className="text-sm text-slate-500">Get notified before your period</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="font-medium text-slate-800">Daily activity reminders</p>
                  <p className="text-sm text-slate-500">Remind me of scheduled activities</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full h-14 rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log out
        </Button>
      </div>

      <BottomNav currentPage="Profile" />
    </div>
  );
}
import { PhaseType } from "../enums/phase.enum";
import { Phase } from "../period/phase";
import { TimeOfDay, Mood, ActivityType } from "./enums";

interface PeriodInputs {
    cycle_length_days: number;
    menstruation_length_days: number;
    last_menstruation_start: Date; // ISO date string
    previous_period_start: Date; // ISO date string
}

interface SyncSettings {
    notificationsEnabled: boolean;
    reminderTime: string; // "HH:MM" format
    theme: 'light' | 'dark' | 'system';
    activitiesPerDay: number;
}


export type { PeriodInputs };
export interface ActivityTags {
  id: string;
  phase: PhaseType[];
  time: TimeOfDay[];
  mood: Mood[];
  favorite?: boolean;
  type: ActivityType;
}

export interface ActivityDetails {
  id: string;
  title: string;
  description: string;
  minutes?: number;
  emoji?: string;
  colour?: string;
  link?: string;
}

export interface ActivityId {
  id: string;
}

export interface Favorites {
  activityIds: string[];
}

export interface Activity extends ActivityId {
  id: string;
  tags: ActivityTags;
  details: ActivityDetails;
}

export interface DailyContext extends Context {
  time: TimeOfDay;
  mood: Mood;
}

export interface Context {
  phase: Phase;
  favourites: Favorites;
  settings: SyncSettings;
}
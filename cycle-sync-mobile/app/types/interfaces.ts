import { Phase, TimeOfDay, Mood, ActivityType } from "./enums";

interface PeriodInputs {
    cycle_length_days: number;
    menstruation_length_days: number;
    last_menstruation_start: Date; // ISO date string
    previous_period_start: Date; // ISO date string
}


export type { PeriodInputs };
export interface ActivityTags {
  id: string;
  phase: Phase[];
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

export interface Context {
  favourites: Favorites;
  phase: Phase;
  time: TimeOfDay;
  mood: Mood;
}
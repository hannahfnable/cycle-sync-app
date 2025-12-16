import { Phase, TimeOfDay, Mood, ActivityType } from "./enums";

export interface ActivityTags {
  phase: Phase[];
  time: TimeOfDay[];
  mood: Mood[];
  favorite?: boolean;
  type: ActivityType;
}

export interface ActivityDetails {
  description: string;
  emoji: string;
  colour: string;
  link?: string;
}

export interface ActivityCard {
  id: string;
  tags: ActivityTags;
  details: ActivityDetails;
}

export interface Context {
  phase: Phase;
  time: TimeOfDay;
  mood: Mood;
}
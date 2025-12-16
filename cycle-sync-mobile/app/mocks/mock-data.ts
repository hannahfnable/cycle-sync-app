import { ActivityDetails, ActivityId, ActivityTags } from '../types/interfaces';
import { Phase, TimeOfDay, Mood, ActivityType } from "../types/enums";

export const activities: ActivityId[] = [
  {
    id: "meal_smoothie",
  },
  {
    id: "gentle_yoga",
  },
  {
    id: "journaling",
  }
];

export const activityTags: ActivityTags[] = [{
      id: "meal_smoothie",
      phase: [Phase.Follicular, Phase.Ovulatory],
      time: [TimeOfDay.Morning],
      mood: [Mood.Neutral, Mood.High],
      type: ActivityType.Meal,
  },
   {
      id: "gentle_yoga",
      phase: [Phase.Menstrual, Phase.Luteal],
      time: [TimeOfDay.Evening, TimeOfDay.Morning],
      mood: [Mood.Low, Mood.Neutral],
      type: ActivityType.Exercise
    },
    {
      id: "journaling",
      phase: [Phase.Luteal],
      time: [TimeOfDay.Evening, TimeOfDay.Afternoon],
      mood: [Mood.Low, Mood.Neutral],
      type: ActivityType.Creative,
      favorite: true
    },
];

export const activityDetails: ActivityDetails[] = [{
      id: "meal_smoothie",
      title: "Morning Protein Smoothie",
      description: "Protein smoothie to kickstart your morning",
      emoji: "🥤",
      colour: "#FFB6C1",
      link: "https://example.com/smoothie"
  }, {
    id: "gentle_yoga",
    title: "Gentle Yoga Flow",
    description: "Gentle yoga flow to ease cramps and relax body",
    emoji: "🧘",
    colour: "#A3D5D3",
    link: "https://example.com/gentle-yoga",
  }, {
    id: "journaling",
    title: "Evening Journaling",
    description: "Evening journaling prompt for reflection",
    emoji: "📓",
    colour: "#FFD580",
    link: "https://example.com/journaling"
  }
];
import { ActivityType, Emoji } from "../enums/activity.enum"
import { PhaseType } from "../enums/phase.enum"

interface Activity {
      name: string,
      description: string,
      emoji: Emoji | null,
      type: ActivityType,
      phases: PhaseType[],
      article_url: string,
      benefits: string[],
      duration_minutes: number | null,
      activity_id: string,
      is_favorite: boolean,
}

export type { Activity };

import { Activity, Context, ActivityTags, ActivityId } from '../types/interfaces';

function scoreCard(activityTags: ActivityTags, context: Context): number {
  let score = 0;

  if (activityTags.phase.includes(context.phase)) score += 2;
  if (activityTags.time.includes(context.time)) score += 1;
  if (activityTags.mood.includes(context.mood)) score += 1;
  if (context.favourites.activityIds.includes(activityTags.id)) score += 2;

  // Random novelty factor
  score += Math.random();

  return score;
}

export function weightedRandomChoice(activities: ActivityTags[], k: number, context: Context): ActivityId[] {
  const scoredCards = activities.map(card => ({
    card,
    score: scoreCard(card, context)
  }));

  const results: ActivityId[] = [];

  for (let i = 0; i < k; i++) {
    const totalScore = scoredCards.reduce((sum, c) => sum + c.score, 0);
    let r = Math.random() * totalScore;
    for (const c of scoredCards) {
      r -= c.score;
      if (r <= 0) {
        results.push(c.card);
        break;
      }
    }
  }

  return results;
}
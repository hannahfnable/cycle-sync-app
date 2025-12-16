import { ActivityCard, Context } from "./interfaces";

function scoreCard(card: ActivityCard, context: Context): number {
  let score = 0;

  if (card.tags.phase.includes(context.phase)) score += 2;
  if (card.tags.time.includes(context.time)) score += 1;
  if (card.tags.mood.includes(context.mood)) score += 1;
  if (card.tags.favorite) score += 2;

  // Random novelty factor
  score += Math.random();

  return score;
}

export function weightedRandomChoice(cards: ActivityCard[], k: number, context: Context): ActivityCard[] {
  const scoredCards = cards.map(card => ({
    card,
    score: scoreCard(card, context)
  }));

  const results: ActivityCard[] = [];

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
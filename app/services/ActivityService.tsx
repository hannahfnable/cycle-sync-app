import { mockActivityDetails, mockActivityIds, mockActivityTags } from '../mocks/mock-data';
import { Activity, ActivityDetails, ActivityId, ActivityTags, Context } from '../types/interfaces';


class ActivityService {
    favourites: string[] = [];

    setActivities() {
        localStorage.setItem('activitiesIds', JSON.stringify(mockActivityIds));
        localStorage.setItem('activities', JSON.stringify(mockActivityDetails));
        localStorage.setItem('activitiesTags', JSON.stringify(mockActivityTags));
    }


    getActivityById(id: string): ActivityDetails | undefined {
        let activities = localStorage.getItem('activitiesIds')
        if (activities != null) {
        // Retrieving data using getItem
            const activityDetails = JSON.parse(activities).find((activity: ActivityDetails) => activity.id === id);
            return activityDetails;
        }
        return undefined;
    }

    getFavourites(): string[] {
        let favos = localStorage.getItem('favouriteActivities')
        if (favos == null) {
           localStorage.setItem('favouriteActivities', JSON.stringify([]))
           return [];
        } else {
          let favs: string[] = JSON.parse(favos);
          return favs
        }
    }

    addFavourite(id: string) {
        this.favourites.push(id);
        localStorage.setItem('favouriteActivities', JSON.stringify(this.favourites))
    }

    private scoreCard(activityTags: ActivityTags, context: Context): number {
    let score = 0;

    if (activityTags.phase.includes(context.phase.phaseType)) score += 2;
    //if (activityTags.time.includes(context.time)) score += 1;
    //if (activityTags.mood.includes(context.mood)) score += 1;
    if (context.favourites.activityIds.includes(activityTags.id)) score += 2;

    // Random novelty factor
    score += Math.random();

    return score;
    }

    private generateActivities(context: Context): ActivityId[] {
        const activities: ActivityTags[] = require('../mocks/mock-data').activityTags;
        const days = context.phase.length;
        return this.weightedRandomChoice(activities, (context.settings.activitiesPerDay * days), context);
    }

    private weightedRandomChoice(activities: ActivityTags[], k: number, context: Context): ActivityId[] {
        const scoredCards = activities.map(card => ({
            card,
            score: this.scoreCard(card, context)
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
        
}

export {ActivityService}

import { PeriodInputs } from "../interfaces/periodinputs";
import { Cycle, NextCycle } from "./cycle";


class User  {
    id: string;
    quiz: PeriodInputs | null;
    cycles: Cycle[] | undefined;
    constructor(id: string, quiz: PeriodInputs | null) {
        this.id = id;
        this.quiz = quiz;
        this.cycles = this.generateCycles(quiz);
    }

    generateCycles(answers: PeriodInputs | null) {
        if (answers != null) {
        const cycle1 = new Cycle(answers.previous_period_start, answers.menstruation_length_days, answers?.last_menstruation_start)
        const cycle2 = new NextCycle(answers.last_menstruation_start, answers?.menstruation_length_days, answers?.cycle_length_days)
          return [cycle1, cycle2]
        } else {
            return []
        }
    }

}

export {User};
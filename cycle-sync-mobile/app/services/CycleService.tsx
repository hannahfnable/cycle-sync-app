import { Cycle, NextCycle } from '../period/cycle';
import { PeriodInputs } from '../types/interfaces';


class CycleService {
    private cycles: Cycle[] = [];

    setCycles(cycles: Cycle[]) {
        localStorage.setItem('cycles', JSON.stringify(cycles));
    }

    getCycles(): Cycle[] | undefined {
        const cycles = localStorage.getItem('cycles')
        if (cycles != null) {
           this.cycles = JSON.parse(cycles)
           return this.cycles
        }
    }

    initializeCycles(periodInfo: PeriodInputs ) {
        const cycles = this.generateCycles(periodInfo)
        if (cycles.length > 0) {
            this.setCycles(cycles)
        }
    }

    getCurrentCycle(): Cycle {
        return this.cycles[-1];
    }

    private generateCycles(answers: PeriodInputs | null): Cycle[] {
        if (answers != null) {
        const cycle1 = new Cycle(answers.previous_period_start, answers.menstruation_length_days, answers?.last_menstruation_start)
        const cycle2 = new NextCycle(answers.last_menstruation_start, answers?.menstruation_length_days, answers?.cycle_length_days)
          return [cycle1, cycle2]
        } else {
            return []
        }
    };
    
}

export {CycleService};


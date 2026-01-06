import { PhaseType } from "../enums/phase.enum";
import { Phase } from "./phase";


class Cycle {
    startDate: Date;
    periodLength: number;
    end_date: Date ;
    phases: Phase[];
    ovulationDate: Date;
    constructor(
        startDate: Date,
        periodLength: number,
        end_date: Date,
    ) {
        this.startDate = startDate;
        this.periodLength = periodLength;
        this.end_date = end_date;
        this.ovulationDate = this.getOvulationDate();
        this.phases = this.generatePhases();
    }

        
    getOvulationDate(): Date {
        //  cycleLength = end_date - startDate 
        const ovulation = new Date(this.startDate);
        const cycleLength = Math.round((this.end_date.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
        ovulation.setDate(this.startDate.getDate() + (cycleLength / 2) - 1);
        return ovulation;
    }

    generatePhases() {
        const periodEnd = new Date(this.startDate.getDate() + this.periodLength)
        const menustrualPhase =  new Phase(this.startDate, periodEnd, PhaseType.Menstrual)

        const follicularPhase =  new Phase(periodEnd, this.ovulationDate, PhaseType.Follicular )

        const lutealDate = new Date(this.ovulationDate)
        lutealDate.setDate(this.ovulationDate.getDate() + 6)
        const ovulationPhase = new Phase(this.ovulationDate, lutealDate, PhaseType.Ovulatory )

        const lutealPhase = new Phase(lutealDate, this.end_date, PhaseType.Luteal)

        return [menustrualPhase, follicularPhase, ovulationPhase, lutealPhase]
    }
}

class NextCycle extends Cycle {
    cycleLength: number;

    constructor(
        startDate: Date,
        periodLength: number,
        cycleLength: number = 28,
    ) {
        super(startDate, periodLength, new Date(startDate))
        this.end_date = this.estimateCycleEnd();
        this.cycleLength = cycleLength;
        this.phases = this.generatePhases()
    }

    estimateCycleEnd(): Date {
        const cycleEnd = new Date(this.startDate);
        cycleEnd.setDate(this.startDate.getDate() + this.cycleLength);
        return cycleEnd;
    }

}

export { Cycle, NextCycle };

import { PhaseType } from "../enums/phase.enum";

class Phase {
    start_date: Date;
    end_date: Date;
    phaseType: PhaseType;
    length: number;
    constructor(start: Date, end: Date, phaseType: PhaseType) {
        this.start_date = start;
        this.phaseType = phaseType;
        this.end_date = end;
        this.length = Math.round((this.end_date.getTime() - this.start_date.getTime()) / (1000 * 60 * 60 * 24));
    }
}

export {Phase};
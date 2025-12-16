import { PhaseType } from "../enums/phase.enum";

class Phase {
    start_date: Date;
    end_date: Date;
    phaseType: PhaseType;
    constructor(start: Date, end: Date, phaseType: PhaseType) {
        this.start_date = start;
        this.phaseType = phaseType;
        this.end_date = end;
    }
}

export {Phase};
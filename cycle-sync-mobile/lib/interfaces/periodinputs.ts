
interface PeriodInputs {
    cycle_length_days: number;
    menstruation_length_days: number;
    last_menstruation_start: Date; // ISO date string
    previous_period_start: Date; // ISO date string
}



export type { PeriodInputs };
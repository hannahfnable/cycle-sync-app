
interface CycleSettings {
    created_by: string;
    cycle_length_days: number;
    menstruation_length_days: number;
    last_menstruation_start: string; // ISO date string
    previous_period_start: string; // ISO date string
}

export type { CycleSettings };
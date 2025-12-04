import { PhaseType } from "../enums/phase.enum";

interface Phase {
    type: PhaseType,
    color: string,
    bg: string,
    text: string,
    border: string,
    emoji: string,
    description: string,
};

export type { Phase };
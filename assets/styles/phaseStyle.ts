import { PhaseType } from "../../app/types/phase.enum";

interface PhaseStyle {
    type: PhaseType,
    color: string,
    bg: string,
    text: string,
    border: string,
    emoji: string,
    description: string,
};

export type { PhaseStyle };
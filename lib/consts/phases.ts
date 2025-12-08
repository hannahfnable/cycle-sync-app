import { PhaseType } from "../enums/phase.enum";
import { Phase } from "../interfaces/phase.interface";

const phases = {
  menstruation: {
    type: PhaseType.Menstruation,
    color: 'from-rose-400 to-red-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    emoji: '🌙',
    description: 'Rest & restore',
  } as Phase,
  follicular: {
    type: PhaseType.Follicular,
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    emoji: '🌱',
    description: 'Rising energy',
  } as Phase,
  ovulation: {
    type: PhaseType.Ovulation,
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    emoji: '☀️',
    description: 'Peak vitality',
  } as Phase,
  luteal: {
    type: PhaseType.Luteal,
    color: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    emoji: '🍂',
    description: 'Winding down',
  } as Phase,
};
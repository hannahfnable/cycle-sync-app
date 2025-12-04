import { differenceInDays, addDays } from 'date-fns';

export function calculateCycleInfo(settings) {
  if (!settings?.last_period_start) {
    return { phase: 'follicular', cycleDay: 1, daysUntilPeriod: 28 };
  }

  const cycleLength = settings.cycle_length || 28;
  const periodLength = settings.period_length || 5;
  const lastPeriodStart = new Date(settings.last_period_start);
  const today = new Date();
  
  const daysSinceLastPeriod = differenceInDays(today, lastPeriodStart);
  const cycleDay = (daysSinceLastPeriod % cycleLength) + 1;
  
  // Phase calculation based on typical 28-day cycle
  // Menstruation: Days 1-5
  // Follicular: Days 6-13
  // Ovulation: Days 14-16
  // Luteal: Days 17-28
  
  let phase;
  if (cycleDay <= periodLength) {
    phase = 'menstruation';
  } else if (cycleDay <= 13) {
    phase = 'follicular';
  } else if (cycleDay <= 16) {
    phase = 'ovulation';
  } else {
    phase = 'luteal';
  }

  const daysUntilPeriod = cycleLength - cycleDay + 1;
  const nextPeriodDate = addDays(lastPeriodStart, cycleLength);

  return {
    phase,
    cycleDay,
    daysUntilPeriod,
    nextPeriodDate,
    cycleLength,
    periodLength,
  };
}

export function getPhaseForDate(settings, date) {
  if (!settings?.last_period_start) {
    return 'follicular';
  }

  const cycleLength = settings.cycle_length || 28;
  const periodLength = settings.period_length || 5;
  const lastPeriodStart = new Date(settings.last_period_start);
  
  const daysSinceLastPeriod = differenceInDays(date, lastPeriodStart);
  const cycleDay = ((daysSinceLastPeriod % cycleLength) + cycleLength) % cycleLength + 1;
  
  if (cycleDay <= periodLength) return 'menstruation';
  if (cycleDay <= 13) return 'follicular';
  if (cycleDay <= 16) return 'ovulation';
  return 'luteal';
}
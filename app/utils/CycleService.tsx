
import { Cycle, NextCycle } from '../types/cycle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PeriodInputs } from '../types/interfaces';
import { MessageResult } from '../types/message';
import logger from './LoggerService';
import { Phase } from '../types/phase';
import { PhaseType } from '../types/phase.enum';


class CycleService {
    private cycles: Cycle[] = [];

    getLatestCycles(): Cycle[] | undefined {
        AsyncStorage.getItem('cycles').then((data) => {
            if (data) {
                this.cycles = JSON.parse(data);
            }
        });
        if (this.cycles && this.cycles.length > 0) return this.cycles;
        return undefined;
    }

    getCurrentCycle(): Cycle {
        return this.cycles[this.cycles.length - 1];
    }

    getCurrentPhase(): string {
        const currentCycle = this.getCurrentCycle();
        currentCycle.phases.forEach(phase => {
            const now = new Date();
            if (now >= phase.start_date && now <= phase.end_date) {
                return phase.phaseType;
            }
        });
        logger.warn('Current phase not found, defaulting to Menstrual');
        return PhaseType.Menstrual;
    }

    getDaysLeftInPhase() {
        const currentCycle = this.getCurrentCycle();
        const currentPhase = this.getCurrentPhase();
        const now = new Date();
        let daysLeft = 0;
        currentCycle.phases.forEach(phase => {
            if (phase.phaseType === currentPhase) {
                daysLeft = Math.ceil((phase.end_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            }
        });
        return daysLeft;
    }

    getCycles(): Cycle[] {
        return this.cycles;
    }

    addPeriod(periodInfo: PeriodInputs): void {
        const newCycle = new NextCycle(periodInfo.last_menstruation_start, periodInfo?.menstruation_length_days, periodInfo?.cycle_length_days);
        let message = this.saveCycle(newCycle);
        logger.info('CycleService addPeriod', { message });
    }

    createCycles(periodInfo: PeriodInputs ): void {
        let message = this.initializeCycles(periodInfo);
        logger.info('CycleService createCycles', { message });
    }

    private saveCycle(newCycle: Cycle): string{
        let lastCycle = this.cycles[this.cycles.length - 1];
        if (lastCycle) {
            lastCycle.end_date = newCycle.startDate;
            lastCycle.generatePhases();
            this.cycles[this.cycles.length - 1] = lastCycle;
            if (this.cycles[this.cycles.length - 1].end_date == newCycle.startDate) {
                this.cycles.push(newCycle);
                AsyncStorage.setItem('cycles', JSON.stringify(this.cycles)).catch((error) => {
                    logger.error('Error saving cycles to storage', { error });
                    return (MessageResult.Failure, 'Failed to save new cycle in async storage');
                });
                return (MessageResult.Success, 'Cycle saved successfully');
            } else {
                return (MessageResult.Failure, 'Failed to update last cycle end date');
            }
        } else {
            return (MessageResult.Failure, 'No existing cycles to update');
        }
    
    }

    private initializeCycles(periodInfo: PeriodInputs ): string {
         if (periodInfo != null) {
            const cycle1 = new Cycle(periodInfo.previous_period_start, periodInfo.menstruation_length_days, periodInfo?.last_menstruation_start)
            const cycle2 = new NextCycle(periodInfo.last_menstruation_start, periodInfo?.menstruation_length_days, periodInfo?.cycle_length_days)
            let initialCycles = [cycle1, cycle2];
            AsyncStorage.setItem('cycles', JSON.stringify(initialCycles)).catch((error) => {
                logger.error('Error saving cycles to storage', { error });
                return (MessageResult.Failure, 'Failed to save cycles in async storage');
            });
            let savedCycles = this.getCycles();
            if (savedCycles == initialCycles) {
                return (MessageResult.Success, 'Cycles initialized');
            } else {
                return (MessageResult.Failure, 'Failed to verify saved cycles');
            }
        } else {
            return (MessageResult.Failure, 'No Period Info provided');
        }
    }
    
}

export {CycleService};


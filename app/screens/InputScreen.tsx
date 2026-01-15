import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import CalendarPicker from "react-native-calendar-picker";
import { PeriodInputs } from '../types/interfaces';
import { CycleService } from '../utils/CycleService';
import { checkIfVisited, markAsVisited } from '../utils/VisitedQuizChecker';
import LoggerService from '../utils/LoggerService';

export default function InputScreen({ navigation }: any) {
  const [cycleLength, setUserCycleLength] = useState(28);
  const [newPeriod, setNewPeriod] = useState<Date>(new Date());
  const [periodLength, setPeriodLength] = useState(5);
    const [previousPeriod, setPreviousPeriod] = useState<Date>(
      new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
    );

  const [visited, setVisited] = useState<boolean | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const v = await checkIfVisited();
        if (mounted) setVisited(v);
      } catch (err) {
        LoggerService.warn('InputScreen checkIfVisited failed', { err });
        if (mounted) setVisited(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const cycleService = new CycleService();


  async function submitPeriodData(periodInfo: PeriodInputs): Promise<void> {
    if (await checkIfVisited()) {
      cycleService.addPeriod(periodInfo);
      LoggerService.info('User has previously submitted period data. Added new period.', { periodInfo });
    } else {
      cycleService.createCycles(periodInfo)
      await markAsVisited();
    }
    navigation.navigate('Home');
  }

  function stepsForVisited(): string[] {
    if (visited === null) return [];
    return visited === false
      ? ['lastPeriod', 'cycleLength', 'periodLength', 'previousPeriod']
      : ['lastPeriod', 'cycleLength', 'periodLength'];
  }

  const steps = stepsForVisited();

  function renderStep() {
    const step = steps[stepIndex];
    if (!step) return null;
    switch (step) {
      case 'lastPeriod':
        return (
          <>
            <Text style={styles.label}>When was your last period?</Text>
            <CalendarPicker
              onDateChange={(date: Date) => setNewPeriod(date)}
              selectedDayColor="#ff4da6"
              selectedDayStyle={{ backgroundColor: '#eb94bf' }}
              todayBackgroundColor="#ffe6f0"
            />
          </>
        );
      case 'cycleLength':
        return (
          <>
            <Text style={styles.label}>How many days long is your normal cycle?</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(cycleLength)}
              onChangeText={(val) => setUserCycleLength(Number(val) || 0)}
            />
          </>
        );
      case 'periodLength':
        return (
          <>
            <Text style={styles.label}>How many days does your period normally last?</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(periodLength)}
              onChangeText={(val) => setPeriodLength(Number(val) || 0)}
            />
          </>
        );
      case 'previousPeriod':
        return (
          <>
            <Text style={styles.label}>When was your previous cycle's period?</Text>
            <CalendarPicker
              onDateChange={(date: any) => setPreviousPeriod(date)}
              selectedDayColor="#ff4da6"
              selectedDayStyle={{ backgroundColor: '#d37ba7' }}
              todayBackgroundColor="#ffe6f0"
            />
          </>
        );
      default:
        return null;
    }
  }

  const onNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    else {
      // final step -> submit
      submitPeriodData({
        cycle_length_days: cycleLength,
        last_menstruation_start: newPeriod,
        menstruation_length_days: periodLength,
        previous_period_start: previousPeriod,
      });
    }
  };

  const onBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {visited === null ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#ff4da6" />
            <Text style={{ marginTop: 12 }}>Loading...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.stepText}>Step {stepIndex + 1} of {steps.length}</Text>
            {renderStep()}

            <View style={{ height: 20 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.navButton, stepIndex === 0 && styles.navButtonDisabled]} disabled={stepIndex === 0} onPress={onBack}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onNext}>
                <Text style={styles.buttonText}>{stepIndex < steps.length - 1 ? 'Next' : 'Continue'}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 18, marginBottom: 10, color: '#d63384' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#ff4da6', padding: 12, borderRadius: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  stepText: { textAlign: 'center', marginBottom: 12, color: '#666' },
  navButton: { backgroundColor: '#eee', padding: 12, borderRadius: 25, alignItems: 'center', minWidth: 100 },
  navButtonDisabled: { opacity: 0.5 },
});
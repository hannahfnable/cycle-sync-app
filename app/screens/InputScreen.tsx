import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import CalendarPicker from "react-native-calendar-picker";
import { PeriodInputs } from '../types/interfaces';
import { CycleService } from '../utils/CycleService';
import { checkIfVisited, markAsVisited } from '../utils/VisitedQuizChecker';
import LoggerService from '../utils/LoggerService';

export default async function InputScreen({ navigation }: any) {
  const [cycleLength, setUserCycleLength] = useState(28);
  const [newPeriod, setNewPeriod] = useState<Date>(new Date());
  const [periodLength, setPeriodLength] = useState(5);
    const [previousPeriod, setPreviousPeriod] = useState<Date>(
      new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
    );

  const cycleService = new CycleService();


  async function submitPeriodData(periodInfo: PeriodInputs) {
    if (await checkIfVisited()) {
      cycleService.addPeriod(periodInfo);
      LoggerService.info('User has previously submitted period data. Added new period.', { periodInfo });
    } else {
      cycleService.createCycles(periodInfo)
      await markAsVisited();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>When was your last period?</Text>
      <CalendarPicker
        onDateChange={(date: Date) => setNewPeriod(date)}
        selectedDayColor="#ff4da6"
        todayBackgroundColor="#ffe6f0"
      /> 
      <Text style={styles.label}>How many days long is your normal cycle? (time between periods)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(cycleLength) => setUserCycleLength(Number(cycleLength))}
      />
      <Text style={styles.label}>How many day does your period normally last for?</Text>
        <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(periodLength) => setPeriodLength(Number(periodLength))}
        />
      { !(await checkIfVisited()) && (
        <>
          <Text style={styles.label}>When was your previous cycle's period?</Text>
            <CalendarPicker
            onDateChange={(date: any) => setPreviousPeriod(date)}
            selectedDayColor="#ff4da6"
            todayBackgroundColor="#ffe6f0"
        />
        </>
      )}
    
      <TouchableOpacity style={styles.button} onPress={() => {
          submitPeriodData({
            cycle_length_days: cycleLength,
            last_menstruation_start: newPeriod,
            menstruation_length_days: periodLength,
            previous_period_start: previousPeriod
          });
          navigation.navigate('Home'); }
        }>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 18, marginBottom: 10, color: '#d63384' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#ff4da6', padding: 12, borderRadius: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
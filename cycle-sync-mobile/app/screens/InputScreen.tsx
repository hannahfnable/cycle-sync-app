import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import CalendarPicker from "react-native-calendar-picker";

export default function InputScreen({ navigation }) {
  const [cycleLength, setUserCycleLength] = useState('');
  const [newPeriod, setNewPeriod] = useState(null);
  const [periodLength, setPeriodLength] = useState('');
    const [previousPeriod, setPreviousPeriod] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>When was your last period?</Text>
      <CalendarPicker
        onDateChange={(date: any) => setNewPeriod(date)}
        selectedDayColor="#ff4da6"
        todayBackgroundColor="#ffe6f0"
      /> 
      <Text style={styles.label}>When was your previous cycle's period?</Text>
        <CalendarPicker
        onDateChange={(date: any) => setPreviousPeriod(date)}
        selectedDayColor="#ff4da6"
        todayBackgroundColor="#ffe6f0"
    />
      <Text style={styles.label}>How long is your normal cycle? (days)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(cycleLength) => setUserCycleLength(cycleLength)}
      />
      <Text style={styles.label}>How long is your period?</Text>
        <TextInput
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(periodLength) => setPeriodLength(periodLength)}
        />
    
      <TouchableOpacity style={styles.button} onPress={() => 
        submitPeriodData({
          cycleLength,
          newPeriod,
          periodLength,
          previousPeriod
        }).then(() =>
        navigation.navigate('Home'))}>
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
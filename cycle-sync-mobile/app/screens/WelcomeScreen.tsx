import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import { User } from '../../lib/entities/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';



export default function WelcomeScreen({ navigation }) {
    useEffect(() => {
    const setupUserId = async () => {
      let userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4(); // generate new unique ID
        await AsyncStorage.setItem('userId', userId);
        console.log('Generated new user ID:', userId);
        const [user, setUser] = useState(new User(userId, null));
      } else {
        console.log('Existing user ID:', userId);
      }
    };
    setupUserId();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌸 Welcome to CycleSync</Text>
      <Text style={styles.subtitle}>
        Your cycle, your rhythm, your health — all in one place.
      </Text>

      <View style={styles.features}>
        <Text style={styles.feature}>• Track with ease: Log periods, symptoms, moods, and more.</Text>
        <Text style={styles.feature}>• Stay in sync: Get personalized insights and reminders tailored to your cycle.</Text>
        <Text style={styles.feature}>• Empower yourself: Understand your body better and plan with confidence.</Text>
      </View>

      <Text style={styles.footer}>
        ✨ Let’s begin your journey toward smarter cycle tracking and self‑care.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Input')} 
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe6f0', // soft pink background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d63384', // deep pink
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a83279',
    textAlign: 'center',
    marginBottom: 20,
  },
  features: {
    marginVertical: 20,
  },
  feature: {
    fontSize: 14,
    color: '#6a1b4d',
    marginBottom: 10,
    textAlign: 'left',
  },
  footer: {
    fontSize: 16,
    color: '#a83279',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ff4da6', // vibrant pink button
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

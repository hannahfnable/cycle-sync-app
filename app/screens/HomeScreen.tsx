import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CycleService } from '../utils/CycleService';


export default function HomeScreen({ navigation }: any) {
  const cycleService = new CycleService();
  const cyclePhase = cycleService.getCurrentPhase();
  const daysLeft = cycleService.getDaysLeftInPhase();

  return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cycle Phase Card */}
        <View style={styles.phaseCard}>
          <Text style={styles.phaseLabel}>Current Phase</Text>
          <Text style={styles.phaseName}>{cyclePhase.toString()}</Text>
          <Text style={styles.daysLeft}>{daysLeft} days left</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>28</Text>
            <Text style={styles.statLabel}>Cycle Length</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>14</Text>
            <Text style={styles.statLabel}>Days Until Ovulation</Text>
          </View>
        </View>

        {/* Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Activities</Text>
          <TouchableOpacity
            style={styles.activityItem}
            onPress={() => navigation.navigate('ActivityDetail', { id: '1' })}
          >
            <Text style={styles.activityName}>Cardio Workouts</Text>
            <Text style={styles.activityDesc}>High energy phase - great for cardio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.activityItem}
            onPress={() => navigation.navigate('ActivityDetail', { id: '2' })}
          >
            <Text style={styles.activityName}>Yoga</Text>
            <Text style={styles.activityDesc}>Focus on grounding and flexibility</Text>
          </TouchableOpacity>
        </View>

        {/* Symptoms Log */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Symptoms</Text>
          <View style={styles.symptomItem}>
            <Text style={styles.symptomDot}>●</Text>
            <Text style={styles.symptomText}>Energy: High</Text>
          </View>
          <View style={styles.symptomItem}>
            <Text style={styles.symptomDot}>●</Text>
            <Text style={styles.symptomText}>Mood: Positive</Text>
          </View>
          <View style={styles.symptomItem}>
            <Text style={styles.symptomDot}>●</Text>
            <Text style={styles.symptomText}>Sleep: Good</Text>
          </View>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  phaseCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#e91e63',
  },
  phaseLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  phaseName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  daysLeft: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e91e63',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  activityItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#e91e63',
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDesc: {
    fontSize: 12,
    color: '#999',
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  symptomDot: {
    color: '#e91e63',
    fontSize: 16,
    marginRight: 12,
  },
  symptomText: {
    fontSize: 14,
    color: '#666',
  },
});


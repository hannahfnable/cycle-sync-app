import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const ScheduleScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const dates = Array.from({ length: 35 }, (_, i) => ({
    date: i + 1,
    phase: i % 3 === 0 ? 'menstrual' : i % 3 === 1 ? 'follicular' : 'luteal',
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthYear}>December 2024</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Calendar Grid */}
        <View style={styles.weekDaysRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {dates.map((item) => (
            <TouchableOpacity
              key={item.date}
              style={[
                styles.dateCell,
                getPhaseStyle(item.phase),
                selectedDate === item.date && styles.selectedCell,
              ]}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={styles.dateText}>{item.date}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#e91e63' }]} />
            <Text style={styles.legendLabel}>Menstrual</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ff6f61' }]} />
            <Text style={styles.legendLabel}>Follicular</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#f4a460' }]} />
            <Text style={styles.legendLabel}>Ovulation</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4ecdc4' }]} />
            <Text style={styles.legendLabel}>Luteal</Text>
          </View>
        </View>

        {/* Cycle Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Cycle Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Cycle Day:</Text>
            <Text style={styles.infoValue}>14</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cycle Length:</Text>
            <Text style={styles.infoValue}>28 days</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Period:</Text>
            <Text style={styles.infoValue}>Dec 1, 2024</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function getPhaseStyle(phase: string) {
  switch (phase) {
    case 'menstrual':
      return { backgroundColor: '#ffe0e0' };
    case 'follicular':
      return { backgroundColor: '#ffebee' };
    case 'ovulation':
      return { backgroundColor: '#fff3e0' };
    case 'luteal':
      return { backgroundColor: '#e0f7f6' };
    default:
      return { backgroundColor: '#f5f5f5' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 2,
  },
  dateCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 2,
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: '#333',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
});

export default ScheduleScreen;

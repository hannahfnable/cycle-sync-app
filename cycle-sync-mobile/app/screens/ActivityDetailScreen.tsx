import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from '@react-native-vector-icons/Ionicons';

type RootStackParamList = {
  ActivityDetail: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityDetail'>;

const ActivityDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;

  const activities: Record<
    string,
    {
      name: string;
      description: string;
      benefits: string[];
      tips: string[];
      intensity: string;
      duration: string;
    }
  > = {
    '1': {
      name: 'Cardio Workouts',
      description:
        'High-intensity cardiovascular exercises are excellent during the follicular and ovulation phases when energy levels are at their peak.',
      benefits: [
        'Boosts energy and stamina',
        'Improves cardiovascular health',
        'Enhances mood and confidence',
        'Increases endurance',
      ],
      tips: [
        'Start with a 5-minute warm-up',
        'Maintain consistent intensity for 30 minutes',
        'Stay hydrated throughout',
        'Cool down for 5 minutes after',
      ],
      intensity: 'High',
      duration: '45-60 minutes',
    },
    '2': {
      name: 'Yoga',
      description:
        'Gentle to moderate yoga practices help with flexibility, balance, and relaxation. Adjust intensity based on your cycle phase.',
      benefits: [
        'Improves flexibility',
        'Reduces stress and anxiety',
        'Enhances body awareness',
        'Promotes better sleep',
      ],
      tips: [
        'Focus on hip-opening poses',
        'Avoid inversions during menstruation',
        'Practice breathing exercises',
        'Listen to your body',
      ],
      intensity: 'Low to Moderate',
      duration: '45-90 minutes',
    },
  };

  const activity = activities[id] || activities['1'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Activity Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="fitness" size={40} color="#fff" />
          </View>
          <Text style={styles.activityName}>{activity.name}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="flash" size={16} color="#e91e63" />
              <Text style={styles.metaText}>{activity.intensity}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="timer" size={16} color="#e91e63" />
              <Text style={styles.metaText}>{activity.duration}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{activity.description}</Text>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {activity.benefits.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          {activity.tips.map((tip, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.tipNumber}>{index + 1}</Text>
              <Text style={styles.listText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Log Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e91e63',
    marginTop: 8,
    flexShrink: 0,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    flexShrink: 0,
  },
  listText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#e91e63',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ActivityDetailScreen;

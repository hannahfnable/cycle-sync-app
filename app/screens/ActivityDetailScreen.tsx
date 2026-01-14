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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActivityService } from '../utils/ActivityService';


export const ActivityDetailScreen: React.FC<NativeStackScreenProps<any, 'ActivityDetail'>> = ({ route, navigation }) => {
  const id = route?.params?.id as string | undefined;

  const activityService = new ActivityService();
  const activity = id ? activityService.getActivityById(id) : undefined;
  function saveAsFavourite(id?: string): void {
    if (id != undefined) {
      activityService.addFavourite(id)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Activity Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={{fontSize:32}}>{activity?.emoji}</Text>
          </View>
          <Text style={styles.activityName}>{activity?.title}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Ionicons name="timer" size={16} color="#e91e63" />
              <Text style={styles.metaText}>{activity?.minutes} Minutes</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{activity?.description}</Text>
          <Text style={styles.listText}>{activity?.link}</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => saveAsFavourite(activity?.id)}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Add as Favourite</Text>
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
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
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
    paddingHorizontal: 12,
    marginTop: 20,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});


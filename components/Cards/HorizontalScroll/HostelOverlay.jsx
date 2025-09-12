import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { formatViews } from '../../../utils/firebaseUtils';

import {
  getRandomText,
  startTracking,
  getViewCount,
  subscribe,
  unsubscribe,
} from '../../../utils/viewTracker'; 

const HostelOverlay = ({ hostelName, institution, location, views, availability }) => {
  const [viewText, setViewText] = useState("");
  const [viewCount, setViewCount] = useState(views);

  useEffect(() => {
    setViewText(getRandomText(hostelName));
    startTracking(hostelName, views);
    setViewCount(getViewCount(hostelName));

    const handleUpdate = (count) => {
      setViewCount(count);
    };

    subscribe(hostelName, handleUpdate);

    return () => {
      unsubscribe(hostelName, handleUpdate);
    };
  }, [hostelName]);

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={50} tint="dark" style={styles.glassCard}>
        <Text style={styles.hostelName} numberOfLines={1}>
          {hostelName}
        </Text>
        <View style={styles.topRow}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={14} color="white" />
            <Text style={styles.detailText}>{institution}-{location}</Text>
          </View>
        </View>
        <View style={[styles.detailItem, { marginTop: 6 }]}>
          <Ionicons name="eye-outline" size={14} color="white" />
          <Text style={styles.detailText}>
          {formatViews(viewCount)} {viewText}
          </Text>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
  },
  glassCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: 280,
    backgroundColor: 'hsla(0, 100%, 18.6%, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  hostelName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: 'white',
    fontSize: 12.5,
    marginLeft: 4,
  },
});

export default HostelOverlay;
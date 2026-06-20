import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatsRow from './StatsRow';
import COLORS from '../../../constants/Colors';
import { getRandomText, startTracking, getViewCount, subscribe, unsubscribe } from '../../../utils/viewTracker';

const ContentSection = ({
  id,
  accommodation_name,
  institution,
  location,
  reviewText,
  views,
  availability,
}) => {
  const [viewText, setViewText] = useState("");
  const [viewCount, setViewCount] = useState(views || 0);

  useEffect(() => {
    const key = id || "default";
    setViewText(getRandomText(key));
    startTracking(key, views || 0);
    setViewCount(getViewCount(key));
    const handleUpdate = (count) => setViewCount(count);
    subscribe(key, handleUpdate);
    return () => unsubscribe(key, handleUpdate);
  }, [id, views]);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={1}>{accommodation_name}</Text>
        {reviewText && (
          <View style={styles.reviewRow}>
            <MaterialCommunityIcons name="star" size={14} color="#F5A623" />
            <Text style={styles.reviewText}>{reviewText}</Text>
          </View>
        )}
      </View>

      <View style={styles.subRow}>
        <MaterialCommunityIcons name="office-building-outline" size={14} color={COLORS.grey} />
        <Text style={styles.subText} numberOfLines={1}>{institution}</Text>
        <Text style={styles.dot}>·</Text>
        <MaterialCommunityIcons name="map-marker-outline" size={14} color={COLORS.grey} />
        <Text style={styles.subText} numberOfLines={1}>{location}</Text>
      </View>

      <View style={styles.divider} />

      <StatsRow views={viewCount} viewText={viewText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 14 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111',
    flex: 1,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 8,
    flexShrink: 0,
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.grey,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  subText: {
    fontSize: 13,
    color: COLORS.grey,
    flexShrink: 1,
  },
  dot: {
    fontSize: 13,
    color: COLORS.grey,
    marginHorizontal: 2,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#e0e0e0',
    marginVertical: 11,
  },
});

export default ContentSection;
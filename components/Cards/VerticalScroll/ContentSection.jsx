import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatsRow from './StatsRow';
import AvailabilityBadge from './AvailabilityBadge';
import COLORS from '../../../constants/Colors';
import { getRandomText, startTracking, getViewCount, subscribe, unsubscribe } from '../../../utils/viewTracker';

const ContentSection = ({
  id,                    // <-- add this
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
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{accommodation_name}</Text>
        <AvailabilityBadge availability={availability} />
      </View>
      <View style={styles.locationRow}>
        <MaterialCommunityIcons name="map-marker-outline" size={16} color={COLORS.grey} />
        <Text style={styles.location} numberOfLines={1}>
          {institution} · {location}
        </Text>
        {reviewText && (
          <View style={styles.reviewRow}>
            <MaterialCommunityIcons name="star-outline" size={16} color={COLORS.yellow} />
            <Text style={styles.reviewText}>{reviewText}</Text>
          </View>
        )}
      </View>
      <StatsRow views={viewCount} viewText={viewText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "600", flex: 1 },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 4, justifyContent: 'space-between' },
  location: { marginLeft: 4, fontSize: 13, color: COLORS.grey, flex: 1 },
  reviewRow: { flexDirection: 'row', alignItems: 'center' },
  reviewText: { marginLeft: 2, fontSize: 13, color: COLORS.grey },
});

export default ContentSection;

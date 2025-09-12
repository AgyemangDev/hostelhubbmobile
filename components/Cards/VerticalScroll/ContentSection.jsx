// ContentSection.js
import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatsRow from './StatsRow';
import AvailabilityBadge from './AvailabilityBadge';
import COLORS from '../../../constants/Colors';
import { formatViews } from '../../../utils/firebaseUtils';

import {
  getRandomText,
  startTracking,
  getViewCount,
  subscribe,
  unsubscribe,
} from '../../../utils/viewTracker';

const ContentSection = ({ hostelName, institution, location, reviewText, views, availability }) => {
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
  }, [hostelName, views]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{hostelName}</Text>
        <AvailabilityBadge availability={availability} />
      </View>
      <View style={styles.locationRow}>
        <MaterialCommunityIcons name="map-marker-outline" size={16} color={COLORS.grey} />
        <Text style={styles.location} numberOfLines={1}>
          {institution} · {location}
        </Text>
        <View style={styles.reviewContainer}>
          {/* Display review text and a review icon */}
          {reviewText && (
            <View style={styles.reviewRow}>
               <MaterialCommunityIcons 
                name="star-outline" 
                size={16} 
                color={COLORS.yellow} 
              />
              <Text style={styles.reviewText}>{reviewText}</Text>
             
            </View>
          )}
        </View>
      </View>
      {/* Pass both views and viewText to StatsRow */}
      <StatsRow views={formatViews(viewCount)} viewText={viewText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    justifyContent: 'space-between', // To space out the location and review container
  },
  location: {
    marginLeft: 4,
    fontSize: 13,
    color: COLORS.grey,
    flex: 1, // Allows the location text to take up available space
  },
  reviewContainer: {
    flexDirection: 'row', // Align review text and icon in a row
    alignItems: 'center', // Center vertically
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    marginLeft: 2, 
    fontSize: 13,
    color: COLORS.grey,
  },
});

export default ContentSection;

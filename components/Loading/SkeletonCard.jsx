import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SkeletonCards = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const skeletonCard = () => (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      {/* Image Placeholder */}
      <View style={styles.imagePlaceholder} />

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.titlePlaceholder} />
        <View style={styles.locationPlaceholder} />
        <View style={styles.reviewsPlaceholder} />

        <View style={styles.footerRow}>
          <View style={styles.pricePlaceholder} />
          <View style={styles.ratingCircle} />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.wrapper}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} style={styles.cardSpacing}>
          {skeletonCard()}
        </View>
      ))}
    </View>
  );
};

export default SkeletonCards;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  cardSpacing: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  imagePlaceholder: {
    height: 180,
    backgroundColor: '#e0e0e0',
  },
  content: {
    padding: 12,
  },
  titlePlaceholder: {
    width: '70%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 8,
  },
  locationPlaceholder: {
    width: '50%',
    height: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 8,
  },
  reviewsPlaceholder: {
    width: '40%',
    height: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricePlaceholder: {
    width: 90,
    height: 25,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  ratingCircle: {
    width: 28,
    height: 28,
    backgroundColor: '#e0e0e0',
    borderRadius: 14,
  },
});

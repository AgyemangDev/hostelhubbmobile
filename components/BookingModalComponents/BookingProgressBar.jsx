import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import COLORS from '../../constants/Colors';

const BookingProgressBar = ({ step }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressPercentage = (step / 2) * 100;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [step, progressPercentage]);

  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      
      <View style={styles.progressBarBackground}>
        <Animated.View 
          style={[
            styles.progressBarFill, 
            { width: animatedWidth }
          ]} 
        />
      </View>
    </View>
  );
};

export default BookingProgressBar;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.button,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: COLORS.button,
    borderRadius: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    backgroundColor: COLORS.button,
    borderColor: COLORS.button,
  },
  currentDot: {
    backgroundColor: COLORS.button,
    borderColor: COLORS.button,
    transform: [{ scale: 1.1 }],
  },
  dotText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  activeDotText: {
    color: '#fff',
  },
});
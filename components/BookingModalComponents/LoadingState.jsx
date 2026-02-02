import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';

const LoadingState = ({ message = 'Processing...' }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Icon */}
        <View style={styles.iconWrapper}>
          <Ionicons name="calendar-outline" size={40} color={COLORS.primary} />
        </View>

        {/* Spinner */}
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />

        {/* Message */}
        <Text style={styles.loadingText}>{message}</Text>
        <Text style={styles.subText}>This won't take long</Text>

        {/* Animated dots */}
        <View style={styles.dotsContainer}>
          <AnimatedDot delay={0} />
          <AnimatedDot delay={200} />
          <AnimatedDot delay={400} />
        </View>
      </Animated.View>
    </View>
  );
};

const AnimatedDot = ({ delay }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[styles.dot, { opacity }]} />;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f8f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  spinner: {
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  subText: {
    marginTop: 6,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});

export default LoadingState;
// components/BookingButton.jsx
import React, { useCallback, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BookingButton = ({ onPress, disabled = false }) => {
  // Animated value
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      damping: 15,
      stiffness: 200,
      mass: 0.6,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        stiffness: 200,
        mass: 0.6,
      }).start();
    });

    onPress?.();
  }, [onPress]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabled]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.85}
      >
        <MaterialIcons
          name="event-available"
          size={20}
          color="white"
        />
        <Text style={styles.buttonText}>Reserve Now</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#cc2020ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabled: {
    backgroundColor: '#999',
    shadowColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default BookingButton;
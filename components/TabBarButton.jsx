import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { icons } from '../assets/icons';

const TabBarButton = (props) => {
  const { isFocused, label, routeName, color } = props;

  // Animated value (0 = unfocused, 1 = focused)
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
      mass: 0.8,
    }).start();
  }, [isFocused]);

  // Icon animation
  const iconStyle = {
    transform: [
      {
        scale: scaleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.01],
        }),
      },
    ],
    top: scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5],
    }),
  };

  // Text animation
  const textStyle = {
    opacity: scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={iconStyle}>
        {icons[routeName]({ color })}
      </Animated.View>

      <Animated.Text
        style={[
          {
            color,
            fontSize: 11,
          },
          textStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});

export default TabBarButton;
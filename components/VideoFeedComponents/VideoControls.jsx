import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const VideoControls = ({ isPlaying }) => {
  const iconOpacity = useSharedValue(0); // Used only to fade out
  const iconScale = useSharedValue(0.5);

  useEffect(() => {
    if (!isPlaying) {
      // Instantly show icon, animate scale only
      iconOpacity.value = 1;
      iconScale.value = withTiming(1, {
        duration: 150, // Quick scale up
        easing: Easing.out(Easing.ease),
      });
    } else {
      // Animate fade out and scale down
      iconOpacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
      iconScale.value = withTiming(0.5, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <Animated.View style={[styles.overlay, animatedStyle]}>
      <Ionicons name="play" size={64} color="rgba(255,255,255,0.8)" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 180,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', // Ensure it doesn't block touches
  },
});

export default VideoControls;

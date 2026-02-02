import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VideoControls = ({ isPlaying }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!isPlaying) {
      // Instantly show, then scale up
      opacityAnim.setValue(1);

      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Animated.Easing.out(Animated.Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out + scale down
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          easing: Animated.Easing.out(Animated.Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.5,
          duration: 200,
          easing: Animated.Easing.out(Animated.Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isPlaying]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.overlay,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Ionicons
        name="play"
        size={64}
        color="rgba(255,255,255,0.8)"
      />
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
  },
});

export default VideoControls;
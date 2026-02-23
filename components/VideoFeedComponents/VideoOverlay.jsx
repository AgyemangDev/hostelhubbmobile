// components/video/VideoOverlay.jsx - Updated with proper positioning
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoOverlay = ({ children }) => {
  return (
    <>
      {/* Gradient for better text readability */}
      <View style={styles.gradientOverlay} />
      
      {/* Bottom Info Overlay */}
      <View style={styles.bottomOverlay}>
        {children}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    // For React Native, we'll use a View with backgroundColor gradient effect
    // You might want to use react-native-linear-gradient for better gradient support
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 50, // Adjusted to account for potential home indicator
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
});

export default VideoOverlay;
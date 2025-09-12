import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, StyleSheet, Dimensions } from 'react-native';

const HostelImage = ({ source }) => {
  const [loading, setLoading] = useState(true);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-Dimensions.get('window').width, Dimensions.get('window').width],
  });

  return (
    <View style={styles.container}>
      {loading && (
        <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]} />
      )}
      <Image
        source={typeof source === 'string' ? { uri: source } : source}
        style={styles.image}
        resizeMode="cover"
        onLoad={() => setLoading(false)} // Show image as soon as it starts rendering
        onError={() => setLoading(false)} // Hide shimmer if image fails
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#e0e0e0' },
  image: { width: '100%', height: '100%' },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
    opacity: 0.5,
  },
});

export default HostelImage;

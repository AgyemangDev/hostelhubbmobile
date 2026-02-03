import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.7; // 70% of screen

const ShimmerCard = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2500, // Slower animation (2.5 seconds)
        easing: Easing.ease,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-CARD_WIDTH, CARD_WIDTH * 1.5],
  });

  // Create a gradient-like effect with multiple color stops
  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [0, 0.1, 0.3, 0.5, 0.3, 0],
  });

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>

        
        
        {/* Card Footer */}
          <View style={styles.footerButton} />

        {/* Shimmer overlay */}
        <Animated.View 
          style={[
            styles.shimmer, 
            { 
              transform: [{ translateX }],
              opacity: shimmerOpacity
            }
          ]} 
        />
      </View>
    </View>
  );
};

const EmptyHostelShimmer = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.wrapper}
      >
        {[...Array(5)].map((_, index) => (
          <ShimmerCard key={index} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 16,
    color: '#555',
  },
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cardContainer: {
    shadowRadius: 8,
    elevation: 5,
    marginRight: 16,
    borderRadius: 16,
  },
  card: {
    width: 300,
    height: 230,
    borderRadius: 16,
    backgroundColor: '#e6e9ec',
    overflow: 'hidden',
    padding: 16,
  },
  footerButton: {
    height: 100,
    width: '100%',
    backgroundColor: '#d1d5db',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 'auto',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    width: '100%',
    transform: [{ skewX: '-20deg' }],
  },
});

export default EmptyHostelShimmer;
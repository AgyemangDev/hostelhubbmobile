import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const EmptyCart = () => {
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Float animation for the cart icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Scale in animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartShopping = () => {
    router.push('/(shop)');
  };
  return (
    <View style={styles.container}>
      {/* Background decoration */}
      <View style={styles.backgroundDecoration}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
      </View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Animated Cart Icon */}
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              transform: [
                {
                  translateY: floatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.cartIconWrapper}>
            <Ionicons name="bag-handle-outline" size={60} color="#007AFF" />
            {/* Floating dots */}
            <View style={styles.floatingDot1} />
            <View style={styles.floatingDot2} />
            <View style={styles.floatingDot3} />
          </View>
        </Animated.View>

        {/* Title and Description */}
        <View style={styles.textContent}>
          <Text style={styles.title}>Your cart is empty</Text>
          <Text style={styles.subtitle}>
            Looks like you haven't added anything to your cart yet
          </Text>
          <Text style={styles.description}>
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleStartShopping}
            activeOpacity={0.8}
          >
            <Ionicons name="storefront" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>

        {/* Feature highlights */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="flash" size={16} color="#ff6b6b" />
            <Text style={styles.featureText}>Fast Delivery</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={16} color="#4ecdc4" />
            <Text style={styles.featureText}>Secure Shopping</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="return-up-back" size={16} color="#45b7d1" />
            <Text style={styles.featureText}>Easy Returns</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default EmptyCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle1: {
    position: 'absolute',
    top: 100,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  circle2: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
  },
  circle3: {
    position: 'absolute',
    top: 200,
    left: 50,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(78, 205, 196, 0.05)',
  },
  content: {
    alignItems: 'center',
    maxWidth: width * 0.85,
  },
  iconContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  cartIconWrapper: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  floatingDot1: {
    position: 'absolute',
    top: 20,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b6b',
    opacity: 0.7,
  },
  floatingDot2: {
    position: 'absolute',
    bottom: 25,
    left: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ecdc4',
    opacity: 0.8,
  },
  floatingDot3: {
    position: 'absolute',
    top: 15,
    left: 25,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#45b7d1',
    opacity: 0.6,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  actionButtons: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: 200,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    minWidth: 180,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 11,
    color: '#6c757d',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
});
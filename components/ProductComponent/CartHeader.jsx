import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useCart } from '../../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CartHeader = () => {
  const { cartCount } = useCart();
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (cartCount > 0) {
      // Bounce animation when cart count changes
      Animated.sequence([
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation for attention
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [cartCount]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => router.push('/Checkout')}
    >
      <Animated.View style={[styles.cartButton, { transform: [{ scale: pulseAnim }] }]}>
        {/* Gradient background effect */}
        <View style={styles.gradientOverlay} />
        
        {/* Main cart icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="bag-handle-outline" size={22} color="#1a1a1a" />
        </View>

        {/* Cart count badge */}
        {cartCount > 0 && (
          <Animated.View 
            style={[
              styles.badge, 
              { 
                transform: [
                  { scale: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3]
                  }) }
                ] 
              }
            ]}
          >
            <View style={styles.badgeInner}>
              <Text style={styles.badgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
            
            {/* Ripple effect for new items */}
            <View style={styles.ripple} />
          </Animated.View>
        )}
      </Animated.View>

      {/* Floating indicator dot */}
      {cartCount > 0 && (
        <View style={styles.indicator}>
          <View style={styles.indicatorDot} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartHeader;

const styles = StyleSheet.create({
  container: {
    
  },
  cartButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    backdropFilter: 'blur(20px)',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 100%)',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 10,
  },
  badgeInner: {
    backgroundColor: '#ff4757',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ripple: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 71, 87, 0.3)',
    opacity: 0.6,
  },
  indicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    backgroundColor: '#2ecc71',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
});
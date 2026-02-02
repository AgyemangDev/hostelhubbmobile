import React, { useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../../context/UserContext';

const DepositButton = () => {
  const { userInfo } = useContext(UserContext);
  const balance = userInfo?.balance || 0.00;
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: 300,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.bubble,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.bubbleText}>💵 Tap to deposit</Text>
        <View style={styles.bubbleTail} />
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          style={styles.button}
          onPress={() => router.push('/transactions')}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>💰</Text>
          </View>
          <Text style={styles.balance}>GHC {balance.toFixed(2)}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default DepositButton;

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 100,
    right: 20,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingLeft: 6,
    paddingRight: 16,
    height: 52,
    borderRadius: 999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  icon: {
    fontSize: 20,
  },

  balance: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  bubble: {
    position: 'absolute',
    top: -42,
    left: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  bubbleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  bubbleTail: {
    position: 'absolute',
    bottom: -5,
    left: 18,
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
  },
});
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';
import Button from '../ButtonComponents/ButtonComponent';

const StepBookingSuccessScreen = ({ hostelName, onDone }) => {
  const animationRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const playAnimation = () => {
      if (animationRef.current && isMounted) {
        animationRef.current.reset();
        animationRef.current.play();
      }
    };

    playAnimation();
    const interval = setInterval(playAnimation, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Success Animation */}
      <LottieView
        ref={animationRef}
        source={require('../../assets/icons/accommodation_success.json')}
        autoPlay={false}
        loop={false}
        style={styles.animation}
      />

      {/* Title */}
      <Text style={styles.title}>Booking Submitted Successfully! 🎉</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Your reservation at{' '}
        <Text style={styles.hostelName}>{hostelName}</Text> has been submitted.
      </Text>

      {/* Next Steps */}
      <View style={styles.nextStepsCard}>
        <Text style={styles.cardTitle}>What's Next?</Text>
        <Text style={styles.nextStepsText}>
          The hostel manager has been notified and will review your booking. 
          You'll be notified once approved. After approval, secure your bedspace 
          by making payment through HostelHubb.
        </Text>
      </View>

      {/* Featured Services */}
      <View style={styles.servicesContainer}>
        <Text style={styles.servicesTitle}>
          ⭐ Most Loved by Students
        </Text>

        {/* Transport Service */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceIconContainer}>
            <Ionicons name="bus" size={28} color="#fff" />
          </View>
          <View style={styles.serviceContent}>
            <Text style={styles.serviceTitle}>Transport Service</Text>
            <Text style={styles.serviceDescription}>
              Affordable transport back to school during resumption. 
              Safe, reliable, and stress-free travel with fellow students.
            </Text>
            <View style={styles.badge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.badgeText}>Most Popular</Text>
            </View>
          </View>
        </View>

        {/* Storage Service */}
        <View style={styles.serviceCard}>
          <View style={[styles.serviceIconContainer, styles.storageIcon]}>
            <MaterialCommunityIcons name="package-variant-closed" size={28} color="#fff" />
          </View>
          <View style={styles.serviceContent}>
            <Text style={styles.serviceTitle}>Secure Storage</Text>
            <Text style={styles.serviceDescription}>
              Store your belongings safely during vacation. No need to haul 
              everything home - we keep it secure until you return!
            </Text>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={12} color="#4CAF50" />
              <Text style={styles.badgeText}>Trusted & Safe</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Done Button */}
      <Button
        buttonText="View my Bookings"
        onPressFunction={onDone}
        customStyle={styles.doneButton}
      />
    </ScrollView>
  );
};

export default StepBookingSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  animation: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  hostelName: {
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Next Steps Card
  nextStepsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  nextStepsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // Services Section
  servicesContainer: {
    width: '100%',
    marginTop: 28,
  },
  servicesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  storageIcon: {
    backgroundColor: '#FF6B6B',
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },

  // Support Card
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
    width: '100%',
    gap: 10,
  },
  supportText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },
  supportBold: {
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Done Button
  doneButton: {
    marginTop: 28,
    width: '100%',
  },
});
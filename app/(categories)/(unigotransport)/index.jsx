import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Dimensions,
  Modal
} from 'react-native';
import COLORS from "../../../constants/Colors"
import Button from "../../../components/ButtonComponents/ButtonComponent";
import { useRouter } from 'expo-router';
import { UserContext } from '../../../context/UserContext';
import { auth } from '../../firebase/FirebaseConfig';
import ClientLogIn from "../../(Client)/ClientLogIn";

const { width, height } = Dimensions.get('window');

const TransportLanding = () => {

    const router = useRouter();

  const [showAuth, setShowAuth] = useState(false);

  const { userInfo } = useContext(UserContext);
  const user = auth.currentUser;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const features = [
    { icon: '🚌', title: 'Safe Travel', desc: 'Verified drivers and secure routes' },
    { icon: '💰', title: 'Affordable', desc: 'Cheapest Student-friendly pricing' },
    { icon: '📍', title: 'Real-time Tracking', desc: 'Know exactly when your ride arrives' },
    { icon: '⚡', title: 'Quick Booking', desc: 'Reserve your seat in seconds' },
  ];

  const handleBookBus = () => {
  if (!user) {
    setShowAuth(true);
    return;
  }

  router.push('/(categories)/(unigotransport)/BusSelection');
};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* Hero Section */}
      <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Your Journey{'\n'}
            <Text style={styles.heroTitleAccent}>Starts Here</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Seamless transport for students traveling home and returning for the new semester
          </Text>

          {/* CTA Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
 <Button
  buttonText="Book A Bus Now"
  onPressFunction={handleBookBus}
  variant="default"
/>
          </Animated.View>
        </View>

        {/* Decorative Circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
      </Animated.View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <Text style={styles.sectionSubtitle}>Everything you need for a comfortable journey</Text>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 50], outputRange: [0, 50 + index * 10] }) }],
                },
              ]}
            >
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </Animated.View>
          ))}
        </View>
      </View>
      <Modal
  visible={showAuth}
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={() => setShowAuth(false)}
>
  <ClientLogIn onClose={() => setShowAuth(false)} />
</Modal>
    </ScrollView>
  );
};

export default TransportLanding;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingBottom: 40 },

  // Hero
  hero: {
    minHeight: height * 0.7, // slightly smaller to reduce spacing
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  heroContent: { zIndex: 2 },
  heroTitle: { fontSize: 44, fontWeight: '800', color: COLORS.textDark, marginBottom: 12, lineHeight: 52 }, // reduced mb
  heroTitleAccent: { color: COLORS.button },
  heroSubtitle: { fontSize: 17, color: COLORS.textMuted, lineHeight: 26, marginBottom: 16 }, // reduced mb

  // Decorative Circles
  decorCircle1: { position: 'absolute', top: 100, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: COLORS.placeholder, opacity: 0.1 },
  decorCircle2: { position: 'absolute', bottom: 50, left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: COLORS.primary, opacity: 0.05 },

  // Features Section
  featuresSection: { paddingHorizontal: 24,marginTop:-250},
  sectionTitle: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, marginBottom: 6, textAlign: 'center' }, // reduced mb
  sectionSubtitle: { fontSize: 16, textAlign: 'center', marginBottom: 24 }, // reduced mb
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureCard: {
    width: (width - 50) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  featureIconContainer: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#FFF5F5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  featureIcon: { fontSize: 28 },
  featureTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
  featureDesc: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },
});
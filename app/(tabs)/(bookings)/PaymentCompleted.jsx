import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";
import Button from "../../../components/ButtonComponents/ButtonComponent";
import { useRouter } from "expo-router";

const PaymentCompleted = () => {
  const animationRef = useRef(null);

  const router = useRouter()

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
        source={require("../../../assets/icons/accommodation_success.json")}
        autoPlay={false}
        loop={false}
        style={styles.animation}
      />

      {/* Success Message */}
      <View style={styles.successSection}>
        <Text style={styles.title}>Payment Completed! 🎉</Text>
        <Text style={styles.subtitle}>
          Your accommodation payment has been processed successfully.
        </Text>
      </View>

      {/* What Happens Next */}
      <View style={styles.infoCard}>
        <View style={styles.iconHeader}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
          <Text style={styles.cardTitle}>What Happens Next</Text>
        </View>
        <View style={styles.infoContent}>
          <InfoItem
            icon="mail"
            text="Payment confirmation receipt sent to your email"
          />
          <InfoItem
            icon="call"
            text="HostelHubb will send you your hostel receipt with your room number."
          />
        </View>
      </View>

      {/* Transport Service Ad */}
      <View style={styles.transportSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bus" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Need Transport Back to School?</Text>
        </View>
        
        <View style={styles.transportCard}>
          <View style={styles.transportIconContainer}>
            <Ionicons name="bus" size={32} color="#fff" />
          </View>
          
          <View style={styles.transportContent}>
            <Text style={styles.transportTitle}>
              Book Your Bus Ride
            </Text>
            <Text style={styles.transportDescription}>
              Don't stress at the station or worry about scams. Book a safe, 
              affordable bus directly to campus.
            </Text>
            
            <View style={styles.benefitsContainer}>
              <Benefit icon="shield-checkmark" text="Safe & Verified" />
              <Benefit icon="cash" text="Affordable Rates" />
              <Benefit icon="time" text="Convenient Times" />
            </View>
            
            <View style={styles.badge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.badgeText}>Most Popular Service</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <Button
        buttonText="Go home"
        onPressFunction={()=> router.replace("(tabs)/(index)")}
        customStyle={styles.doneButton}
      />
    </ScrollView>
  );
};

// Helper Components
const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={16} color={COLORS.primary} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const Benefit = ({ icon, text }) => (
  <View style={styles.benefit}>
    <Ionicons name={icon} size={14} color={COLORS.primary} />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

export default PaymentCompleted;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  animation: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  
  // Success Section
  successSection: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  infoContent: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#555",
    flex: 1,
  },

  // Transport Section
  transportSection: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  transportCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  transportIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  transportContent: {
    alignItems: "center",
  },
  transportTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  transportDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  benefitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  benefit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B8860B",
  },

  // Button
  doneButton: {
    width: "100%",
  },
});
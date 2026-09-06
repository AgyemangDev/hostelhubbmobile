import {
  View,
  Text,
  Modal,
  ScrollView,
  ImageBackground,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import styles from "./Styles/Styles";
import Button from "../../components/ButtonComponents/ButtonComponent";
import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { auth } from "../firebase/FirebaseConfig";
import ClientLogIn from "../(Client)/ClientLogIn";
import BookingsClosedModal from "../../components/Storage/BookingsClosedModal";

const STEPS = [
  {
    icon: "cube-outline",
    number: "01",
    title: "Choose Items",
    desc: "Pick what you'd like stored over the break.",
  },
  {
    icon: "calendar-outline",
    number: "02",
    title: "Schedule Pickup",
    desc: "Choose a pickup and return time that works for you.",
  },
  {
    icon: "checkmark-circle-outline",
    number: "03",
    title: "Confirm & Relax",
    desc: "We deliver it back when school resumes.",
  },
];

const GUARANTEES = [
  { icon: "shield-checkmark-outline", text: "100% Insured" },
  { icon: "car-outline", text: "Free Pickup & Delivery" },
  { icon: "pricetag-outline", text: "Best Prices" },
];

export default function Index() {
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const { userInfo, refreshUserInfo } = useContext(UserContext);
  const [showClosedModal, setShowClosedModal] = useState(false);

  const user = auth.currentUser;


  // const handleReservePress = () => {
  //   if (!user) {
  //     setShowAuth(true);
  //     return;
  //   }
  //   router.push("ItemsSelection");
  // };


  //Storage closed modal state
    const handleReservePress = () => {
    setShowClosedModal(true);
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <ImageBackground
          source={{
            uri: "https://image.freepik.com/free-photo/surface-image-green-self-storage-facility-with-opened-unit-door-cardboard-boxes-copy-space_236854-24686.jpg",
          }}
          style={styles.heroBackground}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <View style={s.taglineRow}>
                <Ionicons name="lock-closed" size={13} color="#fff" />
                <Text style={[styles.tagline, s.taglineText]}>
                  HOSTELHUBB STORAGE SOLUTIONS
                </Text>
              </View>
              <Text style={styles.heroTitle}>
                Secure Space for Your Valuables
              </Text>
              <Text style={styles.heroDescription}>
                100% insured, with free pickup and delivery to your next hostel.
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* Intro Section */}
        <View style={styles.introSection}>
          <View style={styles.statsContainer}>
            <View style={s.statItem}>
              <Feather name="package" size={16} color="#0f766e" style={s.statIcon} />
              <Text style={styles.statNumber}>10,000+</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={s.statItem}>
              <Feather name="smile" size={16} color="#0f766e" style={s.statIcon} />
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={s.statItem}>
              <Feather name="headphones" size={16} color="#0f766e" style={s.statIcon} />
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Support</Text>
            </View>
          </View>
        </View>

        {/* How it Works */}
        <View style={styles.howItWorksSection}>
          <View style={styles.ctaButtonsContainer}>
            <Button
              buttonText="Reserve Storage Now"
              onPressFunction={handleReservePress}
              customStyle={styles.primaryButton}
            />
          </View>

          <Text style={styles.sectionTitle}>How Reservation Works</Text>
          <View style={styles.stepsContainer}>
            {STEPS.map((item, index) => (
              <View key={index} style={[styles.stepCard, s.stepCard]}>
                <View style={s.stepIconCircle}>
                  <Ionicons name={item.icon} size={18} color="#0f766e" />
                </View>
                <View style={styles.stepContent}>
                  <View style={s.stepTitleRow}>
                    <Text style={s.stepNumberSmall}>{item.number}</Text>
                    <Text style={styles.stepTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.stepDescription}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <View style={styles.guaranteeSection}>
            <View style={styles.guaranteeItems}>
              {GUARANTEES.map((item, index) => (
                <View key={index} style={styles.guaranteeItem}>
                  <View style={s.guaranteeIconCircle}>
                    <Ionicons name={item.icon} size={18} color="#0f766e" />
                  </View>
                  <Text style={styles.guaranteeText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* CTA Text */}
        <Text style={styles.ctaTitle}>Ready to Secure Your Space?</Text>
        <Text style={styles.ctaDescription}>
          Book your storage unit today for peace of mind.
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.ctaButtonsContainer}>
            <Button
              buttonText="Reserve Storage Now"
              onPressFunction={handleReservePress}
              customStyle={styles.primaryButton}
            />
          </View>

          <Text style={styles.footerText}>
            © {new Date().getFullYear()} HostelHubb Storage Reservation
          </Text>
          <View style={s.footerSubtextRow}>
            <Ionicons name="shield-checkmark-outline" size={12} color="#9ca3af" />
            <Text style={styles.footerSubtext}>Secure</Text>
            <Text style={styles.footerSubtext}>·</Text>
            <Ionicons name="navigate-outline" size={12} color="#9ca3af" />
            <Text style={styles.footerSubtext}>Accessible</Text>
            <Text style={styles.footerSubtext}>·</Text>
            <Ionicons name="checkmark-done-outline" size={12} color="#9ca3af" />
            <Text style={styles.footerSubtext}>Reliable</Text>
          </View>
        </View>
      </ScrollView>

      <BookingsClosedModal
        visible={showClosedModal}
        onClose={() => setShowClosedModal(false)}
      />

      <Modal
        visible={showAuth}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAuth(false)}
      >
        <ClientLogIn onClose={() => setShowAuth(false)} />
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  taglineText: {
    marginBottom: 0,
  },
  statItem: {
    alignItems: "center",
    gap: 2,
  },
  statIcon: {
    marginBottom: 2,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0fdfa",
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepNumberSmall: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f766e",
  },
  guaranteeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0fdfa",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  footerSubtextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 4,
  },
});
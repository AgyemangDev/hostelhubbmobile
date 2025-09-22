"use client";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "./Styles/Styles";

const { width } = Dimensions.get("window");

export default function index() {
  const router = useRouter();

  const handleReservePress = () => {
    // Navigate to StoreForm
    router.push("StoreForm");

    // Or show alert (comment out the other line above)
    // Alert.alert(
    //   "Booking Closed",
    //   "Booking has been closed for this semester. Thank you for trusting Hostelhubb Storage Facility.",
    //   [{ text: "OK" }]
    // );
  }
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
              <Text style={styles.tagline}>HOSTELHUBB STORAGE SOLUTIONS</Text>
              <Text style={styles.heroTitle}>
                Secure Space for Your Valuables
              </Text>
              <Text style={styles.heroDescription}>
Secure your belongings with confidence — 100% insured, free pickup and delivery right to your next hostel.
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* Intro Section */}
        <View style={styles.introSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2000+</Text>
              <Text style={styles.statLabel}>Items Stored</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>99.9%</Text>
              <Text style={styles.statLabel}>Student Satisfaction</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Access & Support</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.ctaSection}>
          <View style={styles.ctaButtonsContainer}>
            <TouchableOpacity
             onPress={handleReservePress}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Reserve Storage Now</Text>
            </TouchableOpacity>
          </View>
          
          {/* Guarantee Section - Added right below the button */}
          <View style={styles.guaranteeSection}>
            <Text style={styles.guaranteeTitle}>Our Promise to You</Text>
            <View style={styles.guaranteeItems}>
              <View style={styles.guaranteeItem}>
                <Text style={styles.guaranteeEmoji}>🛡️</Text>
                <Text style={styles.guaranteeText}>100% Security & Insurance Guarantee</Text>
              </View>
              <View style={styles.guaranteeItem}>
                <Text style={styles.guaranteeEmoji}>📦</Text>
                <Text style={styles.guaranteeText}>Free Pickup From Your Hostel</Text>
              </View>
              <View style={styles.guaranteeItem}>
                <Text style={styles.guaranteeEmoji}>🚚</Text>
                <Text style={styles.guaranteeText}>Delivery to Your Next Hostel</Text>
              </View>
              <View style={styles.guaranteeItem}>
                <Text style={styles.guaranteeEmoji}>💰</Text>
                <Text style={styles.guaranteeText}>Best Affordable Prices</Text>
              </View>
            </View>
            <Text style={styles.guaranteeSubtext}>
              No extra costs • No hidden fees • Complete peace of mind
            </Text>
          </View>
        </View>

        <Text style={styles.ctaTitle}>Ready to Secure Your Space?</Text>
        <Text style={styles.ctaDescription}>
          Book your storage unit today and enjoy peace of mind knowing your
          belongings are safe and accessible.
        </Text>

        {/* How it Works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How Reservation Works</Text>
          <View style={styles.stepsContainer}>
            {[
              {
                number: "01",
                title: "Enter Your Details",
                desc: "Provide your name, contact info and email.",
              },
              {
                number: "02",
                title: "Schedule Pickup & Delivery",
                desc: "Select convenient dates and times for both pickup and return.",
              },
              {
                number: "03",
                title: "Choose Items to Store",
                desc: "List or select items you'd like us to safely store over the break.",
              },
              {
                number: "04",
                title: "Confirm & Relax",
                desc: "Our team will pick up your items and deliver them when school resumes.",
              },
            ].map((item, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{item.number}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepDescription}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>


        {/* Footer */}
        <View style={styles.footer}>
                    <View style={styles.ctaButtonsContainer}>
            <TouchableOpacity
             onPress={handleReservePress}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Reserve Storage Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.footerText}>
            © 2025 HostelHubb Storage Reservation
          </Text>
          <Text style={styles.footerSubtext}>
            Secure • Accessible • Reliable
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
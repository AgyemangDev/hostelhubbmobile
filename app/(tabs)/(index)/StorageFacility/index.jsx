"use client";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Shield, Clock, Key, MapPin } from "lucide-react-native";
import styles from "./Styles/Styles";

const { width } = Dimensions.get("window");

export default function index() {
  const router = useRouter();

  const features = [
    {
      icon: <Shield size={24} color="#0070f3" />,
      title: "24/7 Security",
      description:
        "Advanced surveillance and security systems protect your belongings around the clock",
    },
    {
      icon: <Clock size={24} color="#0070f3" />,
      title: "Flexible Access",
      description:
        "Access your storage unit whenever you need with our convenient digital entry system",
    },
    {
      icon: <Key size={24} color="#0070f3" />,
      title: "Climate Control",
      description:
        "Temperature-regulated units keep your sensitive items in perfect condition",
    },
    {
      icon: <MapPin size={24} color="#0070f3" />,
      title: "Prime Locations",
      description:
        "Strategically located facilities for easy access from anywhere in the city",
    },
  ];

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
              <Text style={styles.tagline}>PREMIUM STORAGE SOLUTIONS</Text>
              <Text style={styles.heroTitle}>
                Secure Space for Your Valuables
              </Text>
              <Text style={styles.heroDescription}>
                State-of-the-art storage facilities designed to keep your
                belongings safe, accessible, and in perfect condition.
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* Intro Section */}
        <View style={styles.introSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>200+</Text>
              <Text style={styles.statLabel}>Items Stored</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>99%</Text>
              <Text style={styles.statLabel}>Student Satisfaction</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Access & Support</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}

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

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Secure Your Space?</Text>
          <Text style={styles.ctaDescription}>
            Book your storage unit today and enjoy peace of mind knowing your
            belongings are safe and accessible.
          </Text>

          <View style={styles.ctaButtonsContainer}>
            <TouchableOpacity
              onPress={() => router.push("StorageForm")}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Reserve Space Now</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => router.push("NotificationScreen")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                View Available Units
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
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

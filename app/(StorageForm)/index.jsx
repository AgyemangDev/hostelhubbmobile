"use client";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "./Styles/Styles";
import Button from "../../components/ButtonComponents/ButtonComponent";

export default function Index() {
  const router = useRouter();

  const handleReservePress = () => {
    router.push("ItemsSelection");
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
              <Text style={styles.tagline}>HOSTELHUBB STORAGE SOLUTIONS</Text>
              <Text style={styles.heroTitle}>
                Secure Space for Your Valuables
              </Text>
              <Text style={styles.heroDescription}>
                Secure your belongings with confidence — 100% insured, free
                pickup and delivery right to your next hostel.
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* Intro Section */}
        <View style={styles.introSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10,000+</Text>
              <Text style={styles.statLabel}>Bookings Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Student Satisfaction</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Support Customer Care</Text>
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
            {[
              {
                number: "01",
                title: "Choose Items to Store",
                desc: "Select items you'd like us to safely store over the break.",
              },
              {
                number: "02",
                title: "Schedule Pickup & Delivery",
                desc: "Select convenient dates and times for both pickup and return.",
              },
              {
                number: "03",
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

          {/* Guarantee Section */}
          <View style={styles.guaranteeSection}>
            <View style={styles.guaranteeItems}>
              <View style={styles.guaranteeItem}>
                <Text style={styles.guaranteeEmoji}>🛡️</Text>
                <Text style={styles.guaranteeText}>
                  100% Security Guarantee
                </Text>
              </View>
              <View style={styles.guaranteeItem}>
                <Text style={styles.guaranteeEmoji}>📦</Text>
                <Text style={styles.guaranteeText}>
                  Free Pickup and Delivery to Your Hostel
                </Text>
              </View>
              <View style={styles.guaranteeItem}>
                <Text style={styles.guaranteeEmoji}>💰</Text>
                <Text style={styles.guaranteeText}>
                  Best Affordable Prices
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA Text */}
        <Text style={styles.ctaTitle}>Ready to Secure Your Space?</Text>
        <Text style={styles.ctaDescription}>
          Book your storage unit today and enjoy peace of mind knowing your
          belongings are safe.
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
          <Text style={styles.footerSubtext}>
            Secure • Accessible • Reliable
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useRef } from "react";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ExternalLink } from "@/components/ExternalLink";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const ContactHostel = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const contactData = [
    {
      name: "Nana Agyemang Gyamfi",
      role: "Backend Developer",
      phone: "0542353326",
      image: require("../../../assets/images/AgyemangDev.jpg"),
    },
    {
      name: "Kello Derrick Junior",
      role: "Frontend Developer",
      phone: "0538859040",
      image: require("../../../assets/images/1.jpg"),
    },
  ];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const features = [
    {
      icon: "shield-checkmark",
      title: "Secure Booking System",
      description: "Advanced encryption and secure payment gateways protect your personal and financial information during every transaction."
    },
    {
      icon: "home",
      title: "Verified Accommodations",
      description: "Every hostel and accommodation listed on our platform undergoes rigorous verification to ensure quality, safety, and authenticity."
    },
    {
      icon: "cube",
      title: "Storage Solutions",
      description: "Safe and secure storage facilities for your belongings during school breaks, holidays, and semester transitions."
    },
    {
      icon: "notifications",
      title: "Real-time Updates",
      description: "Instant notifications about booking confirmations, payment status, accommodation updates, and important announcements."
    }
  ];

  return (
    <View style={styles.mainContainer}>
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={["#c62828", "#8e0000"]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.heroTitle}>HostelHubb</Text>
            <Text style={styles.heroSubtitle}>Revolutionizing Student Accommodation</Text>
          </LinearGradient>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About HostelHubb</Text>
          <Text style={styles.infoText}>
            HostelHubb was established with the sole aim of making campus life easier for students across Ghana and beyond. What started as a simple vision to eliminate the hassle and uncertainty that surrounds hostel search and accommodation booking in universities has evolved into a comprehensive platform that serves thousands of students nationwide.
          </Text>
          <Text style={styles.infoText}>
            Today, we are a fully registered business under the Ghana Revenue Authority, operating with complete transparency and accountability. Our dedicated team works tirelessly every day to provide a seamless, transparent, and secure student accommodation experience that you can trust.
          </Text>
          <Text style={styles.infoText}>
            Through our innovative platform, you can securely book verified hostels and accommodations, access reliable storage solutions for your personal items during school breaks, receive real-time updates and notifications, and get comprehensive support directly from your mobile device. Our mission extends beyond simple booking - we're committed to making the entire student accommodation journey stress-free and giving students the peace of mind they deserve.
          </Text>
        </View>

        {/* Our Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.infoText}>
            To transform the student accommodation experience in Ghana by providing a reliable, transparent, and user-friendly platform that connects students with verified, quality accommodation options while ensuring their safety, security, and satisfaction throughout their academic journey.
          </Text>
        </View>

        {/* Our Vision Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Vision</Text>
          <Text style={styles.infoText}>
            To become the leading student accommodation platform in West Africa, known for innovation, reliability, and exceptional service. We envision a future where every student can easily find safe, affordable, and comfortable accommodation without stress or uncertainty.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose HostelHubb?</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name={feature.icon} size={24} color="#c62828" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Commitment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Commitment to Excellence</Text>
          <Text style={styles.infoText}>
            We understand that finding the right accommodation is crucial to your academic success and personal well-being. That's why we've built HostelHubb on the foundation of trust, reliability, and exceptional customer service.
          </Text>
          <Text style={styles.infoText}>
            Every accommodation partner in our network is carefully vetted and regularly monitored to ensure they meet our high standards for safety, cleanliness, and student satisfaction. We maintain strict quality control measures and conduct regular inspections to guarantee that what you see is exactly what you get.
          </Text>
          <Text style={styles.infoText}>
            Our customer-first approach means that your needs and concerns are always our top priority. Whether you need assistance with booking, have questions about an accommodation, or require support during your stay, our dedicated support team is available around the clock to help you.
          </Text>
        </View>

        {/* Team Section - Commented Out */}
        {/* 
        <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Our Team</Text>

        {contactData.map((contact, index) => (
          <Animated.View
            key={index}
            style={styles.cardContainer}
            entering={Animated.timing({
              duration: 400,
              delay: index * 200,
            })}
          >
            <View style={styles.cardContent}>
              <View style={styles.imageWrapper}>
                <Image source={contact.image} style={styles.imageStyle} />
                <View style={styles.imageBorder} />
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.nameText}>{contact.name}</Text>
                <View style={styles.roleContainer}>
                  <FontAwesome5 name="laptop-code" size={14} color="#555" />
                  <Text style={styles.roleText}>{contact.role}</Text>
                </View>
                <Text style={styles.subText}>
                  Feel free to reach out anytime
                </Text>
              </View>

              <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => {
                    animateButton();
                    handleCall(contact.phone);
                  }}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#c62828", "#8e0000"]}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="call" size={22} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        ))}
        */}

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Need Immediate Assistance?</Text>
          <Text style={styles.infoText}>
            Our professional customer service team and advanced AI assistants are available 24/7 to provide you with immediate support and assistance. Whether you have questions about bookings, need technical support, or require help with any aspect of our platform, we're here to help you every step of the way.
          </Text>
          <Text style={styles.infoText}>
            Don't let accommodation concerns hold you back from focusing on your studies. Reach out to us anytime, and experience the difference that dedicated, professional support can make.
          </Text>

          <ExternalLink href="https://tawk.to/chat/671fd5354304e3196ad9a21d/1iba5hmlc">
            <LinearGradient
              colors={["#c62828", "#8e0000"]}
              style={styles.supportButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="support-agent" size={24} color="#fff" />
              <Text style={styles.supportButtonText}>
                Connect with Customer Support
              </Text>
            </LinearGradient>
          </ExternalLink>
        </View>

        {/* Contact Information */}
        <View style={styles.contactInfoSection}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={styles.infoText}>
            We value your feedback and are always looking for ways to improve our services. If you have suggestions, concerns, or just want to share your HostelHubb experience, we'd love to hear from you.
          </Text>
          <View style={styles.contactMethodsContainer}>
            <View style={styles.contactMethod}>
              <Ionicons name="mail" size={20} color="#c62828" />
              <Text style={styles.contactMethodText}>hostelhubbofficial@gmail.com</Text>
            </View>
            <View style={styles.contactMethod}>
              <Ionicons name="time" size={20} color="#c62828" />
              <Text style={styles.contactMethodText}>24/7 Customer Support</Text>
            </View>
            <View style={styles.contactMethod}>
              <Ionicons name="location" size={20} color="#c62828" />
              <Text style={styles.contactMethodText}>Kumasi, Ghana</Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ContactHostel;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  heroSection: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 20,
    marginTop: 60,
  },
  heroGradient: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
    fontWeight: "500",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 25,
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 15,
    textAlign: "justify",
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  featureIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#c62828",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 15,
    color: "#666",
    lineHeight: 20,
  },
  supportSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  supportTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#c62828",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  supportButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
  contactInfoSection: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  contactMethodsContainer: {
    marginTop: 10,
  },
  contactMethod: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 8,
  },
  contactMethodText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 12,
    fontWeight: "500",
  },
  // Commented out styles for team cards
  /*
  cardContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  cardContent: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
    marginRight: 15,
  },
  imageStyle: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  imageBorder: {
    position: "absolute",
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#c62828",
    opacity: 0.5,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  roleText: {
    fontSize: 15,
    color: "#555",
    marginLeft: 6,
    fontWeight: "500",
  },
  subText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  callButton: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#c62828",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  gradientButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  */
});
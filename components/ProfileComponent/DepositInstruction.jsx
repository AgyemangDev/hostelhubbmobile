import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import COLORS from "../../constants/Colors";

const DepositInstruction = () => {
  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* What You Can Do Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What You Can Do With Your Balance</Text>
          <View style={styles.servicesGrid}>
            <ServiceItem icon="home" text="Book Accommodation" />
            <ServiceItem icon="archive" text="Reserve Storage" />
            <ServiceItem icon="shopping-cart" text="Shop on Market" />
            <ServiceItem icon="bus" text="Book Transport" />
          </View>
        </View>

        {/* How to Deposit Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How to Add Money</Text>
          
          <StepItem 
            number="1" 
            title="Enter Amount"
            description="Choose how much you want to deposit into your HostelHubb wallet"
          />
          
          <StepItem 
            number="2" 
            title="Tap Deposit"
            description="A secure payment window will open in your browser"
          />
          
          <StepItem 
            number="3" 
            title="Complete Payment"
            description="Your balance updates automatically once payment is confirmed"
            isLast
          />
        </View>

        {/* Service-Specific Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Requirements</Text>
          
          <View style={styles.serviceInfo}>
            <View style={styles.serviceHeader}>
              <FontAwesome name="home" size={18} color={COLORS.button} />
              <Text style={styles.serviceName}>Accommodation</Text>
            </View>
            <Text style={styles.serviceDesc}>
              Deposit at least <Text style={styles.highlight}>30 cedis</Text>, then subscribe to HostelHubb to access hostel bookings.
            </Text>
          </View>

          <View style={styles.serviceInfo}>
            <View style={styles.serviceHeader}>
              <FontAwesome name="archive" size={18} color={COLORS.teal} />
              <Text style={styles.serviceName}>Storage & Others</Text>
            </View>
            <Text style={styles.serviceDesc}>
              No subscription needed. Just top up and pay directly for storage, shopping, transport, and other services.
            </Text>
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.footerCard}>
          <FontAwesome name="shield" size={24} color={COLORS.success} style={styles.shieldIcon} />
          <Text style={styles.footerText}>
            Your payments are secured with industry-standard encryption. Enjoy seamless campus living with HostelHubb!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const ServiceItem = ({ icon, text }) => (
  <View style={styles.serviceItem}>
    <View style={styles.serviceIconContainer}>
      <FontAwesome name={icon} size={20} color={COLORS.button} />
    </View>
    <Text style={styles.serviceText}>{text}</Text>
  </View>
);

const StepItem = ({ number, title, description, isLast }) => (
  <View style={[styles.stepContainer, isLast && styles.stepContainerLast]}>
    <View style={styles.stepNumberContainer}>
      <Text style={styles.stepNumber}>{number}</Text>
    </View>
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    paddingVertical: 20,
  },
  headerSection: {
    marginBottom: 24,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.button,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff5f5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#ffe5e5",
  },
  serviceText: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
    fontWeight: "500",
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  stepContainerLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  stepNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.button,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  serviceInfo: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginLeft: 10,
  },
  serviceDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginLeft: 28,
  },
  highlight: {
    fontWeight: "700",
    color: COLORS.button,
  },
  footerCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  shieldIcon: {
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: "#166534",
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },
});

export default DepositInstruction;
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import TermsLink from "../../../components/Links/TermsLink";
import COLORS from "../../../constants/Colors";
import { router, useRouter } from "expo-router";

const terms = [
  "Users must be at least 13 years old to create and use a HostelHubb account.",
  "HostelHubb acts solely as a booking platform and does not own or manage any hostels.",
  "All transactions must be made through approved payment methods within the app.",
  "Refunds and cancellations are handled by individual hostels, not HostelHubb.",
  "Users are responsible for maintaining the confidentiality of their account credentials.",
  "HostelHubb is not liable for any disputes or issues between users and hostel managers.",
  "HostelHubb may update these terms at any time. By continuing to use the platform, you accept any changes. We’ll notify you of major updates when possible.",
  "By using the platform, users agree to these terms and the associated privacy and transaction policies.",
];

const AccordionItem = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={styles.accordionTitleContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color="#fff" />
          </View>
          <Text style={styles.accordionTitle}>{title}</Text>
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={22}
          color={COLORS.background}
        />
      </TouchableOpacity>

      {isOpen && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

const ProcessStep = ({ number, title, description, isLast }) => (
  <View style={styles.processStepContainer}>
    <View style={styles.processStepNumberContainer}>
      <Text style={styles.processStepNumber}>{number}</Text>
    </View>
    <View style={styles.processStepContent}>
      <Text style={styles.processStepTitle}>{title}</Text>
      <Text style={styles.processStepDescription}>{description}</Text>
    </View>
    {!isLast && <View style={styles.processStepConnector} />}
  </View>
);

const IconTextItem = ({ icon, text }) => (
  <View style={styles.iconTextItem}>
    <Ionicons name={icon} size={18} color="#610b0c" />
    <Text style={styles.iconText}>{text}</Text>
  </View>
);

const HowHostelHubbWorks = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>How HostelHubb Works</Text>
          <Text style={styles.heroSubtitle}>
            Your complete guide to finding and booking student accommodations
          </Text>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>
        HostelHubb helps students find quality accommodation near campus, 
        with options for hostels, private stays, and storage for those who can't take everything home.
        </Text>
      </View>

      {/* Process Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Simple 4-Step Process</Text>

        <View style={styles.processContainer}>
          <ProcessStep
            number="1"
            title="Subscribe"
            description="Pay a 6-month subscription fee to access all hostel listings and booking features."
          />

          <ProcessStep
            number="2"
            title="Browse & Request"
            description="Book a hostel and follow up if there’s a delay—especially during busy times to avoid missing out."
            />

          <ProcessStep
            number="3"
            title="Confirm & Pay"
            description="When approved, make secure payments to confirm your reservation."
          />

          <ProcessStep
            number="4"
            title="Move In"
            description="Present your booking confirmation at check-in and enjoy your new accommodation."
            isLast={true}
          />
        </View>
      </View>

      {/* Accordion Sections */}
      <View style={styles.accordionSection}>
        <AccordionItem title="Platform Overview" icon="information-circle">
          <Text style={styles.paragraphText}>
            HostelHubb connects students with hostel managers, simplifying the
            process of booking accommodations near campus. This platform makes
            it easy to browse, book, and manage hostel arrangements remotely.
          </Text>

          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Ionicons name="search" size={24} color={COLORS.background} />
              <Text style={styles.featureText}>Find Hostels</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="business" size={24} color={COLORS.background} />
              <Text style={styles.featureText}>View Details</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons
                name="chatbubbles"
                size={24}
                color={COLORS.background}
              />
              <Text style={styles.featureText}>Contact Managers</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="calendar" size={24} color={COLORS.background} />
              <Text style={styles.featureText}>Book Stays</Text>
            </View>
          </View>
        </AccordionItem>

        <AccordionItem title="Subscription Details" icon="card">
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <IconTextItem
                icon="time"
                text="6-month access to booking system"
              />
            </View>
            <View style={styles.infoRow}>
              <IconTextItem
                icon="checkmark-circle"
                text="Multiple bookings allowed"
              />
            </View>
            <View style={styles.infoRow}>
              <IconTextItem icon="lock-closed" text="Secured account access" />
            </View>
          </View>

          <Text style={styles.paragraphText}>
            Students need to pay a subscription fee every six months to access
            and book hostels listed on HostelHubb. Even after a subscription
            expires, booked hostels remain accessible. Hostel managers must
            accept each booking request before students can proceed to payment.
          </Text>
        </AccordionItem>

        <AccordionItem title="Payment Process" icon="cash">
          <Text style={styles.paragraphText}>
            Once a hostel manager accepts a booking, students should pay
            promptly to secure their spot. Payments are made directly to hostel
            managers through HostelHubb's secure platform.
          </Text>

          <View style={styles.securityBoxContainer}>
            <View style={styles.securityBox}>
              <Ionicons name="shield-checkmark" size={28} color="#610b0c" />
              <Text style={styles.securityBoxTitle}>Secure Payments</Text>
              <Text style={styles.securityBoxText}>
                All transactions are processed through our secure payment
                gateway
              </Text>
            </View>
          </View>

          <Text style={styles.noticeText}>
            Remember: Always verify hostel manager credentials before making
            payments
          </Text>
        </AccordionItem>
      </View>



      {/* Terms Section */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsSectionTitle}>Terms & Conditions</Text>

        {terms.map((term, index) => (
          <View key={index} style={styles.termItem}>
            <View style={styles.termBullet} />
            <Text style={styles.termText}>{term}</Text>
          </View>
        ))}

        <TermsLink
          link={"https://hostelhubb.com/terms"}
          text={"View Complete Terms"}
          style={styles.termsLink}
        />
      </View>

      {/* CTA Footer */}
      <TouchableOpacity style={styles.ctaButton} onPress={() => router.push("(tabs)/(index)")}>
        <Text style={styles.ctaButtonText}>Start Finding Your Hostel</Text>
        <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  heroBanner: {
    height: 180,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  heroOverlay: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    textAlign: "center",
  },
  sectionContainer: {
    marginTop: 25,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.background,
    marginBottom: 15,
    textAlign: "center",
  },
  processContainer: {
    marginTop: 10,
  },
  processStepContainer: {
    flexDirection: "row",
    marginBottom: 30,
    position: "relative",
  },
  processStepNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  processStepNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  processStepContent: {
    flex: 1,
  },
  processStepTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.background,
    marginBottom: 5,
  },
  processStepDescription: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  processStepConnector: {
    position: "absolute",
    left: 18,
    top: 36,
    width: 2,
    height: 30,
    backgroundColor: "#610b0c",
  },
  accordionSection: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  accordionContainer: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
  },
  accordionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#610b0c",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  accordionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  accordionContent: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  paragraphText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 15,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "space-between",
  },
  featureItem: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    fontWeight: "500",
  },
  infoBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  infoRow: {
    marginBottom: 12,
  },
  iconTextItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#444",
  },
  subscribeButton: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  subscribeButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 5,
  },
  securityBoxContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  securityBox: {
    backgroundColor: "#f9f9f9",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  securityBoxTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  securityBoxText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  noticeText: {
    fontStyle: "italic",
    color: COLORS.background,
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  warningContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  warningHeader: {
    backgroundColor: COLORS.background,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  warningHeaderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  warningBodyText: {
    backgroundColor: "#fff5f5",
    padding: 15,
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.background,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  safetyTipsContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.background,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  safetyTipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  termsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  termsSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  termItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  termBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.background,
    marginTop: 8,
    marginRight: 10,
  },
  termText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  termsLink: {
    alignSelf: "center",
    marginTop: 15,
  },
  ctaButton: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 18,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default HowHostelHubbWorks;

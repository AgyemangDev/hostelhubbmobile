import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import COLORS from "../../../constants/Colors";

// ─── Icon placeholder ────────────────────────────────────────────────────────
// Replace with your icon library, e.g. import { Ionicons } from "@expo/vector-icons"
const Icon = ({ name, size = 20, color = COLORS.teal }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: COLORS.teal + "22",
      alignItems: "center",
      justifyContent: "center",
    }}
  />
);

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel = ({ number, title }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionBadge}>
      <Text style={styles.sectionBadgeText}>{number}</Text>
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const InfoNote = ({ children }) => (
  <View style={styles.infoNote}>
    <View style={styles.infoNoteDot} />
    <Text style={styles.infoNoteText}>{children}</Text>
  </View>
);

const BookingStep = ({ icon, label, isLast }) => (
  <View style={styles.stepWrapper}>
    <View style={styles.stepDot}>
      <Icon name={icon} size={16} color={COLORS.teal} />
    </View>
    {!isLast && <View style={styles.stepLine} />}
    <Text style={styles.stepLabel}>{label}</Text>
  </View>
);

const SmallCard = ({ icon, title, body }) => (
  <View style={styles.smallCard}>
    <View style={styles.smallCardIconWrap}>
      <Icon name={icon} size={18} color={COLORS.teal} />
    </View>
    <Text style={styles.smallCardTitle}>{title}</Text>
    <Text style={styles.smallCardBody}>{body}</Text>
  </View>
);

const FeatureCard = ({ icon, title, body }) => (
  <View style={styles.featureCard}>
    <View style={styles.featureCardIconWrap}>
      <Icon name={icon} size={20} color={COLORS.teal} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.featureCardTitle}>{title}</Text>
      <Text style={styles.featureCardBody}>{body}</Text>
    </View>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────

const HowHostelHubbWorks = () => {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ── */}
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>HOSTELHUBB · BUILT FOR STUDENTS</Text>
        <Text style={styles.heroTitle}>
          Three services.{"\n"}One app. Your campus{"\n"}life, handled.
        </Text>
        <Text style={styles.heroSub}>
          From finding a room to storing your luggage over break and getting
          home safely — HostelHubb takes care of the hard parts of student life
          across Ghana's campuses.
        </Text>
      </View>

      <View style={styles.divider} />

      {/* ── Mission & Vision ── */}
      <View style={styles.mvRow}>
        <View style={[styles.mvCard, { marginRight: 6 }]}>
          <Text style={styles.mvLabel}>OUR VISION</Text>
          <Text style={styles.mvBody}>
            A campus experience where no student spends extra time worrying
            about accommodation, getting home, or storing their things.
          </Text>
        </View>
        <View style={[styles.mvCard, { marginLeft: 6 }]}>
          <Text style={styles.mvLabel}>OUR MISSION</Text>
          <Text style={styles.mvBody}>
            To make every aspect of student living easier — one trusted app for
            accommodation, transport, and storage.
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ════════════════════════════════
          SERVICE 1 — ACCOMMODATION
      ════════════════════════════════ */}
      <SectionLabel number="1" title="Accommodation" />

      {/* Booking steps — vertical on mobile */}
      <View style={styles.stepsContainer}>
        <BookingStep icon="search" label="Browse rooms on your campus" />
        <BookingStep icon="calendar" label="Select & send a booking" />
        <BookingStep icon="bell" label="Manager confirms availability" />
        <BookingStep icon="card" label="Pay in-app or via bank" />
        <BookingStep icon="home" label="Room secured — it's yours" isLast />
      </View>

      <InfoNote>
        Payment locks in your room. Once you pay, it's confirmed — no
        follow-up calls, no uncertainty.
      </InfoNote>

      {/* HubClips */}
      <View style={styles.hubclipsCard}>
        <View style={styles.hubclipsHeader}>
          <View style={styles.hubclipsIconWrap}>
            <Icon name="videocam" size={20} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.hubclipsTitleRow}>
              <Text style={styles.hubclipsTitle}>HubClips</Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            </View>
            <Text style={styles.hubclipsSub}>Sell your room fast</Text>
          </View>
        </View>
        <Text style={styles.hubclipsBody}>
          Leaving campus and need to transfer your room? Film a short
          walkthrough, submit it for quality review, and HostelHubb finds a
          replacement student. Once everything is documented with your hostel
          manager, you receive your money — clean and quick.
        </Text>
      </View>

      {/* Referral */}
      <View style={styles.referralCard}>
        <View style={styles.referralIconWrap}>
          <Icon name="people" size={20} color={COLORS.teal} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.referralTitle}>Refer a hostel, earn every time</Text>
          <Text style={styles.referralBody}>
            Know an accommodation that should be on HostelHubb? Refer the hostel
            owner. Every time a student makes a paid booking there, you earn —
            and you keep earning with every rebook. No cap, no expiry.
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ════════════════════════════════
          SERVICE 2 — STORAGE
      ════════════════════════════════ */}
      <SectionLabel number="2" title="Storage" />

      <InfoNote>
        Heading home for a short break? Don't lug everything with you. We store
        your belongings safely and bring them back when school resumes.
      </InfoNote>

      <View style={styles.smallCardRow}>
        <SmallCard
          icon="cube"
          title="We pick up from you"
          body="Schedule a pickup and we collect your luggage from your hostel."
        />
        <SmallCard
          icon="lock"
          title="Stored safely"
          body="Your items are kept securely and tracked throughout the break."
        />
        <SmallCard
          icon="location"
          title="Delivered back"
          body="We bring your things to your selected location when school resumes."
        />
      </View>

      <View style={styles.divider} />

      {/* ════════════════════════════════
          SERVICE 3 — TRANSPORT
      ════════════════════════════════ */}
      <SectionLabel number="3" title="Transport" />

      <InfoNote>
        We move students between campus and home at designated cities —
        scheduled, reliable, and booked right from the app.
      </InfoNote>

      <FeatureCard
        icon="business"
        title="Campus → home"
        body="End of semester or short break? Book your seat and travel without stress."
      />
      <FeatureCard
        icon="school"
        title="Home → campus"
        body="Resume is near? We get you back on time — no last-minute scrambling for transport."
      />
      <FeatureCard
        icon="map"
        title="Designated cities"
        body="Available across key cities in Ghana, with routes chosen around where students actually live."
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default HowHostelHubbWorks;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },

  // Hero
  hero: {
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.teal,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    lineHeight: 34,
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },

  divider: {
    height: 0.5,
    backgroundColor: "#E0E0E0",
    marginVertical: 24,
  },

  // Mission / Vision
  mvRow: {
    flexDirection: "row",
  },
  mvCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
  },
  mvLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.teal,
    letterSpacing: 1,
    marginBottom: 6,
  },
  mvBody: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.teal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  sectionBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },

  // Booking steps
  stepsContainer: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  stepLine: {
    position: "absolute",
    left: 17,
    top: 36,
    width: 2,
    height: 24,
    backgroundColor: "#9FE1CB",
    zIndex: 0,
  },
  stepLabel: {
    fontSize: 13,
    color: "#444",
    marginLeft: 12,
    marginTop: 9,
    marginBottom: 24,
    flex: 1,
  },

  // Info note
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E1F5EE",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  infoNoteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.teal,
    marginTop: 6,
    flexShrink: 0,
  },
  infoNoteText: {
    fontSize: 13,
    color: "#085041",
    lineHeight: 20,
    flex: 1,
  },

  // HubClips card
  hubclipsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    marginBottom: 12,
  },
  hubclipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  hubclipsIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  hubclipsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  hubclipsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  newBadge: {
    backgroundColor: COLORS.teal,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  hubclipsSub: {
    fontSize: 12,
    color: "#888",
  },
  hubclipsBody: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },

  // Referral card
  referralCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.teal,
    padding: 14,
    gap: 12,
    marginBottom: 4,
  },
  referralIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E1F5EE",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  referralTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  referralBody: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },

  // Small cards (3-col)
  smallCardRow: {
    flexDirection: "row",
    gap: 8,
  },
  smallCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    padding: 12,
  },
  smallCardIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#E1F5EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  smallCardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  smallCardBody: {
    fontSize: 11,
    color: "#666",
    lineHeight: 16,
  },

  // Feature cards (full-width rows)
  featureCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  featureCardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#E1F5EE",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 3,
  },
  featureCardBody: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
  },
});
import React, { useState } from "react";
import { Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../lib/firebase/FirebaseConfig";
import ClientLogIn from "../(Client)/ClientLogIn";
import BookingsClosedModal from "../../components/storage/BookingsClosedModal";
import { Button, Eyebrow, FadeIn, PriceBar, ScreenHeader } from "../../components/ui/ds";
import { colors, radius, space, type } from "../../constants/theme";

const HERO_IMAGE =
  "https://image.freepik.com/free-photo/surface-image-green-self-storage-facility-with-opened-unit-door-cardboard-boxes-copy-space_236854-24686.jpg";

const STEPS = [
  { title: "Pick your items", body: "Priced per item, set by HostelHubb." },
  { title: "Choose pickup and delivery days", body: "Within your school's storage window." },
  { title: "Pay once, track it all", body: "Change your delivery day or spot any time." },
];

const GUARANTEES = [
  { icon: "shield-checkmark-outline", text: "Insured" },
  { icon: "car-outline", text: "Free pickup and delivery" },
  { icon: "time-outline", text: "Support on WhatsApp" },
];

// Set to true between storage cycles to show the "bookings closed" sheet.
const BOOKINGS_CLOSED = false;

export default function StorageHome() {
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [showClosed, setShowClosed] = useState(false);

  const start = () => {
    if (BOOKINGS_CLOSED) return setShowClosed(true);
    if (!auth.currentUser) return setShowAuth(true);
    router.push("SchoolSelection");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeIn style={{ gap: space.xs }}>
          <Eyebrow>HOSTELHUBB STORAGE</Eyebrow>
          <Text style={styles.title} accessibilityRole="header">Going home? We'll keep your things.</Text>
          <Text style={[type.body, { color: colors.textSecondary }]}>
            We pick up from your hostel, store everything safely over the break, and bring it back when you return.
          </Text>
        </FadeIn>

        <FadeIn delay={60}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.hero} accessibilityIgnoresInvertColors />
        </FadeIn>

        <FadeIn delay={120} style={{ gap: space.md }}>
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={[type.caption, { color: colors.textInverse, fontWeight: "800" }]}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={type.bodyStrong}>{s.title}</Text>
                <Text style={[type.caption, { color: colors.textSecondary }]}>{s.body}</Text>
              </View>
            </View>
          ))}
        </FadeIn>

        <View style={styles.guarantees}>
          {GUARANTEES.map((g) => (
            <View key={g.text} style={styles.guarantee}>
              <Ionicons name={g.icon} size={20} color={colors.text} />
              <Text style={[type.caption, { fontWeight: "700", textAlign: "center" }]}>{g.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <PriceBar action={<Button title="Start a storage booking" onPress={start} />} />

      <BookingsClosedModal visible={showClosed} onClose={() => setShowClosed(false)} />
      <Modal visible={showAuth} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAuth(false)}>
        <ClientLogIn onClose={() => setShowAuth(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxl, gap: space.xl },
  title: { fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.5, color: colors.text },
  hero: { height: 190, borderRadius: radius.lg, backgroundColor: colors.fill },
  step: { flexDirection: "row", gap: space.sm + 2, alignItems: "flex-start" },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.text, alignItems: "center", justifyContent: "center" },
  guarantees: { flexDirection: "row", gap: space.xs, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong },
  guarantee: { flex: 1, alignItems: "center", gap: 6, paddingVertical: space.xs },
});

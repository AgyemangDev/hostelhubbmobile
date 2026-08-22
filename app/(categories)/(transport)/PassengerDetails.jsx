import React, { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../../../constants/Colors";
import { UserContext } from "../../../context/UserContext";
import FormInput from "../../../components/InputFields/FormInput";
import FunctionalButton from "../../../components/ButtonComponents/FunctionalButton";
import TripInfoCard from "../../../components/Cards/transport/TripInfoCard";

/**
 * Who is travelling. UniGo puts these details on the ticket and emails the
 * confirmation there, so they are collected before payment rather than being
 * inferred from the HostelHubb account (people book for friends and siblings).
 */

/** Ghanaian mobile numbers: 10 digits local, or +233 followed by 9. */
const isValidPhone = (value) => /^(?:0\d{9}|\+?233\d{9})$/.test(String(value).replace(/[\s-]/g, ""));
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));

const PassengerDetails = () => {
  const { bus: busParam, selectedSeats: seatsParam } = useLocalSearchParams();
  const { userInfo } = useContext(UserContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bus = useMemo(() => {
    try {
      return JSON.parse(busParam);
    } catch {
      return null;
    }
  }, [busParam]);

  const selectedSeats = useMemo(() => {
    try {
      return JSON.parse(seatsParam) || [];
    } catch {
      return [];
    }
  }, [seatsParam]);

  // Prefilled from the HostelHubb profile, but every field stays editable —
  // students routinely book for a friend or a sibling.
  const [name, setName] = useState(
    [userInfo?.firstName, userInfo?.surname].filter(Boolean).join(" ")
  );
  const [email, setEmail] = useState(userInfo?.email || "");
  const [phone, setPhone] = useState(userInfo?.phoneNumber || "");
  const [touched, setTouched] = useState(false);

  const errors = {
    name: name.trim().length < 2 ? "Enter the passenger's full name" : "",
    phone: !isValidPhone(phone) ? "Enter a valid Ghanaian phone number" : "",
    email: email.trim() && !isValidEmail(email) ? "Enter a valid email address" : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleContinue = () => {
    setTouched(true);
    if (hasErrors) return;

    router.push({
      pathname: "/(categories)/(transport)/PaymentScreen",
      params: {
        bus: busParam,
        selectedSeats: seatsParam,
        passenger: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.replace(/[\s-]/g, ""),
        }),
      },
    });
  };

  const showError = (field) => (touched && errors[field] ? errors[field] : "");

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {bus && <TripInfoCard bus={bus} selectedSeats={selectedSeats} />}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-outline" size={18} color={COLORS.button} />
            <Text style={styles.cardTitle}>Passenger Details</Text>
          </View>

          <Text style={styles.hint}>
            These go on the ticket. Booking for someone else? Enter their details.
          </Text>

          <FormInput placeholder="Full name" value={name} onChangeText={setName} />
          {showError("name") ? <Text style={styles.error}>{errors.name}</Text> : null}

          <FormInput
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          {showError("phone") ? <Text style={styles.error}>{errors.phone}</Text> : null}

          <FormInput
            placeholder="Email (for the ticket)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {showError("email") ? <Text style={styles.error}>{errors.email}</Text> : null}
        </View>

        <View style={styles.noticeCard}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.textMuted} />
          <Text style={styles.noticeText}>
            Payment is handled securely by UniGo Transport, who operate this trip. Your
            ticket appears here in HostelHubb as soon as payment goes through.
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom || (Platform.OS === "android" ? 16 : 12) },
        ]}
      >
        <FunctionalButton text="Continue to Payment" onPress={handleContinue} icon="arrow-forward" />
      </View>
    </View>
  );
};

export default PassengerDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  scroll: { padding: 16, gap: 14 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
  hint: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4 },
  error: { fontSize: 12, color: COLORS.error, marginTop: -6, marginBottom: 4 },
  noticeCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 14,
  },
  noticeText: { flex: 1, fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
});

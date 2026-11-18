import React, { useContext, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { UserContext } from "../../../../context/UserContext";
import { Button, Notice, PriceBar, ScreenHeader, TextField } from "../../../../components/ui";
import { money } from "../../../../utils/formatMoney";
import { colors, space, type } from "../../../../constants/theme";

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

  // MainLayout redirects to ProfileUpdate when these are missing, so they are
  // reliable defaults — but the user can still override them for someone else.
  const [name, setName] = useState(
    [userInfo?.first_name, userInfo?.surname].filter(Boolean).join(" ")
  );
  const [email, setEmail] = useState(userInfo?.email || "");
  const [phone, setPhone] = useState(userInfo?.phone_number || "");
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
      pathname: "/(categories)/(transport)/unigo/PaymentScreen",
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

  const total = selectedSeats.length * (Number(bus?.price) || 0);
  const route = bus?.route || {};

  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <ScreenHeader title="Who's travelling?" subtitle={route.from ? `${route.from} → ${route.to}` : undefined} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[type.body, { color: colors.textSecondary }]}>
          The ticket and confirmation go to this person. Booking for a friend? Change the details.
        </Text>
        <TextField label="Full name" value={name} onChangeText={setName} autoCapitalize="words" error={showError("name")} textContentType="name" />
        <TextField
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="024 000 0000"
          error={showError("phone")}
          hint="The driver may call this number on the day."
          textContentType="telephoneNumber"
        />
        <TextField
          label="Email (optional)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={showError("email")}
          textContentType="emailAddress"
        />
        {selectedSeats.length > 1 ? (
          <Notice tone="info">One name goes on the booking for all {selectedSeats.length} seats.</Notice>
        ) : null}
      </ScrollView>
      <PriceBar
        amount={money(total, { decimals: 0 })}
        caption={`Seat${selectedSeats.length > 1 ? "s" : ""} ${selectedSeats.map((x) => x.number).join(", ")}`}
        action={<Button title="Continue to pay" onPress={handleContinue} />}
      />
    </SafeAreaView>
  );
};

export default PassengerDetails;

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, paddingTop: space.xs, gap: space.lg, paddingBottom: space.xxl },
});

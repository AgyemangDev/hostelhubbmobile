import { useState, useContext, useEffect } from "react";
import { SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStorageReservation } from "../../context/StorageReservationContext";
import { UserContext } from "../../context/UserContext";
import { Button, Card, FadeIn, Notice, PriceBar, StepHeader, TextField } from "../../components/ui/ds";
import { colors, radius, space, type } from "../../constants/theme";
import { STORAGE_TOTAL_STEPS, stepOf } from "../../constants/storageSteps";
import API_BASE_URL from "../../utils/api/api";
import {
  clearPendingReferral,
  getPendingReferral,
} from "../../utils/referralStorage";

export default function ReferralStep() {
  const router = useRouter();
  const { updateReservation } = useStorageReservation();
  const { userInfo, user } = useContext(UserContext);

  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [matched, setMatched] = useState(null); // { id, firstname, surname }
  const [error, setError] = useState(null);
  const [pendingReferralLoaded, setPendingReferralLoaded] = useState(false);

  // The current user's own referral code, from UserContext (user.referral_code).
  const myReferralCode = userInfo?.referral_code || "—";

  useEffect(() => {
    let active = true;
    getPendingReferral()
      .then((pending) => {
        if (active && pending?.code) setCode(pending.code);
      })
      .finally(() => {
        if (active) setPendingReferralLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!pendingReferralLoaded || !code || matched || checking || !user) return;
    handleCheck();
  }, [pendingReferralLoaded]);

  const handleCheck = async () => {
    const trimmed = code.trim();
    if (!trimmed || checking) return;

    setChecking(true);
    setError(null);
    setMatched(null);

    try {
      const token = await user.getIdToken(false);
      const res = await fetch(
        `${API_BASE_URL}/api/referral/validate?code=${encodeURIComponent(trimmed)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Couldn't check that code");

      if (!data.valid) {
        setError(data.error || "No student found with that referral code.");
        return;
      }

      setMatched(data.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  };

  const confirmReferrer = async () => {
    updateReservation({
      referral: {
        status: "confirmed",
        referrerId: matched.id,
        code: code.trim(),
        firstname: matched.firstname,
        surname: matched.surname,
      },
    });
    await clearPendingReferral();
    router.push("ReviewPay");
  };

  const skipReferral = async () => {
    updateReservation({
      referral: { status: "skipped", referrerId: null, code: null, firstname: null, surname: null },
    });
    await clearPendingReferral();
    router.push("ReviewPay");
  };

  const handleShare = async () => {
    try {
      const referralUrl = `https://hostelhubb.com/refer/${encodeURIComponent(myReferralCode)}`;

      await Share.share({
        message: `Use my referral code ${myReferralCode} to book for storage on hostelhubb, and share yours with someone to earn.\n${referralUrl}`,
        url: referralUrl, // iOS attaches this as the shareable link; its OG metadata drives the preview image
      });
    } catch (e) {
      console.warn("Failed to open share sheet:", e);
    }
  };
  return (
    <SafeAreaView style={styles.screen}>
      <StepHeader step={stepOf("ReferralStep")} total={STORAGE_TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={{ gap: space.xs }}>
          <Text style={type.display} accessibilityRole="header">Referred by a friend?</Text>
          <Text style={[type.body, { color: colors.textSecondary }]}>
            Enter their code and they earn a reward when you pay. It doesn't change your price.
          </Text>
        </View>

        <View style={{ gap: space.sm }}>
          <TextField
            label="Friend's referral code"
            value={code}
            onChangeText={(t) => {
              setCode(t);
              setMatched(null);
              setError(null);
            }}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="e.g. KOFI26"
            returnKeyType="search"
            onSubmitEditing={handleCheck}
            error={error}
          />
          {!matched ? (
            <Button title="Check code" variant="secondary" onPress={handleCheck} loading={checking} disabled={!code.trim()} />
          ) : null}
        </View>

        {matched ? (
          <FadeIn>
            <Notice tone="success" title={`${[matched.firstname, matched.surname].filter(Boolean).join(" ")} will get the reward`}>
              Continue to confirm. You can still skip if this isn't right.
            </Notice>
          </FadeIn>
        ) : null}

        <Card style={styles.mine}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[type.label, { color: colors.textSecondary }]}>YOUR CODE</Text>
            <Text style={[type.title, { letterSpacing: 1 }]}>{myReferralCode}</Text>
            <Text style={[type.caption, { color: colors.textSecondary }]}>Share it and earn 5% when friends pay.</Text>
          </View>
          <Button title="Share" icon="share-outline" variant="secondary" size="sm" onPress={handleShare} />
        </Card>
      </ScrollView>

      <PriceBar>
        <View style={{ flex: 1, flexDirection: "row", gap: space.sm }}>
          <Button title="Skip" variant="secondary" onPress={skipReferral} style={{ flex: 1 }} />
          <Button title="Continue" onPress={confirmReferrer} disabled={!matched} style={{ flex: 1.4 }} />
        </View>
      </PriceBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.xl, paddingBottom: space.xxl },
  mine: { flexDirection: "row", alignItems: "center", gap: space.md, borderRadius: radius.lg },
});

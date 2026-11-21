import { useState, useContext, useEffect } from "react";
import { ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import { UserContext } from "../../context/UserContext";
import { Button, PriceBar, StepHeader, KeyboardView } from "../../components/ui";
import { colors, radius, space, type } from "../../constants/theme";
import { STORAGE_TOTAL_STEPS, stepOf } from "../../constants/storageSteps";
import API_BASE_URL from "../../utils/api/api";
import {
  clearPendingReferral,
  getPendingReferral,
} from "../../utils/referralStorage";
import ReferralCodeField from "../../components/forms/referral/ReferralCodeField";
import MyReferralCodeCard from "../../components/cards/referral/MyReferralCodeCard";

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

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
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <StepHeader step={stepOf("ReferralStep")} total={STORAGE_TOTAL_STEPS} />
      <KeyboardView>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={{ gap: space.xs }}>
          <Text style={type.display} accessibilityRole="header">Referred by a friend?</Text>
          <Text style={[type.body, { color: colors.textSecondary }]}>
            Enter their code and they earn a reward when you pay. It doesn't change your price.
          </Text>
        </View>

        <ReferralCodeField
          code={code}
          onChangeCode={(t) => {
            setCode(t);
            setMatched(null);
            setError(null);
          }}
          checking={checking}
          match={matched}
          error={error}
          onCheck={handleCheck}
        />

        <MyReferralCodeCard code={myReferralCode} onShare={handleShare} />
      </ScrollView>

      <PriceBar>
        <View style={{ flex: 1, flexDirection: "row", gap: space.sm }}>
          <Button title="Skip" variant="secondary" onPress={skipReferral} style={{ flex: 1 }} />
          <Button title="Continue" onPress={confirmReferrer} disabled={!matched} style={{ flex: 1.4 }} />
        </View>
      </PriceBar>
      </KeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.xl, paddingBottom: space.xxl },
});

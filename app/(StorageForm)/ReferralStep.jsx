import { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable, Share } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/ButtonComponents/ButtonComponent";
import { useStorageReservation } from "../../context/StorageReservationContext";
import { UserContext } from "../../context/UserContext";
import COLORS from "../../constants/Colors";
import API_BASE_URL from "../../utils/api/api";

export default function ReferralStep() {
  const router = useRouter();
  const { updateReservation } = useStorageReservation();
  const { userInfo, user } = useContext(UserContext);

  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [matched, setMatched] = useState(null); // { id, firstname, surname }
  const [error, setError] = useState(null);

  // The current user's own referral code, from UserContext (user.referral_code).
  const myReferralCode = userInfo?.referral_code || "—";

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

  const confirmReferrer = () => {
    updateReservation({
      referral: {
        status: "confirmed",
        referrerId: matched.id,
        code: code.trim(),
        firstname: matched.firstname,
        surname: matched.surname,
      },
    });
    router.push("ReviewPay");
  };

  const skipReferral = () => {
    updateReservation({
      referral: { status: "skipped", referrerId: null, code: null, firstname: null, surname: null },
    });
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
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Were you referred?</Text>
        <Text style={styles.subtitle}>
          If someone gave you a referral code, enter it below to credit them.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter referral code"
          placeholderTextColor={COLORS.placeholder}
          autoCapitalize="characters"
          value={code}
          editable={!checking}
          onChangeText={(text) => {
            setCode(text);
            setMatched(null);
            setError(null);
          }}
        />

        {checking && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 12 }} />}

        {!checking && matched && (
          <View style={styles.matchBox}>
            <Text style={styles.matchText}>
              Referred by {matched.firstname} {matched.surname}
            </Text>
          </View>
        )}

        {!checking && error && <Text style={styles.errorText}>{error}</Text>}

        {!matched && (
          <Button
            buttonText={checking ? "Checking..." : "Check code"}
            disabled={checking || !code.trim()}
            onPressFunction={handleCheck}
          />
        )}

        {/* Share & earn section */}
        <View style={styles.shareCard}>
          <Text style={styles.shareTitle}>Share &amp; earn</Text>
          <Text style={styles.shareBody}>
            Invite friends with your referral code. When they book, you earn a share of
            HostelHubb's revenue from that booking — they never pay extra.
          </Text>

          <View style={styles.codeRow}>
            <View style={styles.codePill}>
              <Text style={styles.codeText}>{myReferralCode}</Text>
            </View>

            <Pressable onPress={handleShare} style={styles.iconButton}>
              <Ionicons name="share-social-outline" size={20} color={COLORS.teal} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          buttonText={matched ? "Continue" : "I wasn't referred"}
          onPressFunction={matched ? confirmReferrer : skipReferral}
          buttonStyle={!matched ? styles.skipButton : undefined}
          textStyle={!matched ? styles.skipButtonText : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#FDFBFA", justifyContent: "space-between" },
  container: { padding: 20 },
  title: { fontSize: 21, fontWeight: "700", marginBottom: 6, color: COLORS.textDark },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 22, lineHeight: 19 },
  input: {
    borderWidth: 1.5,
    borderColor: "#E7E2E2",
    backgroundColor: "#FBF8F8",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: COLORS.textDark,
  },
  matchBox: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  matchText: { color: COLORS.white, fontWeight: "600" },
  errorText: { color: COLORS.button, marginBottom: 16, fontSize: 13 },

  shareCard: {
    marginTop: 20,
    backgroundColor: "#F3F8F6",
    borderWidth: 1,
    borderColor: "#DCEBE6",
    borderRadius: 14,
    padding: 18,
  },
  shareTitle: { fontSize: 15, fontWeight: "700", color: COLORS.teal, marginBottom: 6 },
  shareBody: { fontSize: 13, color: COLORS.textMuted, lineHeight: 19 },
  codeRow: { flexDirection: "row", alignItems: "center", marginTop: 14, gap: 8 },
  codePill: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  codeText: { fontSize: 15, fontWeight: "700", color: COLORS.teal, letterSpacing: 1.5 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#DCEBE6",
  },

  footer: { padding: 20, gap: 10 },
  skipButton: { backgroundColor: "transparent", borderWidth: 1, borderColor: COLORS.textMuted },
  skipButtonText: { color: COLORS.textMuted },
});
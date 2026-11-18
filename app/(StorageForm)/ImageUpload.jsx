import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import { Button, FadeIn, ListRow, Notice, PressableScale, PriceBar, Sheet, StepHeader } from "../../components/ui";
import { money } from "../../utils/formatMoney";
import { colors, radius, space, type } from "../../constants/theme";
import { STORAGE_TOTAL_STEPS, stepOf } from "../../constants/storageSteps";

const TIPS = ["Good light", "Every item in the shot", "In focus"];

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

export default function ImageUpload() {
  const router = useRouter();
  const { reservation, updateReservation } = useStorageReservation();
  const [chooser, setChooser] = useState(false);
  const photo = reservation.groupImage?.uri;
  const total = (reservation.items || []).reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const ensurePermission = async (source) => {
    const perms =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perms.status !== "granted") {
      Alert.alert("Permission needed", `Allow HostelHubb to use your ${source === "camera" ? "camera" : "photos"} in Settings.`);
      return false;
    }
    return true;
  };

  const pick = async (source) => {
    setChooser(false);
    if (!(await ensurePermission(source))) return;
    const options = { quality: 0.7, allowsEditing: true, aspect: [4, 3] };
    // No base64 here: too large for AsyncStorage. It is read fresh at payment.
    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync({ ...options, allowsMultipleSelection: false });
    if (result.canceled) return;
    const asset = result.assets[0];
    updateReservation({
      groupImage: { uri: asset.uri, mimeType: asset.mimeType || "image/jpeg", fileName: asset.fileName || "photo.jpg" },
    });
  };

  const proceed = () => {
    if (!photo) {
      Alert.alert("Add a photo", "Take one photo with all your items together.");
      return;
    }
    router.push("ReferralStep");
  };

  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <StepHeader step={stepOf("ImageUpload")} total={STORAGE_TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ gap: space.xs }}>
          <Text style={type.display} accessibilityRole="header">One photo of everything</Text>
          <Text style={[type.body, { color: colors.textSecondary }]}>
            We match it at pickup and delivery, so nothing gets mixed up.
          </Text>
        </View>

        <Notice tone="warning" icon="cube-outline" title="Make sure every item is in the photo">
          Kindly ensure all your items are included before submitting your order. If an item isn't fully packed yet,
          book the fully packed ones now and make a separate reservation for the rest once you're done packing.
        </Notice>

        {photo ? (
          <FadeIn style={{ gap: space.sm }}>
            <Image source={{ uri: photo }} style={styles.photo} accessibilityLabel="Your items photo" />
            <View style={styles.photoRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={[type.caption, { fontWeight: "700", color: colors.success }]}>Photo added</Text>
              </View>
              <Button title="Retake" variant="ghost" size="sm" onPress={() => setChooser(true)} />
            </View>
          </FadeIn>
        ) : (
          <PressableScale
            onPress={() => setChooser(true)}
            accessibilityRole="button"
            accessibilityLabel="Add a photo of your items"
            style={styles.drop}
          >
            <View style={styles.dropIcon}>
              <Ionicons name="camera-outline" size={26} color={colors.text} />
            </View>
            <Text style={type.bodyStrong}>Add a photo</Text>
            <Text style={[type.caption, { color: colors.textSecondary }]}>Camera or gallery</Text>
          </PressableScale>
        )}

        <View style={styles.tips}>
          {TIPS.map((t) => (
            <View key={t} style={styles.tip}>
              <Ionicons name="checkmark" size={16} color={colors.text} />
              <Text style={[type.caption, { fontWeight: "600" }]}>{t}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <PriceBar
        amount={money(total)}
        caption={photo ? "Photo added" : "Photo needed"}
        action={<Button title="Continue" onPress={proceed} disabled={!photo} style={{ paddingHorizontal: space.xl }} />}
      />

      <Sheet visible={chooser} onClose={() => setChooser(false)} title="Add a photo">
        <ListRow icon="camera-outline" title="Take a photo" onPress={() => pick("camera")} />
        <ListRow icon="images-outline" title="Choose from gallery" onPress={() => pick("gallery")} last />
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.xl, paddingBottom: space.xxl },
  drop: {
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: colors.surfaceSunken,
  },
  dropIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginBottom: space.xs, borderWidth: 1, borderColor: colors.border },
  photo: { width: "100%", aspectRatio: 4 / 3, borderRadius: radius.lg, backgroundColor: colors.fill },
  photoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tips: { flexDirection: "row", flexWrap: "wrap", gap: space.md },
  tip: { flexDirection: "row", alignItems: "center", gap: 6 },
});

"use client";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import COLORS from "../../constants/Colors";
import BottomButton from "../../components/ButtonComponents/BottomButton";

export default function ImageUpload() {
  const router = useRouter();
  const { reservation, updateReservation } = useStorageReservation();
  const [preview, setPreview] = useState(null);

  const requestPermissions = async (type) => {
    const perms =
      type === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (perms.status !== "granted") {
      Alert.alert("Permission Required", `Permission to access ${type} is required.`, [
        { text: "OK" },
      ]);
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    Alert.alert(
      "Select Group Image",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: async () => {
            const hasPermission = await requestPermissions("camera");
            if (!hasPermission) return;
            const result = await ImagePicker.launchCameraAsync({
              quality: 0.7,
              allowsEditing: true,
              aspect: [4, 3],
              // ✅ No base64 here — too large for AsyncStorage, read fresh at payment
            });
            if (!result.canceled) {
              const asset = result.assets[0];
              updateReservation({
                groupImage: {
                  uri: asset.uri,                         // local uri for preview
                  mimeType: asset.mimeType || "image/jpeg",
                  fileName: asset.fileName || "photo.jpg",
                },
              });
            }
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const hasPermission = await requestPermissions("gallery");
            if (!hasPermission) return;
            const result = await ImagePicker.launchImageLibraryAsync({
              quality: 0.7,
              allowsEditing: true,
              allowsMultipleSelection: false,
              aspect: [4, 3],
              // ✅ No base64 here — too large for AsyncStorage, read fresh at payment
            });
            if (!result.canceled) {
              const asset = result.assets[0];
              updateReservation({
                groupImage: {
                  uri: asset.uri,                         // local uri for preview
                  mimeType: asset.mimeType || "image/jpeg",
                  fileName: asset.fileName || "photo.jpg",
                },
              });
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const proceed = () => {
    if (!reservation.groupImage?.uri) {
      Alert.alert("Missing Image", "Please attach a group image of all your items.", [
        { text: "OK" },
      ]);
      return;
    }
    router.push("ReferralStep");
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Upload Group Photo</Text>
          <Text style={styles.subtitle}>Take or select a photo of all your items together</Text>
        </View>

        <View style={styles.uploadSection}>
          {!reservation.groupImage?.uri ? (
            <Pressable style={styles.emptyImageBox} onPress={pickImage}>
              <View style={styles.iconCircle}>
                <Ionicons name="images-outline" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyText}>Add Group Photo</Text>
              <Text style={styles.emptySubtext}>Tap to take a photo or select from gallery</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.filledImageBox}
              onPress={() => setPreview(reservation.groupImage.uri)}
            >
              <Image source={{ uri: reservation.groupImage.uri }} style={styles.image} />
              <Pressable
                style={styles.cameraIcon}
                onPress={(e) => { e.stopPropagation(); pickImage(); }}
              >
                <Ionicons name="camera" size={20} color={COLORS.white} />
              </Pressable>
              <View style={styles.imageLabel}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.imageLabelText}>Photo added</Text>
              </View>
            </Pressable>
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={22} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Important</Text>
          </View>
          <Text style={styles.infoText}>
            Please ensure <Text style={styles.boldText}>all items</Text> to be stored are clearly
            visible in the photo. This helps us with easy identification during pickup and delivery.
          </Text>
          <View style={styles.tipsList}>
            {["Good lighting", "All items visible", "Clear and focused"].map((tip) => (
              <View key={tip} style={styles.tipItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.success} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.stickyButton}>
        <BottomButton buttonText="Continue" onPressFunction={proceed} />
      </View>

      <Modal visible={!!preview} transparent animationType="fade">
        <Pressable style={styles.previewOverlay} onPress={() => setPreview(null)}>
          <Image source={{ uri: preview }} style={styles.previewImage} />
          <Pressable style={styles.closeButton} onPress={() => setPreview(null)}>
            <Ionicons name="close" size={28} color={COLORS.white} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f8f9fa" },
  container: { padding: 20, paddingBottom: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "700", color: COLORS.textDark, marginBottom: 8 },
  subtitle: { fontSize: 15, color: COLORS.textMuted, lineHeight: 22 },
  uploadSection: { marginBottom: 20 },
  emptyImageBox: {
    height: 280, borderRadius: 16, borderWidth: 2, borderStyle: "dashed",
    borderColor: COLORS.primary, backgroundColor: "#f0f9ff",
    justifyContent: "center", alignItems: "center", paddingHorizontal: 20,
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.white,
    justifyContent: "center", alignItems: "center", marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  emptyText: { marginTop: 12, color: COLORS.textDark, fontSize: 18, fontWeight: "700", textAlign: "center" },
  emptySubtext: { marginTop: 8, color: COLORS.textMuted, fontSize: 14, textAlign: "center", lineHeight: 20 },
  filledImageBox: {
    height: 280, borderRadius: 16, borderWidth: 1, borderColor: "#e5e5e5",
    backgroundColor: COLORS.white, overflow: "hidden", position: "relative",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  cameraIcon: {
    position: "absolute", top: 16, right: 16,
    backgroundColor: "rgba(0,0,0,0.7)", padding: 10, borderRadius: 24,
  },
  imageLabel: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(255,255,255,0.95)", flexDirection: "row",
    alignItems: "center", justifyContent: "center", paddingVertical: 12, gap: 8,
  },
  imageLabelText: { fontSize: 15, fontWeight: "600", color: COLORS.success },
  infoCard: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 20,
    borderLeftWidth: 4, borderLeftColor: COLORS.primary,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  infoHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  infoTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
  infoText: { fontSize: 14, color: COLORS.textMuted, lineHeight: 22, marginBottom: 16 },
  boldText: { fontWeight: "700", color: COLORS.textDark },
  tipsList: { gap: 10 },
  tipItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  tipText: { fontSize: 14, color: COLORS.textDark, fontWeight: "500" },
  stickyButton: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: "#e5e5e5",
    shadowColor: "#000", shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 5,
  },
  previewOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center", alignItems: "center" },
  previewImage: { width: "90%", height: "75%", resizeMode: "contain", borderRadius: 12 },
  closeButton: {
    position: "absolute", top: 50, right: 20,
    backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 24,
  },
});
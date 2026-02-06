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
  const { reservation, upsertItem } = useStorageReservation();
  const [preview, setPreview] = useState(null);

  // Request permissions before opening camera or gallery
  const requestPermissions = async (type) => {
    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take photos. Please enable it in your device settings.",
          [{ text: "OK" }]
        );
        return false;
      }
    } else if (type === "gallery") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Gallery permission is required to select photos. Please enable it in your device settings.",
          [{ text: "OK" }]
        );
        return false;
      }
    }
    return true;
  };

  // Prompt user to either pick from gallery or take a photo
  const pickImage = async (itemId) => {
    Alert.alert(
      "Select Image",
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
            });
            if (!result.canceled) updateItemImage(itemId, result.assets[0]);
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const hasPermission = await requestPermissions("gallery");
            if (!hasPermission) return;

            const result = await ImagePicker.launchImageLibraryAsync({
              quality: 0.7,
              allowsMultipleSelection: false,
              allowsEditing: true,
              aspect: [4, 3],
            });
            if (!result.canceled) updateItemImage(itemId, result.assets[0]);
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const updateItemImage = (itemId, image) => {
    const selectedItem = reservation.items.find((i) => i.id === itemId);
    if (!selectedItem) return;
    upsertItem({
      ...selectedItem,
      image,
    });
  };

  const proceed = () => {
    // Check if image exists AND has a uri
    const missingImages = reservation.items.some((i) => !i.image?.uri);
    if (missingImages) {
      Alert.alert(
        "Missing Images",
        "Please attach an image for every selected item.",
        [{ text: "OK" }]
      );
      return;
    }
    router.push("ReviewPay");
  };

  // Helper function to check if image is actually selected
  const hasValidImage = (item) => {
    return item.image && item.image.uri;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Images for Selected Items</Text>

      {reservation.items.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          {/* Product Name */}
          <Text style={styles.itemName}>{item.name}</Text>

          {/* Image Box */}
          {!hasValidImage(item) ? (
            // Empty state - dashed border with text
            <Pressable
              style={styles.emptyImageBox}
              onPress={() => pickImage(item.id)}
            >
              <Ionicons name="image-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Add an image of your {item.name}</Text>
              <Text style={styles.emptySubtext}>Tap to select or take a photo</Text>
            </Pressable>
          ) : (
            // Image selected - show image with camera icon overlay
            <Pressable
              style={styles.filledImageBox}
              onPress={() => setPreview(item.image.uri)}
            >
              <Image source={{ uri: item.image.uri }} style={styles.image} />
              {/* Top-right camera icon to change image */}
              <Pressable
                style={styles.cameraIcon}
                onPress={(e) => {
                  e.stopPropagation(); // Prevent triggering preview
                  pickImage(item.id);
                }}
              >
                <Ionicons name="camera" size={20} color={COLORS.white} />
              </Pressable>
            </Pressable>
          )}
        </View>
      ))}

            <View style={styles.stickyButton}>
        <BottomButton
          buttonText="Continue"
          onPressFunction={proceed}
        />
      </View>

      {/* Image Preview Modal */}
      <Modal visible={!!preview} transparent animationType="fade">
        <Pressable style={styles.previewOverlay} onPress={() => setPreview(null)}>
          <Image source={{ uri: preview }} style={styles.previewImage} />
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    color: COLORS.textDark,
  },
  itemCard: {
    marginBottom: 24,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    color: COLORS.textDark,
  },
  emptyImageBox: {
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.border || "#D1D5DB",
    backgroundColor: "transparent", // Changed from COLORS.background
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 12,
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  emptySubtext: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
  filledImageBox: {
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border || "#D1D5DB",
    backgroundColor: COLORS.background || "#F9FAFB",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cameraIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },
    stickyButton: {
    position: "absolute",
    bottom: 10,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    paddingTop: 10,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
    borderRadius: 12,
  },
});
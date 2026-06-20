import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";
import { Video } from "expo-av";
import { AddHubclippsContext } from "../../../context/AddHubclippsContext";
import { useRouter } from "expo-router";
import Button from "../../../components/ButtonComponents/ButtonComponent";
import { Ionicons } from "@expo/vector-icons";

export default function MediaScreen() {
  const isFocused = useIsFocused();
  const { draft, setDraft } = useContext(AddHubclippsContext);
  const router = useRouter();
  const [videoLoading, setVideoLoading] = useState(false);

  const videoRef = useRef(null);

  // Pause/play video when screen focus changes
  useEffect(() => {
    if (videoRef.current) {
      if (isFocused) {
        videoRef.current.playAsync?.();
      } else {
        videoRef.current.pauseAsync?.();
      }
    }
  }, [isFocused, draft.video_url]);

  // --- Image picker ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant photo library access to upload images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setDraft({ ...draft, front_image_url: result.assets[0].uri });
    }
  };

  // --- Video picker ---
  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant photo library access to upload videos.");
      return;
    }

    setVideoLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const videoAsset = result.assets[0];
      const duration = videoAsset.duration || 0;

      if (duration > 90000) {
        setVideoLoading(false);
        Alert.alert(
          "Video too long",
          "Please select or edit a video that is 1 minute 30 seconds or less."
        );
        return;
      }

      setDraft({ ...draft, video_url: videoAsset.uri });
    }
    setVideoLoading(false);
  };

  const removeImage = () => setDraft({ ...draft, front_image_url: null });
  const removeVideo = () => setDraft({ ...draft, video_url: null });

  // --- Validation ---
  const isFormValid = () => draft.front_image_url && draft.video_url;

  const handleContinue = () => {
    if (!isFormValid()) {
      Alert.alert(
        "Media missing",
        "Please upload both a front image and a room tour video to continue."
      );
      return;
    }
    router.push("/Preview");
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            High-quality media helps students get a real feel for your space and increases interest in your listing.
          </Text>
        </View>

        {/* Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Front image</Text>
          <Text style={styles.sectionHint}>
            Choose a clear, well-lit photo that showcases your hostel's front image (not the room).
          </Text>

          {!draft.front_image_url ? (
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage} activeOpacity={0.7}>
              <Ionicons name="image-outline" size={48} color="#DDDDDD" />
              <Text style={styles.uploadText}>Tap to upload image</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewContainer}>
              <Image source={{ uri: draft.front_image_url }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
                <Ionicons name="close-circle" size={28} color="#FF5A5F" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Video Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room tour video</Text>
          <View style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={20} color="#717171" />
            <Text style={styles.tipText}>
              Keep it under 1 minute 30 seconds. Show all facilities and ensure the room is tidy and well-presented.
            </Text>
          </View>

          {!draft.video_url ? (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={pickVideo}
              activeOpacity={0.7}
              disabled={videoLoading}
            >
              <Ionicons name="videocam-outline" size={48} color="#DDDDDD" />
              <Text style={styles.uploadText}>{videoLoading ? "Loading..." : "Tap to upload video"}</Text>
              <Text style={styles.uploadSubtext}>Maximum 1 minute 30 seconds</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewContainer}>
              <Video
                ref={videoRef}
                source={{ uri: draft.video_url }}
                style={styles.videoPreview}
                useNativeControls
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.removeButton} onPress={removeVideo}>
                <Ionicons name="close-circle" size={28} color="#FF5A5F" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Continue Button */}
      <View style={styles.stickyButton}>
        <Button
          buttonText="Continue"
          onPressFunction={handleContinue}
          variant={isFormValid() ? "default" : "inverted"}
          customStyle={{ opacity: isFormValid() ? 1 : 0.4 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  contentContainer: { padding: 24, paddingTop: 32 },
  header: { marginBottom: 32 },
  subtitle: { fontSize: 16, lineHeight: 24, color: "#717171" },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#222", marginBottom: 8 },
  sectionHint: { fontSize: 14, color: "#717171", marginBottom: 16, lineHeight: 20 },
  tipBox: { flexDirection: "row", backgroundColor: "#F7F7F7", padding: 12, borderRadius: 8, marginBottom: 16, alignItems: "flex-start" },
  tipText: { fontSize: 13, color: "#717171", flex: 1, marginLeft: 8, lineHeight: 18 },
  uploadBox: { borderWidth: 2, borderColor: "#DDDDDD", borderStyle: "dashed", borderRadius: 12, padding: 40, alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFA" },
  uploadText: { fontSize: 16, color: "#717171", marginTop: 12, fontWeight: "500" },
  uploadSubtext: { fontSize: 13, color: "#999", marginTop: 4 },
  previewContainer: { position: "relative", borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#E7E7E7" },
  imagePreview: { width: "100%", height: 240, resizeMode: "cover" },
  videoPreview: { width: "100%", height: 340 },
  removeButton: { position: "absolute", top: 12, right: 12, backgroundColor: "#fff", borderRadius: 14 },
  stickyButton: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 10, paddingBottom: 10, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#F0F0F0" },
});
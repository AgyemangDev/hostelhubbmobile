import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AddHubclippsContext } from "../../../context/AddHubclippsContext";
import PreviewHubClip from "../../../components/hubclipps/PreviewHubClip";

export default function Preview() {
  const router = useRouter();
  const { draft, clearDraft, createHubclipp } = useContext(AddHubclippsContext);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    // Validation
    if (!draft.video_url) {
      Alert.alert("Error", "Please upload a video before publishing");
      return;
    }

    if (!draft.front_image_url) {
      Alert.alert("Error", "Please upload a cover image before publishing");
      return;
    }

    if (!draft.hostel_name) {
      Alert.alert("Error", "Please provide a hostel name");
      return;
    }

    setIsPublishing(true);
    
    try {
      // Send draft as-is to backend - backend will handle compression
      const response = await createHubclipp.create(draft);

      if (!response) {
        throw new Error("Failed to publish HubClipp");
      }

      Alert.alert(
        "Success! 🎉",
        "Your HubClipp has been published successfully!",
        [
          {
            text: "OK",
            onPress: async () => {
              await clearDraft();
              router.replace("/(tabs)/(Hubclipps)");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Publishing error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to publish. Please try again."
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Preview */}
      <View style={styles.previewContainer}>
        <PreviewHubClip
          item={{
            id: "preview",
            video_url: draft.video_url,
            front_image_url: draft.front_image_url,
            hostel_name: draft.hostel_name,
            room_type: draft.room_type,
            category: draft.category,
            location: draft.location,
            institution: draft.institution,
            description: draft.description,
            amenities: draft.amenities,
            price: draft.price,
            likes: 0,
            views: 0,
          }}
          height="100%"
        />
      </View>

      {/* Bottom Publish Button */}
      <TouchableOpacity
        style={[styles.publishButton, isPublishing && styles.publishButtonDisabled]}
        onPress={handlePublish}
        disabled={isPublishing}
      >
        {isPublishing ? (
          <>
            <ActivityIndicator color="white" size="small" />
            <Text style={styles.publishButtonText}>Publishing...</Text>
          </>
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={18} color="white" />
            <Text style={styles.publishButtonText}>Publish HubClipp</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  previewContainer: { flex: 1 },
  publishButton: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#ff385c",
  },
  publishButtonDisabled: { opacity: 0.6 },
  publishButtonText: { 
    color: "white", 
    fontSize: 15, 
    fontWeight: "600", 
    marginLeft: 6 
  },
});
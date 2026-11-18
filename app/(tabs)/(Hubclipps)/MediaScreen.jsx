import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { AddHubclippsContext } from "../../../context/AddHubclippsContext";
import { Button, Notice, PickerTile, PriceBar, Section, StatusPill, StepHeader } from "../../../components/ui";
import { colors, radius, space, type } from "../../../constants/theme";

const MAX_VIDEO_MS = 90000; // 1 min 30 s



// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

export default function MediaScreen() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const { draft, setDraft } = useContext(AddHubclippsContext);
  const [videoLoading, setVideoLoading] = useState(false);
  const videoRef = useRef(null);

  // Pause the preview when the poster leaves this screen.
  useEffect(() => {
    if (!videoRef.current) return;
    if (isFocused) videoRef.current.playAsync?.();
    else videoRef.current.pauseAsync?.();
  }, [isFocused, draft.video_url]);

  const ensurePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow HostelHubb to use your photos in Settings.");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (!(await ensurePermission())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setDraft({ ...draft, front_image_url: result.assets[0].uri });
  };

  const pickVideo = async () => {
    if (!(await ensurePermission())) return;
    setVideoLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 0.8,
        allowsMultipleSelection: false,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if ((asset.duration || 0) > MAX_VIDEO_MS) {
        Alert.alert("Video too long", "Choose or trim a video to 1 minute 30 seconds or less.");
        return;
      }
      setDraft({ ...draft, video_url: asset.uri });
    } finally {
      setVideoLoading(false);
    }
  };

  const ready = Boolean(draft.front_image_url && draft.video_url);

  const handleContinue = () => {
    if (!ready) {
      Alert.alert("Add your photo and video", "Both a cover photo and a room tour video are needed.");
      return;
    }
    router.push("/Preview");
  };

  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <StepHeader step={3} total={4} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={type.display} accessibilityRole="header">Show students the room</Text>

        <Section gap={space.xs} title="Cover photo" hint="Shown before the video plays">
          {draft.front_image_url ? (
            <View>
              <Image source={{ uri: draft.front_image_url }} style={styles.photo} accessibilityLabel="Cover photo" />
              <StatusPill label="Added" tone="success" style={styles.pillOnMedia} />
              <View style={styles.mediaAction}>
                <Button title="Replace" variant="inverse" size="sm" onPress={pickImage} />
              </View>
            </View>
          ) : (
            <PickerTile icon="image-outline" title="Add a cover photo" subtitle="The front of the building works best" onPress={pickImage} />
          )}
        </Section>

        <Section gap={space.xs} title="Room tour video" hint="Up to 1 min 30 s">
          {draft.video_url ? (
            <View>
              <Video
                ref={videoRef}
                source={{ uri: draft.video_url }}
                style={styles.video}
                useNativeControls
                resizeMode="cover"
                isLooping
              />
              <View style={styles.mediaAction}>
                <Button title="Replace" variant="inverse" size="sm" onPress={pickVideo} />
              </View>
            </View>
          ) : (
            <PickerTile
              icon="videocam-outline"
              title="Add a room tour video"
              subtitle="From your gallery, 1 min 30 s or less"
              onPress={pickVideo}
              loading={videoLoading}
            />
          )}
        </Section>

        <Notice tone="info" title="Tips for a clip that gets booked">
          Film in daylight, hold the phone upright(vertically, not horizontally), and walk slowly: door, bed, bathroom, then the view outside.
        </Notice>
      </ScrollView>
      <PriceBar action={<Button title="Preview clip" onPress={handleContinue} disabled={!ready} />} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.xl, paddingBottom: space.xxl },
  drop: {
    height: 170,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dropIcon: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginBottom: space.xs },
  photo: { width: "100%", height: 190, borderRadius: radius.lg, backgroundColor: colors.fill },
  video: { width: "100%", height: 300, borderRadius: radius.lg, backgroundColor: "#000000" },
  pillOnMedia: { position: "absolute", top: space.sm, left: space.sm },
  mediaAction: { position: "absolute", right: space.sm, bottom: space.sm },
});

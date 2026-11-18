import React, { useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AddHubclippsContext } from "../../../context/AddHubclippsContext";
import PreviewHubClip from "../../../components/media/hubclipps/PreviewHubClip";
import { Button, ListRow, PriceBar, StepHeader } from "../../../components/ui";
import { colors, space, type } from "../../../constants/theme";

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

export default function Preview() {
  const router = useRouter();
  const { draft, clearDraft, createHubclipp } = useContext(AddHubclippsContext);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSubmit = async () => {
    if (!draft.video_url || !draft.front_image_url) {
      Alert.alert("Add your photo and video", "Go back one step to add them.");
      return;
    }
    if (!draft.hostel_name) {
      Alert.alert("Name missing", "Add the hostel or house name in room details.");
      return;
    }
    setIsPublishing(true);
    try {
      // Sent as-is; the backend compresses the media.
      const response = await createHubclipp.create(draft);
      if (!response) throw new Error(createHubclipp.error || "We couldn't submit your clip. Please try again.");
      await clearDraft();
      router.replace({ pathname: "/Submitted", params: { name: draft.hostel_name, room: draft.room_type, school: draft.institution } });
    } catch (error) {
      Alert.alert("Not submitted", error.message || "Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <StepHeader step={4} total={4} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={type.title} accessibilityRole="header">This is what students will see</Text>
        <PreviewHubClip item={{ ...draft, id: "preview" }} height={420} />
        <View>
          <ListRow title="Room details" subtitle={[draft.hostel_name, draft.room_type, draft.institution].filter(Boolean).join(" · ")} onPress={() => router.navigate("/AccommodationInfoScreen")} />
          <ListRow title="Contact and location" subtitle={draft.manager_or_porter_name} onPress={() => router.navigate("/ManagerInfoScreen")} />
          <ListRow title="Photo and video" onPress={() => router.navigate("/MediaScreen")} last />
        </View>
      </ScrollView>
      <PriceBar>
        <View style={{ flex: 1, gap: space.xs }}>
          <Text style={[type.caption, { color: colors.textSecondary, textAlign: "center" }]}>
            HostelHubb checks every clip before it goes live.
          </Text>
          <Button title={isPublishing ? "Uploading your clip…" : "Submit for review"} loading={isPublishing} onPress={handleSubmit} />
        </View>
      </PriceBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
});

import React, { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Button, ChipGroup, IconButton, Notice, PickerTile, ScreenHeader, Text, TextField, ToggleRow } from "../../components/ui";
import studentHub from "../../services/studentHub";
import { COMPLAINT_CATEGORIES } from "../../constants/complaints";
import { colors, radius, space } from "../../constants/theme";

const MAX_PHOTOS = 3;

/** Report a problem at the hostel for a paid booking. The owner gets a push. */
export default function NewComplaint() {
  const { bookingId, hostel } = useLocalSearchParams();
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [sending, setSending] = useState(false);

  const addPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { Alert.alert("Photos", "Allow photo access to attach a picture."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 1 });
    if (result.canceled) return;
    const small = await ImageManipulator.manipulateAsync(result.assets[0].uri, [{ resize: { width: 1200 } }], { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true });
    setPhotos((p) => [...p, { uri: small.uri, base64: small.base64 }].slice(0, MAX_PHOTOS));
  };

  const ok = category && title.trim().length >= 3 && description.trim().length >= 10;

  const submit = async () => {
    setSending(true);
    try {
      const { complaint } = await studentHub.createComplaint({
        booking_id: bookingId,
        category,
        title: title.trim(),
        description: description.trim(),
        priority: urgent ? "urgent" : "normal",
        images: photos.map((p) => `data:image/jpeg;base64,${p.base64}`),
      });
      router.replace(`/complaints/${complaint.id}`);
    } catch (e) {
      Alert.alert("Couldn't send", e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="Report a problem" subtitle={hostel} onBack={() => router.back()} backIcon="close" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ChipGroup title="What is it about?" options={COMPLAINT_CATEGORIES} value={category} onChange={setCategory} />
          <TextField label="Short title" value={title} onChangeText={setTitle} maxLength={120} placeholder="E.g. Shower in room 12 is broken" />
          <TextField label="What happened?" value={description} onChangeText={setDescription} multiline maxLength={2000} placeholder="Where it is, since when, and anything you've tried." />
          <View style={styles.photos}>
            <Text variant="bodyStrong">Photos (optional)</Text>
            <View style={styles.photoRow}>
              {photos.map((p, i) => (
                <View key={p.uri}>
                  <Image source={{ uri: p.uri }} style={styles.photo} />
                  <IconButton icon="close" variant="floating" size={14} style={styles.remove} onPress={() => setPhotos((list) => list.filter((_, j) => j !== i))} accessibilityLabel="Remove photo" />
                </View>
              ))}
              {photos.length < MAX_PHOTOS ? <PickerTile icon="camera-outline" title="Add" variant="compact" onPress={addPhoto} style={styles.photo} /> : null}
            </View>
          </View>
          <ToggleRow label="This is urgent" description="Safety, no water or no power. The hostel sees it marked urgent." value={urgent} onValueChange={setUrgent} />
          <Notice tone="info">The hostel gets a push notification. You'll be notified when they reply or update it.</Notice>
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Send to the hostel" loading={sending} disabled={!ok || !bookingId} onPress={submit} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: space.lg, gap: space.lg },
  photos: { gap: space.xs },
  photoRow: { flexDirection: "row", gap: space.xs, flexWrap: "wrap" },
  photo: { width: 88, height: 88, borderRadius: radius.md },
  remove: { position: "absolute", top: -10, right: -10 },
  footer: { padding: space.lg, paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
});

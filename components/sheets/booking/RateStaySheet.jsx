import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, IconButton, Sheet, Text, TextField } from "../../ui";
import studentHub from "../../../services/studentHub";
import { colors, space } from "../../../constants/theme";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/** Rate a paid stay (1–5 stars and a comment). Sending again edits the review. */
export default function RateStaySheet({ visible, onClose, bookingId, hostelName, existing, onSaved }) {
  const [rating, setRating] = useState(existing?.rating || 0);
  const [comment, setComment] = useState(existing?.comment || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) { setRating(existing?.rating || 0); setComment(existing?.comment || ""); }
  }, [visible, existing]);

  const save = async () => {
    setSaving(true);
    try {
      const { review } = await studentHub.saveReview({ booking_id: bookingId, rating, comment: comment.trim() });
      onSaved?.(review);
      onClose();
      Alert.alert("Thanks for your review", "It helps other students choose well.");
    } catch (e) {
      Alert.alert("Couldn't save", e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={existing ? "Edit your review" : `Rate ${hostelName || "your stay"}`} footer={<Button title="Post review" loading={saving} disabled={!rating} onPress={save} />}>
      <View style={styles.wrap}>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <IconButton key={n} icon={n <= rating ? "star" : "star-outline"} size={34} color={n <= rating ? colors.text : colors.borderStrong} onPress={() => setRating(n)} accessibilityLabel={`${n} star${n === 1 ? "" : "s"}`} />
          ))}
        </View>
        <Text variant="bodyStrong" style={styles.center}>{LABELS[rating] || "Tap a star"}</Text>
        <TextField label="Tell other students about it (optional)" value={comment} onChangeText={setComment} multiline maxLength={1500} placeholder="Rooms, water and power, security, the staff…" />
        <Text variant="caption" tone="secondary">Your first name and surname initial appear with your review. The hostel can reply in public.</Text>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md },
  stars: { flexDirection: "row", justifyContent: "center" },
  center: { textAlign: "center" },
});

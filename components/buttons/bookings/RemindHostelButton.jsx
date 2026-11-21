import React, { useState } from "react";
import { Alert } from "react-native";
import { Button } from "../../ui";
import studentHub from "../../../services/studentHub";

const clock = (value) => new Date(value).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" });

/**
 * Sends the hostel manager a push asking them to reply to this booking.
 * The server allows one reminder every 3 hours per booking.
 */
export default function RemindHostelButton({ bookingId, style }) {
  const [busy, setBusy] = useState(false);
  const [nextAt, setNextAt] = useState(null);
  const waiting = nextAt && new Date(nextAt).getTime() > Date.now();

  const remind = async () => {
    setBusy(true);
    try {
      const res = await studentHub.remindHostel(bookingId);
      setNextAt(res.next_at);
      Alert.alert("Reminder sent", "We've sent the hostel a notification asking them to reply to your booking.");
    } catch (e) {
      Alert.alert(e.code === "REMINDED_RECENTLY" ? "Already reminded" : "Couldn't send reminder", e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      title={waiting ? `Reminded · again after ${clock(nextAt)}` : "Remind hostel"}
      icon={waiting ? "checkmark-circle-outline" : "notifications-outline"}
      variant="tonal"
      size="sm"
      loading={busy}
      disabled={Boolean(waiting)}
      onPress={remind}
      style={style}
    />
  );
}

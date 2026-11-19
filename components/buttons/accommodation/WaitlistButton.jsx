import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { Button } from "../../ui";
import studentHub from "../../../services/studentHub";
import { auth } from "../../../lib/firebase/FirebaseConfig";
import { space } from "../../../constants/theme";

/**
 * Shown instead of Reserve when a hostel is full: join (or leave) its
 * waitlist. The student gets a push when the hostel opens a room.
 */
export default function WaitlistButton({ accommodationId }) {
  const [entry, setEntry] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    studentHub.waitlist()
      .then(({ entries }) => setEntry(entries.find((e) => e.accommodation_id === accommodationId) || null))
      .catch(() => {});
  }, [accommodationId]);

  const toggle = async () => {
    if (!auth.currentUser) {
      router.push("/(Client)");
      return;
    }
    setBusy(true);
    try {
      if (entry) {
        await studentHub.leaveWaitlist(entry.id);
        setEntry(null);
      } else {
        const res = await studentHub.joinWaitlist(accommodationId);
        setEntry(res.entry);
        Alert.alert("You're on the waitlist", "We'll send you a notification as soon as a room opens up.");
      }
    } catch (e) {
      Alert.alert("Couldn't update the waitlist", e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      title={entry ? "On the waitlist" : "Join waitlist"}
      icon={entry ? "checkmark" : "hourglass-outline"}
      variant={entry ? "secondary" : "primary"}
      loading={busy}
      onPress={toggle}
      style={{ paddingHorizontal: space.md }}
    />
  );
}

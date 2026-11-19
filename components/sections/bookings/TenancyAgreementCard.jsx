import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, CheckboxRow, Icon, Sheet, Text } from "../../ui";
import studentHub from "../../../services/studentHub";
import { space } from "../../../constants/theme";

/**
 * The tenancy agreement for a room booking: HostelHubb's terms plus the
 * hostel's rules. The student reads and accepts it before paying.
 * onChange(accepted) tells the pay screen whether payment can go ahead;
 * if the agreement can't be loaded, payment isn't blocked.
 */
export default function TenancyAgreementCard({ bookingId, onChange }) {
  const [state, setState] = useState({ loading: true, accepted: false, text: "" });
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    studentHub.agreement(bookingId)
      .then((res) => {
        if (!alive) return;
        setState({ loading: false, accepted: res.accepted, text: res.agreement?.agreement_text || "" });
        onChange?.(res.accepted);
      })
      .catch(() => {
        if (!alive) return;
        setState({ loading: false, accepted: true, text: "", unavailable: true });
        onChange?.(true);
      });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const accept = async (checked) => {
    if (!checked || state.accepted) return;
    setSaving(true);
    try {
      await studentHub.acceptAgreement(bookingId);
      setState((s) => ({ ...s, accepted: true }));
      onChange?.(true);
    } catch {
      // leave unticked; the student can try again
    } finally {
      setSaving(false);
    }
  };

  if (state.loading || state.unavailable) return null;

  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <Icon name="document-text-outline" size={22} tone="brand" />
        <View style={styles.flex}>
          <Text variant="bodyStrong">Tenancy agreement</Text>
          <Text variant="caption" tone="secondary">The hostel's rules and HostelHubb's terms for your stay.</Text>
        </View>
      </View>
      <Button title="Read the agreement" variant="secondary" size="sm" icon="eye-outline" onPress={() => setOpen(true)} />
      <CheckboxRow checked={state.accepted} disabled={state.accepted || saving} onChange={accept} label={state.accepted ? "You accepted this agreement" : "I've read and accept the tenancy agreement"} />
      <Sheet visible={open} onClose={() => setOpen(false)} title="Tenancy agreement" footer={!state.accepted ? <Button title="I accept" loading={saving} onPress={async () => { await accept(true); setOpen(false); }} /> : null}>
        <ScrollView style={styles.text}><Text>{state.text}</Text></ScrollView>
      </Sheet>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.sm },
  head: { flexDirection: "row", gap: space.sm, alignItems: "flex-start" },
  flex: { flex: 1, gap: 2 },
  text: { maxHeight: 420 },
});

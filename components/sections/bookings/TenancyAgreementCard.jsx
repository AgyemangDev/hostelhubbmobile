import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Icon, StatusPill, Text } from "../../ui";
import SignAgreementSheet from "../../sheets/booking/SignAgreementSheet";
import studentHub from "../../../services/studentHub";
import { space } from "../../../constants/theme";

/**
 * The tenancy agreement for a room booking: HostelHubb's terms plus the
 * hostel's rules, signed by both sides. The hostel signs when its manager
 * accepts the booking; the student signs here by typing their full name,
 * before paying.
 *
 * onChange(signed) tells the pay screen whether payment can go ahead. If the
 * agreement can't be loaded, payment isn't blocked.
 */
export default function TenancyAgreementCard({ bookingId, onChange }) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    studentHub.agreement(bookingId)
      .then((res) => {
        if (!alive) return;
        setData(res);
        onChange?.(Boolean(res.accepted));
      })
      .catch(() => {
        if (!alive) return;
        setData({ unavailable: true });
        onChange?.(true);
      });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const sign = async (signature) => {
    const res = await studentHub.acceptAgreement(bookingId, signature);
    setData(res);
    onChange?.(true);
  };

  if (!data || data.unavailable) return null;

  const hostel = data.parties?.hostel || {};
  const student = data.parties?.student || {};
  const signed = Boolean(data.accepted);
  const status = signed
    ? { label: "Signed", tone: "success" }
    : hostel.signed === false
      ? { label: "Waiting for hostel", tone: "neutral" }
      : { label: "Needs your signature", tone: "warning" };
  const body = signed
    ? `Signed by you and ${hostel.name || "the hostel"}. This is your binding agreement for the stay.`
    : hostel.signed === false
      ? "The hostel signs when it accepts your booking. You can sign after that."
      : `${hostel.signed_by || "The manager"} signed for ${hostel.name || "the hostel"} when they accepted. Read it and add your signature to pay.`;

  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <Icon name={signed ? "document-lock-outline" : "document-text-outline"} size={22} tone="brand" />
        <View style={styles.flex}>
          <Text variant="bodyStrong">Tenancy agreement</Text>
          <Text variant="caption" tone="secondary">{body}</Text>
        </View>
        <StatusPill label={status.label} tone={status.tone} />
      </View>
      <View style={styles.parties}>
        <View style={styles.party}>
          <Icon name={hostel.signed ? "checkmark-circle" : "ellipse-outline"} size={16} tone={hostel.signed ? "success" : "secondary"} />
          <Text variant="caption" numberOfLines={1} style={styles.flex}>Hostel</Text>
        </View>
        <View style={styles.party}>
          <Icon name={student.signed ? "checkmark-circle" : "ellipse-outline"} size={16} tone={student.signed ? "success" : "secondary"} />
          <Text variant="caption" numberOfLines={1} style={styles.flex}>You</Text>
        </View>
      </View>
      <Button
        title={signed ? "View signed agreement" : "Read and sign"}
        variant={signed ? "secondary" : "primary"}
        size="sm"
        icon={signed ? "eye-outline" : "create-outline"}
        disabled={!signed && hostel.signed === false}
        onPress={() => setOpen(true)}
      />
      <SignAgreementSheet visible={open} onClose={() => setOpen(false)} agreement={data.agreement} parties={data.parties} onSign={sign} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.sm },
  head: { flexDirection: "row", gap: space.sm, alignItems: "flex-start" },
  flex: { flex: 1, gap: 2 },
  parties: { flexDirection: "row", gap: space.md },
  party: { flex: 1, flexDirection: "row", alignItems: "center", gap: space.xs },
});

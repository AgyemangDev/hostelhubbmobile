import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button, CheckboxRow, Notice, Sheet, Text, TextField } from "../../ui";
import SignatureLine from "../../lists/bookings/SignatureLine";
import { colors, radius, space } from "../../../constants/theme";

/**
 * Read the tenancy agreement and sign it. The hostel has already signed by
 * accepting the booking; the student signs by typing their full name and
 * confirming it counts as their signature. Once signed, it shows the signed
 * copy with both signatures.
 */
export default function SignAgreementSheet({ visible, onClose, agreement, parties, onSign }) {
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const hostel = parties?.hostel || {};
  const student = parties?.student || {};
  const signed = Boolean(student.signed);
  const typed = name.replace(/\s+/g, " ").trim();
  const fullNameTyped = typed.split(" ").length >= 2 && typed.length >= 5;

  useEffect(() => {
    if (visible) { setName(""); setAgreed(false); setError(null); }
  }, [visible]);

  const sign = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSign(typed);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const footer = signed
    ? <Button title="Done" variant="secondary" onPress={onClose} />
    : <Button title="Sign agreement" icon="create-outline" loading={saving} disabled={!fullNameTyped || !agreed || hostel.signed === false} onPress={sign} />;

  return (
    <Sheet visible={visible} onClose={onClose} title={signed ? "Signed tenancy agreement" : "Read and sign"} footer={footer}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.paper}>
          <Text>{agreement?.agreement_text}</Text>
        </View>

        <Text variant="heading">Signatures</Text>
        <View>
          <SignatureLine
            role={`For ${hostel.name || "the hostel"}`}
            name={hostel.signed_by}
            signed={hostel.signed}
            signedAt={hostel.signed_at}
            pendingText="Signs when the manager accepts your booking"
          />
          <SignatureLine
            role="Resident"
            name={student.name}
            signedName={student.signed_name}
            signed={signed}
            signedAt={student.signed_at}
            pendingText="Your signature is needed before you pay"
            last
          />
        </View>

        {signed ? (
          <Notice tone="success" title="Signed by both parties">
            {agreement?.id ? `Agreement ${agreement.id}. ` : ""}HostelHubb keeps this signed copy, and the hostel can see it too. You can open it from your booking at any time.
          </Notice>
        ) : (
          <View style={styles.form}>
            <TextField
              label="Type your full name to sign"
              value={name}
              onChangeText={setName}
              placeholder={student.name || "First name and surname"}
              autoCapitalize="words"
              autoComplete="name"
              maxLength={120}
              hint="Use the name on your student ID."
            />
            {typed ? <Text style={styles.preview} numberOfLines={1}>{typed}</Text> : null}
            <CheckboxRow
              checked={agreed}
              onChange={setAgreed}
              label="I agree that typing my name is my electronic signature, and I accept this agreement and the hostel rules."
            />
            {error ? <Notice tone="danger">{error}</Notice> : null}
          </View>
        )}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  scroll: { maxHeight: 560 },
  content: { gap: space.md, paddingBottom: space.md },
  paper: { backgroundColor: colors.fill, borderRadius: radius.md, padding: space.md },
  form: { gap: space.sm },
  preview: { fontFamily: Platform.select({ ios: "Snell Roundhand", android: "cursive" }), fontSize: 26, lineHeight: 34, color: colors.text, paddingHorizontal: space.xs },
});

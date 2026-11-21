import React, { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import { UserContext } from "../../../context/UserContext";
import DateOfBirthField from "../../../components/forms/profile/DateOfBirthField";
import WhatsAppNumberField from "../../../components/forms/profile/WhatsAppNumberField";
import UniversityField from "../../../components/forms/profile/UniversityField";
import { normalizeGhanaPhone, whatsappError } from "../../../utils/phone";
import { Button, Card, Icon, Notice, SelectField, Text, TextField, KeyboardView } from "../../../components/ui";
import { colors, radius, space } from "../../../constants/theme";

const GENDER_OPTIONS = ["Male", "Female"];

const pick = (u) => ({
  first_name: u?.first_name ?? "",
  surname: u?.surname ?? "",
  phone_number: u?.phone_number ?? "",
  gender: u?.gender ?? "",
  institution: u?.institution ?? "",
});

function ReadOnlyRow({ icon, label, value, note }) {
  return (
    <View style={styles.readRow} accessible accessibilityLabel={`${label}: ${value || "not set"}${note ? `. ${note}` : ""}`}>
      <View style={styles.readIcon}>
        <Icon name={icon} size={18} tone="secondary" />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="caption" tone="secondary">{label}</Text>
        <Text variant="bodyStrong" numberOfLines={1}>{value || "Not set"}</Text>
        {note ? <Text variant="caption" tone="secondary">{note}</Text> : null}
      </View>
    </View>
  );
}

export default function PersonalInfo() {
  const { userInfo, patchUserData } = useContext(UserContext);
  const [form, setForm] = useState(() => pick(userInfo));
  const [dob, setDob] = useState(userInfo?.date_of_birth || null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dobLocked = Boolean(userInfo?.date_of_birth);
  // Gender can be added if it was skipped at sign-up, but not changed after.
  const genderLocked = Boolean(userInfo?.gender);

  // Keep the form in step with server pushes until the student starts typing.
  const original = useMemo(() => pick(userInfo), [userInfo]);
  const dirty =
    Object.keys(original).some((k) => (form[k] || "").trim() !== (original[k] || "").trim()) ||
    (!dobLocked && Boolean(dob));

  useEffect(() => {
    if (!dirty) setForm(pick(userInfo));
    if (userInfo?.date_of_birth) setDob(userInfo.date_of_birth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: null, submit: null }));
    setSaved(false);
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "First name is required.";
    if (!form.surname.trim()) e.surname = "Surname is required.";
    const phoneProblem = whatsappError(form.phone_number);
    if (phoneProblem) e.phone_number = phoneProblem;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    setSaving(true);
    try {
      await patchUserData({
        first_name: form.first_name.trim(),
        surname: form.surname.trim(),
        phone_number: normalizeGhanaPhone(form.phone_number),
        ...(form.institution.trim() ? { institution: form.institution.trim() } : {}),
        ...(!genderLocked && form.gender ? { gender: form.gender } : {}),
        ...(!dobLocked && dob ? { date_of_birth: dob } : {}),
      });
      setSaved(true);
    } catch (err) {
      setErrors({ submit: err.message || "Couldn't save your changes. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (!validate()) return;
    if (!dobLocked && dob) {
      Alert.alert("Save your date of birth?", "You won't be able to change it after this.", [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: save },
      ]);
      return;
    }
    save();
  };

  const name = `${form.first_name} ${form.surname}`.trim();

  return (
    <View style={styles.screen}>
      <KeyboardView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={{ gap: 4 }}>
            <Text variant="display" accessibilityRole="header">Personal info</Text>
            <Text tone="secondary">
              {name ? `This is how hostels and drivers see you, ${form.first_name}.` : "This is how hostels and drivers see you."}
            </Text>
          </View>

          <Card style={styles.card}>
            <Text variant="heading">Your details</Text>
            <TextField label="First name" value={form.first_name} onChangeText={set("first_name")} autoCapitalize="words" textContentType="givenName" error={errors.first_name} />
            <TextField label="Surname" value={form.surname} onChangeText={set("surname")} autoCapitalize="words" textContentType="familyName" error={errors.surname} />
            <WhatsAppNumberField value={form.phone_number} onChangeText={set("phone_number")} error={errors.phone_number} />
            <UniversityField label="University" value={form.institution} onChange={set("institution")} hint="Helps us show hostels near your campus." />
            {genderLocked ? null : (
              <SelectField label="Gender (optional)" options={GENDER_OPTIONS} value={form.gender} onChange={set("gender")} placeholder="Select gender" />
            )}
          </Card>

          <Card style={styles.card}>
            <Text variant="heading">Account</Text>
            <ReadOnlyRow icon="mail-outline" label="Email" value={userInfo?.email} note="Used to sign in" />
            {genderLocked ? <ReadOnlyRow icon="person-outline" label="Gender" value={userInfo?.gender} /> : null}
            <DateOfBirthField
              value={dob}
              locked={dobLocked}
              onChange={(v) => { setDob(v); setSaved(false); }}
              hint={dobLocked ? "Can't be changed. Contact support if it's wrong." : "Add it once — it can't be changed later."}
            />
          </Card>

          {errors.submit ? <Notice tone="danger">{errors.submit}</Notice> : null}
          {saved && !dirty ? <Notice tone="success" icon="checkmark-circle-outline">Your details are saved.</Notice> : null}

          {/* Inline, not a bottom bar: the tab bar is still showing on this screen. */}
          <Button title={saving ? "Saving…" : "Save changes"} onPress={handleSave} loading={saving} disabled={!dirty || saving} />
        </ScrollView>
      </KeyboardView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceSunken },
  // Extra bottom room so the floating WhatsApp button never covers Save.
  content: { padding: space.lg, gap: space.lg, paddingBottom: 120 },
  card: { gap: space.md },
  readRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  readIcon: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.fill, alignItems: "center", justifyContent: "center" },
});

import React, { useState, useContext } from "react";
import { Alert, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext";
import DateOfBirthField, { formatDob } from "../../components/forms/profile/DateOfBirthField";
import { Button, Notice, SelectField, TextField } from "../../components/ui";
import { colors, space, type } from "../../constants/theme";

const GENDER_OPTIONS = ["Male", "Female"];

const ProfileUpdate = () => {
  const router = useRouter();
  const { patchUserData, userInfo } = useContext(UserContext);

  const [firstName, setFirstName] = useState(userInfo?.first_name || "");
  const [surname, setSurname] = useState(userInfo?.surname || "");
  const [phone, setPhone] = useState(userInfo?.phone_number || "");
  const [gender, setGender] = useState(userInfo?.gender || "");
  const [dob, setDob] = useState(userInfo?.date_of_birth || null);
  // Existing students who already saved a date of birth can't change it here either.
  const dobLocked = Boolean(userInfo?.date_of_birth);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const clear = (key) => setErrors((p) => ({ ...p, [key]: null, submit: null }));

  // ─── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!surname.trim()) e.surname = "Surname is required.";
    if (!phone.trim()) e.phone = "Phone number is required.";
    if (!dob) e.dob = "Date of birth is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const save = async () => {
    setLoading(true);
    try {
      await patchUserData({
        first_name: firstName.trim(),
        surname: surname.trim(),
        phone_number: phone.trim(),
        ...(gender ? { gender } : {}),
        ...(!dobLocked && dob ? { date_of_birth: dob } : {}),
      });
      router.replace("/(tabs)");
    } catch (err) {
      setErrors({ submit: err.message || "Failed to save. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!validate()) return;
    if (dobLocked) return save();
    // Date of birth is permanent, so double-check it before it's saved.
    Alert.alert(
      "Is your date of birth right?",
      `${formatDob(dob)}\n\nYou won't be able to change it later.`,
      [
        { text: "Edit", style: "cancel" },
        { text: "Yes, save", onPress: save },
      ]
    );
  };

  // ─── UI ────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={type.display} accessibilityRole="header">Complete your profile</Text>
            <Text style={[type.body, { color: colors.textSecondary }]}>
              We need a few details before you can continue.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField
              label="First name"
              placeholder="First name"
              value={firstName}
              autoCapitalize="words"
              textContentType="givenName"
              error={errors.firstName}
              onChangeText={(v) => { setFirstName(v); clear("firstName"); }}
            />
            <TextField
              label="Surname"
              placeholder="Surname"
              value={surname}
              autoCapitalize="words"
              textContentType="familyName"
              error={errors.surname}
              onChangeText={(v) => { setSurname(v); clear("surname"); }}
            />
            <TextField
              label="Phone number"
              placeholder="e.g. 024 123 4567"
              value={phone}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              error={errors.phone}
              onChangeText={(v) => { setPhone(v); clear("phone"); }}
            />
            <DateOfBirthField
              value={dob}
              locked={dobLocked}
              error={errors.dob}
              hint={dobLocked ? "Already saved. Contact support if it's wrong." : "We'll send you something on your birthday. This can't be changed later."}
              onChange={(v) => { setDob(v); clear("dob"); }}
            />
            <SelectField
              label="Gender (optional)"
              options={GENDER_OPTIONS}
              value={gender}
              onChange={(v) => setGender(v)}
              placeholder="Select gender"
            />

            {errors.submit ? <Notice tone="danger">{errors.submit}</Notice> : null}

            <Button title="Save & continue" onPress={handleSave} loading={loading} style={{ marginTop: space.xs }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileUpdate;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  container: { flexGrow: 1, paddingHorizontal: space.xl, paddingTop: space.xxl, paddingBottom: space.xxl },
  header: { gap: space.xs, marginBottom: space.xl },
  form: { gap: space.md },
});

import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext";
import CustomInput from "../../components/InputFields/CustomInput";
import CustomDropdown from "../../components/Dropdowns/CustomDropdown";
import COLORS from "../../constants/Colors";

const GENDER_OPTIONS = ["Male", "Female"];

const ProfileUpdate = () => {
  const router = useRouter();
  const { patchUserData, userInfo } = useContext(UserContext);

  const [firstName, setFirstName]     = useState(userInfo?.first_name  || "");
  const [surname,   setSurname]       = useState(userInfo?.surname      || "");
  const [phone,     setPhone]         = useState(userInfo?.phone_number || "");
  const [gender,    setGender]        = useState(userInfo?.gender       || "");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  // ─── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!surname.trim())   e.surname   = "Surname is required.";
    if (!phone.trim())     e.phone     = "Phone number is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await patchUserData({
        first_name:   firstName.trim(),
        surname:      surname.trim(),
        phone_number: phone.trim(),
        ...(gender ? { gender } : {}),
      });
      router.replace("/(tabs)");
    } catch (err) {
      setErrors({ submit: err.message || "Failed to save. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ─── UI ────────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>
            We need a few details before you can continue.
          </Text>
        </View>

        {/* Fields */}
        <View style={styles.form}>

          <Text style={styles.label}>First Name</Text>
          <CustomInput
            placeholder="First name"
            value={firstName}
            onChangeText={(v) => { setFirstName(v); setErrors((p) => ({ ...p, firstName: null })); }}
          />
          {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}

          <Text style={styles.label}>Surname</Text>
          <CustomInput
            placeholder="Surname"
            value={surname}
            onChangeText={(v) => { setSurname(v); setErrors((p) => ({ ...p, surname: null })); }}
          />
          {errors.surname && <Text style={styles.error}>{errors.surname}</Text>}

          <Text style={styles.label}>Phone Number</Text>
          <CustomInput
            placeholder="Phone number"
            value={phone}
            onChangeText={(v) => { setPhone(v); setErrors((p) => ({ ...p, phone: null })); }}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

          <Text style={styles.label}>Gender (optional)</Text>
          <CustomDropdown
            data={GENDER_OPTIONS}
            selectedValue={gender}
            onSelect={(v) => setGender(v)}
            placeholder="Select gender"
            visible={dropdownVisible}
            onPress={() => setDropdownVisible((p) => !p)}
          />

          {errors.submit && (
            <Text style={[styles.error, styles.submitError]}>{errors.submit}</Text>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Save & Continue</Text>
            }
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileUpdate;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.background,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  form: {
    gap: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.background,
    marginBottom: 6,
    marginLeft: 4,
  },
  error: {
    fontSize: 12,
    color: "#c0392b",
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 4,
  },
  submitError: {
    textAlign: "center",
    marginTop: 4,
    marginBottom: 0,
  },
  button: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WhatsAppNumberField from "../../forms/profile/WhatsAppNumberField";
import { Button, Icon, Notice, Text } from "../../ui";
import { normalizeGhanaPhone, whatsappError } from "../../../utils/phone";
import { colors, space } from "../../../constants/theme";

/**
 * Shown to signed-in students whose WhatsApp number is missing or not in a
 * valid Ghana format. It can't be dismissed: the team needs a way to reach
 * every student about their bookings and orders.
 */
export default function WhatsAppRequiredModal({ visible, currentNumber, onSave }) {
  const [value, setValue] = useState(currentNumber || "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const problem = whatsappError(value);
    if (problem) return setError(problem);
    setSaving(true);
    setError(null);
    try {
      await onSave(normalizeGhanaPhone(value));
    } catch (err) {
      setError(err.message || "Couldn't save your number. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent onRequestClose={() => {}}>
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.badge}>
              <Icon name="logo-whatsapp" size={34} color={colors.whatsapp} />
            </View>
            <Text variant="display" accessibilityRole="header">Add your WhatsApp number</Text>
            <Text tone="secondary">
              We use WhatsApp to reach you about your bookings, storage and transport. Enter the number you use on WhatsApp.
            </Text>
            {currentNumber ? (
              <Notice tone="warning" title="Please check your number">
                {`"${currentNumber}" isn't a valid WhatsApp number. Use 10 digits starting with 0, or +233 followed by 9 digits.`}
              </Notice>
            ) : null}
            <WhatsAppNumberField value={value} onChangeText={(v) => { setValue(v); setError(null); }} error={error} />
          </ScrollView>
          <View style={styles.footer}>
            <Button title="Save and continue" onPress={save} loading={saving} disabled={saving} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: space.xl, paddingTop: space.xxl, gap: space.md },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.xs,
  },
  footer: { paddingHorizontal: space.xl, paddingBottom: space.lg, paddingTop: space.sm },
});

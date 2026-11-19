import React, { useState } from "react";
import { View } from "react-native";
import UniversityField from "../../forms/profile/UniversityField";
import { Button, Sheet, Text } from "../../ui";
import { space } from "../../../constants/theme";

/** Occasional ask for students who haven't said which school they attend. */
export default function UniversityPromptSheet({ visible, onSave, onDismiss }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!value.trim()) return setError("Choose your university, or type it if it isn't listed.");
    setSaving(true);
    try {
      await onSave(value.trim());
    } catch (err) {
      setError(err.message || "Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet
      visible={visible}
      onClose={onDismiss}
      title="Which school do you attend?"
      footer={
        <View style={{ gap: space.sm }}>
          <Button title="Save" onPress={save} loading={saving} disabled={saving} />
          <Button title="Not now" variant="ghost" onPress={onDismiss} />
        </View>
      }
    >
      <View style={{ gap: space.md }}>
        <Text tone="secondary">We'll show you hostels near your campus and let you know when we launch new services there.</Text>
        <UniversityField value={value} onChange={(v) => { setValue(v); setError(null); }} error={error} />
      </View>
    </Sheet>
  );
}

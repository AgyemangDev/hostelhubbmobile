import React, { useContext } from "react";
import { ScrollView, StyleSheet, Alert, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { AddHubclippsContext } from "../../../context/AddHubclippsContext";

import FloatingLabelInput from "../../../components/InputFields/FormInput";
import Button from "../../../components/ButtonComponents/ButtonComponent";
import { validateManager } from "../../../utils/ValidationUtils/hubbclipsValidation";

export default function ManagerInfoScreen() {
  const router = useRouter();
  const { draft, setDraft } = useContext(AddHubclippsContext);

  const handleContinue = () => {
    const errors = validateManager(draft);
    if (errors.length > 0) {
      Alert.alert("Incomplete Form", errors[0]);
      return;
    }
    router.push("/MediaScreen");
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      draft.manager_or_porter_name &&
      draft.manager_or_porter_contact &&
      draft.latitude &&
      draft.longitude
    );
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Provide accurate manager details for verification purposes. This helps maintain trust in our community.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <FloatingLabelInput
            placeholder="Manager Name"
            value={draft.manager_or_porter_name}
            onChangeText={(val) =>
              setDraft({ ...draft, manager_or_porter_name: val })
            }
          />

          <FloatingLabelInput
            placeholder="Manager Contact"
            value={draft.manager_or_porter_contact}
            onChangeText={(val) =>
              setDraft({ ...draft, manager_or_porter_contact: val })
            }
            keyboardType="phone-pad"
          />

          <FloatingLabelInput
            placeholder="Latitude"
            value={draft.latitude?.toString() || ""}
            onChangeText={(val) => {
              if (val === "" || val === "-" || val === "." || val === "-.") {
                setDraft({ ...draft, latitude: val });
              } else {
                const parsed = parseFloat(val);
                if (!isNaN(parsed)) setDraft({ ...draft, latitude: val });
              }
            }}
            keyboardType="decimal-pad"
          />

          <FloatingLabelInput
            placeholder="Longitude"
            value={draft.longitude?.toString() || ""}
            onChangeText={(val) => {
              if (val === "" || val === "-" || val === "." || val === "-.") {
                setDraft({ ...draft, longitude: val });
              } else {
                const parsed = parseFloat(val);
                if (!isNaN(parsed)) setDraft({ ...draft, longitude: val });
              }
            }}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Button */}
      <View style={styles.stickyButton}>
        <Button
          buttonText="Continue"
          onPressFunction={handleContinue}
          variant={isFormValid() ? "default" : "inverted"}
          customStyle={{ opacity: isFormValid() ? 1 : 0.4 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#717171",
  },
  formSection: {
    gap: 16,
  },
  stickyButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
});
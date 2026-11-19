import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon, Text } from "../../ui";
import { openStoreListing, versionLabel } from "../../../utils/appStore";
import { colors, space } from "../../../constants/theme";

const DEFAULT_MESSAGE =
  "This version of HostelHubb is no longer supported. Update to keep booking hostels, storage and transport.";

/**
 * Full-screen block shown when this build is below the dashboard's minimum.
 * It can't be dismissed (the Android back button does nothing); the only way
 * forward is the store.
 */
export default function UpdateRequiredScreen({ visible, message }) {
  const version = versionLabel();
  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.body}>
          <View style={styles.badge}>
            <Icon name="cloud-download-outline" size={36} tone="brand" />
          </View>
          <Text variant="display" style={styles.center} accessibilityRole="header">
            Time to update
          </Text>
          <Text tone="secondary" style={styles.center}>{message || DEFAULT_MESSAGE}</Text>
        </View>
        <View style={styles.footer}>
          <Button title="Update now" onPress={openStoreListing} />
          {version ? (
            <Text variant="caption" tone="muted" style={styles.center}>You have v{version}</Text>
          ) : null}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface, paddingHorizontal: space.xl },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: space.md },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.sm,
  },
  center: { textAlign: "center" },
  footer: { gap: space.sm, paddingBottom: space.lg },
});

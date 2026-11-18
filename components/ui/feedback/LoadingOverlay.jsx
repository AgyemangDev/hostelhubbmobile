import React from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import Text from "../typography/Text";
import { colors, radius, space } from "../../../constants/theme";

/** Full-screen blocking spinner while something can't be interrupted ("Processing payment…"). Paper Modal + ActivityIndicator. */
export default function LoadingOverlay({ visible = false, message = "Processing payment..." }) {
  return (
    <Portal>
      <Modal visible={visible} dismissable={false} contentContainerStyle={styles.box}>
        <ActivityIndicator size="large" color={colors.textInverse} />
        {message ? <Text variant="bodyStrong" tone="inverse" style={styles.text}>{message}</Text> : null}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  box: { alignSelf: "center", backgroundColor: "rgba(0,0,0,0.75)", padding: space.xl, borderRadius: radius.lg, alignItems: "center", gap: space.sm },
  text: { textAlign: "center" },
});

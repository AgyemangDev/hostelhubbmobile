import React from "react";
import { View } from "react-native";
import { Button, Sheet, Text } from "../../ui";
import { openStoreListing } from "../../../utils/appStore";
import { space } from "../../../constants/theme";

const DEFAULT_MESSAGE = "A newer version of HostelHubb is ready, with fixes and improvements.";

/** Dismissible prompt for builds below the dashboard's latest build. */
export default function UpdateAvailableSheet({ visible, message, onDismiss }) {
  const update = () => {
    onDismiss();
    openStoreListing();
  };
  return (
    <Sheet
      visible={visible}
      onClose={onDismiss}
      title="Update available"
      footer={
        <View style={{ gap: space.sm }}>
          <Button title="Update now" onPress={update} />
          <Button title="Not now" variant="ghost" onPress={onDismiss} />
        </View>
      }
    >
      <Text tone="secondary">{message || DEFAULT_MESSAGE}</Text>
    </Sheet>
  );
}

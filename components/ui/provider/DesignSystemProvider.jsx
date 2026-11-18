import React from "react";
import { PaperProvider } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { paperTheme } from "../../../constants/paperTheme";

/**
 * Icons in every Paper component take Ionicons names (the set the app
 * already uses, e.g. "chevron-back"). Paper's own internal icons use
 * Material Community names ("check", "close-circle"), so anything that is
 * not an Ionicon falls back to that set.
 */
function AppIcon({ name, color, size, testID }) {
  if (typeof name === "string" && Ionicons.glyphMap[name] !== undefined) {
    return <Ionicons name={name} color={color} size={size} testID={testID} />;
  }
  return <MaterialCommunityIcons name={name} color={color} size={size} testID={testID} />;
}

const settings = { icon: (props) => <AppIcon {...props} /> };

/** Wraps the app once so every ui/ component gets the HostelHubb Paper theme. */
export default function DesignSystemProvider({ children }) {
  return (
    <PaperProvider theme={paperTheme} settings={settings}>
      {children}
    </PaperProvider>
  );
}

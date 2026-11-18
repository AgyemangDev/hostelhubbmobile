import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { Button } from "../../ui";
import { colors, radius, space } from "../../../constants/theme";

const logo = (source) => () => <Image source={source} style={styles.logo} />;
const GOOGLE = logo(require("../../../assets/icons/google.png"));
const APPLE = logo(require("../../../assets/icons/apple.png"));

/** "Continue with Google" and, on iOS, "Continue with Apple". */
export default function SocialAuthButtons({ onGooglePress, onApplePress, googleLoading, appleLoading }) {
  return (
    <View style={styles.container}>
      <Button title="Continue with Google" variant="secondary" icon={GOOGLE} loading={googleLoading} onPress={onGooglePress} style={styles.pill} />
      {Platform.OS === "ios" ? (
        <Button title="Continue with Apple" variant="secondary" icon={APPLE} loading={appleLoading} onPress={onApplePress} style={styles.pill} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", gap: space.sm },
  pill: { borderRadius: radius.pill, borderColor: colors.border },
  logo: { width: 22, height: 22, resizeMode: "contain" },
});

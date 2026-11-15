import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import COLORS from "../../constants/Colors";

const SocialAuthButtons = ({
  onGooglePress,
  onApplePress,
  googleLoading,
  appleLoading,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onGooglePress}
        disabled={googleLoading}   // ← removed !googleRequest
        activeOpacity={0.75}
      >
        {googleLoading ? (
          <ActivityIndicator size="small" color={COLORS.background} />
        ) : (
          <>
            <Image
              source={require("../../assets/icons/google.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      {Platform.OS === "ios" && (
        <TouchableOpacity
          style={styles.button}
          onPress={onApplePress}
          disabled={appleLoading}
          activeOpacity={0.75}
        >
          {appleLoading ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <>
              <Image
                source={require("../../assets/icons/apple.png")}
                style={styles.icon}
              />
              <Text style={styles.text}>Continue with Apple</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border ?? "#E5E5E5",
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.background,
  },
});

export default SocialAuthButtons;
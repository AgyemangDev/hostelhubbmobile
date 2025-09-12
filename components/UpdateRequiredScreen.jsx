import React from "react";
import {
  View,
  Text,
  Linking,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";

const UpdateRequiredScreen = () => {
  const handleUpdate = () => {
    const storeUrl =
      Platform.OS === "ios"
        ? "https://apps.apple.com/us/app/hostelhubb/id6738483533"
        : "https://play.google.com/store/apps/details?id=com.Hostelhubb.Hostelhubb";

    Linking.openURL(storeUrl).catch((err) =>
      console.error("Failed to open store link:", err)
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/Update.gif")} // Use your own custom image or icon
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Update Required</Text>
      <Text style={styles.message}>
        A new version of Hostelhubb is available. To continue, please update the app from the store.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateRequiredScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#e11d48",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

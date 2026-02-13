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
import Constants from 'expo-constants';

const UpdateRequiredScreen = ({ minimumVersion }) => {
  const currentVersion = Constants.expoConfig?.version || 'Unknown';
  
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
        source={require("../assets/images/Update.gif")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Update Required</Text>
      <Text style={styles.message}>
        A new version of Hostelhubb is available. To continue using the app, please update to the latest version from the store.
      </Text>
      
      {/* Version Info */}
      <View style={styles.versionContainer}>
        <View style={styles.versionRow}>
          <Text style={styles.versionLabel}>Current Version:</Text>
          <Text style={styles.versionValue}>{currentVersion}</Text>
        </View>
        {minimumVersion && (
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Required Version:</Text>
            <Text style={styles.versionValueRequired}>{minimumVersion}+</Text>
          </View>
        )}
      </View>

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
    marginBottom: 24,
    lineHeight: 22,
  },
  versionContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    width: '100%',
    maxWidth: 300,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  versionLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: '500',
  },
  versionValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: '600',
  },
  versionValueRequired: {
    fontSize: 14,
    color: "#e11d48",
    fontWeight: '700',
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
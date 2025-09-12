import { View, Text, Image, StyleSheet } from "react-native";
import { ExternalLink } from "@/components/ExternalLink";
import COLORS from "../../../../constants/Colors";

export default function CinePlus() {
  return (
    <View style={styles.container}>
      {/* Banner Image */}
      <Image
  source={{
    uri: "https://s.marketwatch.com/public/resources/images/MW-HW945_stream_ZG_20191213153931.jpg",
  }}
        style={styles.banner}
      />

      {/* Welcome Message */}
      <Text style={styles.title}>Enjoy Your Movies</Text>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          To continue enjoying movies, kindly use the link below and click on{" "}
          <Text style={styles.boldText}>"Get App."</Text>
        </Text>
        <Text style={styles.instructionsText}>
          Select the option that best suits your device. If you encounter any
          issues, refresh the page and watch a single ad to proceed.
        </Text>
        <Text style={styles.instructionsText}>
          For further assistance, reach out to{" "}
          <Text style={styles.boldText}>HOSTELHUBB</Text> via the contact page.
        </Text>
      </View>

      {/* Full-Width External Link Button */}
      <ExternalLink href="https://iosmirror.cc/">
        <View style={styles.button}>
          <Text style={styles.buttonText}>Start Watching</Text>
        </View>
      </ExternalLink>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff", // White background for a clean look
    justifyContent: "center", // Center all content vertically
    alignItems: "center", // Center all content horizontally
  },
  banner: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  instructionsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    width: "100%", // Ensure the container spans the full width
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  instructionsText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%", // Full width
    alignItems: "center", // Center text within the button
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

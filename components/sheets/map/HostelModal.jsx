import { StyleSheet, View, Text, Image, TouchableOpacity, Linking, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Button, IconButton } from "../../ui";
import { colors } from "../../../constants/theme";

const { width } = Dimensions.get("window");

const HostelModal = ({ hostel, onClose }) => {
  const router = useRouter();

  const openInMaps = () => {
    const { latitude, longitude } = hostel;
    if (!latitude || !longitude) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const hasLocation = hostel.latitude && hostel.longitude
    && hostel.latitude !== 0 && hostel.longitude !== 0;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

      <View style={styles.card}>
        <View style={styles.handle} />

        {/* Full-bleed image with gradient */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: hostel.frontImage }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.82)"]}
            style={StyleSheet.absoluteFill}
          />

          {/* Close button */}
          <IconButton icon="close" variant="onVideo" size={18} accessibilityLabel="Close" onPress={onClose} style={styles.closeBtn} />

          {/* Text overlaid on image */}
          <View style={styles.imageContent}>
            <Text style={styles.name} numberOfLines={2}>{hostel.hostelName}</Text>

            <View style={styles.badgeRow}>
              {hasLocation ? (
                <Button title="Open in Maps" icon="location" variant="inverse" size="sm" compact onPress={openInMaps} style={{ alignSelf: "flex-start" }} />
              ) : (
                <View style={[styles.badge, styles.badgeDisabled]}>
                  <MaterialIcons name="location-off" size={13} color="rgba(255,255,255,0.5)" />
                  <Text style={[styles.badgeText, { color: "rgba(255,255,255,0.5)" }]}>
                    Location unavailable
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* CTA */}
        <Button
          title="Explore This Place"
          icon="chevron-forward"
          iconPosition="right"
          onPress={() => router.push({ pathname: "/hostel/[id]", params: { id: hostel.id } })}
          style={styles.detailsBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.fill,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 14,
  },
  imageWrapper: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    height: 210,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  closeBtn: { position: "absolute", top: 12, right: 12 },
  imageContent: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textInverse,
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.2,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  badgeDisabled: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.15)",
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: "600",
  },
  detailsBtn: { marginHorizontal: 16, marginTop: 14 },
  detailsBtnText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default HostelModal;
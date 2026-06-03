import { StyleSheet, View, Text, Image, TouchableOpacity, Linking, Platform, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../../constants/Colors";

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
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <MaterialIcons name="close" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Text overlaid on image */}
          <View style={styles.imageContent}>
            <Text style={styles.name} numberOfLines={2}>{hostel.hostelName}</Text>

            <View style={styles.badgeRow}>
              {hasLocation ? (
                <TouchableOpacity style={styles.badge} onPress={openInMaps}>
                  <MaterialIcons name="location-on" size={13} color="#fff" />
                  <Text style={styles.badgeText}>Open in Maps</Text>
                </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.detailsBtn}
          activeOpacity={0.88}
          onPress={() =>
            router.push({
              pathname: "/(Details)/[id]",
              params: { hostelId: hostel.id },
            })
          }
        >
          <Text style={styles.detailsBtnText}>Explore This Place</Text>
          <MaterialIcons name="arrow-forward-ios" size={15} color="#fff" />
        </TouchableOpacity>
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
    backgroundColor: "#fff",
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
    backgroundColor: "#E5E7EB",
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
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContent: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
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
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    elevation: 4,
    shadowColor: COLORS.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  detailsBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default HostelModal;
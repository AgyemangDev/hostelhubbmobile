import { StyleSheet, View, Text, Image, TouchableOpacity, Linking, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from "../../constants/Colors";

const HostelModal = ({ hostel, onClose }) => {
  const router = useRouter();

  const openInMaps = () => {
    const { latitude, longitude, hostelName } = hostel;
    if (!latitude || !longitude) return;

    const label = encodeURIComponent(hostelName || "Location");
    const url = Platform.select({
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });

    Linking.openURL(url);
  };

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      
      {/* Modal Card */}
      <View style={styles.card}>
        {/* Drag Handle */}
        <View style={styles.handle} />

        {/* Image with Gradient Overlay */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: hostel.frontImage }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          />
          <View style={styles.imageContent}>
            <Text style={styles.name}>{hostel.hostelName}</Text>
            <TouchableOpacity style={styles.locationBtn} onPress={openInMaps}>
              <MaterialIcons name="location-on" size={16} color="#fff" />
              <Text style={styles.locationText}>View on map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() =>
            router.push({
              pathname: "/(Details)/[id]",
              params: { hostelId: hostel.id },
            })
          }
        >
          <Text style={styles.detailsBtnText}>Explore This Place</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  imageWrapper: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  imageContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: 1,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
    backdropFilter: "blur(10px)",
  },
  locationText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HostelModal;
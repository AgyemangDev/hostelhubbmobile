import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { MapPin, ArrowRight, Package } from "lucide-react-native";
import StorageData from "../../assets/data/StorageData"; // Assuming you have a data file for storage facilities
import { useNavigation, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function StorageFacilityBanner({ facility, onPress }) {
  const navigate = useNavigation();
  const router = useRouter();
  const handleStorageFacilityPress = () => {
    router.push({
      pathname: "StorageFacility",
    });
  };
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handleStorageFacilityPress}
      android_ripple={{ color: "rgba(0, 0, 0, 0.05)" }}
    >
      <Image
        source={{ uri: facility.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.contentContainer}>
        {/* Title & Price */}
        <View style={styles.headerContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {facility.name}
          </Text>
          <Text style={styles.price}>{facility.price}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {facility.description}
        </Text>

        {/* Location & Size */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <MapPin size={16} color="#444" />
            <Text style={styles.detailText}>{facility.location}</Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.viewMoreContainer}>
              <Text style={styles.viewMoreText}>Reserve  Now</Text>
              <ArrowRight size={16} color="#610b0c" />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.97 }],
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#f0f0f0",
  },
  contentContainer: {
    padding: 2,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#610b0c",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    lineHeight: 20,
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 14,
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },
  detailText: {
    fontSize: 13,
    color: "#444",
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  featureTag: {
    backgroundColor: "#f5e9ea",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: "#610b0c",
  },
  moreFeatures: {
    fontSize: 12,
    color: "#888",
  },
  viewMoreContainer: {
    flexDirection: "row",
  },
  viewMoreText: {
    fontSize: 14,
    color: "#610b0c",
    marginRight: 4,
    fontWeight: "600",
  },
});

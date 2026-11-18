import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Button, PressableScale } from "../../ui";
import { colors } from "../../../constants/theme";

const { width } = Dimensions.get("window");

const StorageBanner = ({ facility }) => {
  const router = useRouter();

  // Determine button text & route based on facility type
  const getButtonInfo = () => {
    switch (facility.type) {
      case "storage":
        return { text: "Store Now", route: "(StorageForm)" };
      case "transport":
        return { text: "Travel Now", route: "/(categories)/(transport)" };
      case "shop":
        return { text: "Shop Now", route: "(shop)" };
      case "accommodation":
        return { text: "Reserve Now", route: "(hostels)" };
      default:
        return { text: "Reserve Now", route: "(StorageForm)" };
    }
  };

  const { text: buttonText, route: buttonRoute } = getButtonInfo();

  const handlePress = () => {
    router.push({ pathname: buttonRoute });
  };

  return (
    <PressableScale style={styles.container} onPress={handlePress} accessibilityRole="button">
      <Image
        source={{ uri: facility.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Overlay content with blur background */}
      <View style={styles.overlayContainer}>
        <BlurView 
          intensity={10} 
          style={styles.blurContainer}
          tint="dark"
        >
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.name} numberOfLines={1}>
                {facility.name}
              </Text>
              <Text style={styles.price}>{facility.price}</Text>
            </View>

            <Text style={styles.description} numberOfLines={3}>
              {facility.description}
            </Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Feather name="map-pin" size={14} color={colors.textInverse} />
                <Text style={styles.detailText}>{facility.location}</Text>
              </View>

              <Button title={buttonText} icon="arrow-forward" iconPosition="right" size="sm" compact onPress={handlePress} style={{ alignSelf: "flex-start" }} />
            </View>
          </View>
        </BlurView>
      </View>
    </PressableScale>
  );
};

export default StorageBanner;

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    overflow: "hidden",
    height: 200, // Fixed height for compact look
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
    height: "100%",
    backgroundColor: colors.fill,
    position: "absolute",
  },
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 110, // Overlay height
  },
  blurContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Fallback for Android
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textInverse,
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textInverse,
  },
  description: {
    fontSize: 12,
    color: "#f0f0f0",
    marginBottom: 6,
    lineHeight: 16,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom:30
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    fontSize: 11,
    color: "#f0f0f0",
    marginLeft: 4,
  },
  reserveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124, 27, 29, 0.9)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  reserveButtonText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
});
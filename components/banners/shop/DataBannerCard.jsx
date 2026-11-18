// components/DataBannerCard.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Button, PressableScale } from "../../ui";
import { colors } from "../../../constants/theme";

const { width } = Dimensions.get("window");

const DataBannerCard = () => {
    const router = useRouter();

  const handlePress = () => {
    router.push("(shop)/NetworkServices/CampusData");
  };

  return (
    <PressableScale style={styles.container} onPress={handlePress} accessibilityRole="button">
      <Image
        source={{
          uri: "https://www.bt.com/content/dam/bt/storefront/broadband/2025/july/student-deals--hero-banner-mobile.webp",
        }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Dark overlay with blur */}
      <View style={styles.overlayContainer}>
        <BlurView intensity={15} tint="dark" style={styles.blurContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Buy Cheapest Campus Data 🚀</Text>
            <Text style={styles.description} numberOfLines={2}>
                Get affordable student internet packages to support your hostel and academic life on all network.
            </Text>

            <Button title="Buy Now" size="sm" compact onPress={handlePress} style={{ alignSelf: "flex-start" }} />
          </View>
        </BlurView>
      </View>
    </PressableScale>
  );
};

export default DataBannerCard;

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 200,
    marginHorizontal: 10,
    marginVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 110,
  },
  blurContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dark overlay
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textInverse,
  },
  description: {
    fontSize: 12,
    color: "#f0f0f0",
    marginVertical: 4,
    lineHeight: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,27,29,0.9)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
});

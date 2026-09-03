import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 4;

const categories = [
  { name: "Hostels", image: require("../../assets/images/hostel.png"), route: "/(categories)/(hostels)" },
  { name: "Storage", image: require("../../assets/images/storagebox.png"), route: "/(StorageForm)" },
  { name: "Data Shop", image: require("../../assets/images/data.png"), route: "/(categories)/(shop)" },
    { name: "Transport", image: require("../../assets/images/transport.png"), route: "/(categories)/(unigotransport)" },
  // { name: "Transport", image: require("../../assets/images/transport.png"), route: "/(categories)/(transport)" },
];

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const CategoryNavigationCards = () => {
  const router = useRouter();
  const randomizedCategories = useMemo(() => shuffleArray(categories), []);

  return (
    <View style={styles.container}>
      {randomizedCategories.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[styles.card, { width: cardWidth }]}
          onPress={() => router.push(item.route)}
          activeOpacity={0.85}
        >
          <ImageBackground
            source={item.image}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
          >
            {/* dark gradient overlay so text is always readable */}
            <View style={styles.overlay} />
            <Text style={styles.label}>{item.name}</Text>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    height: 90,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
    borderRadius: 14,
  },
  label: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    paddingBottom: 8,
    paddingHorizontal: 4,
    letterSpacing: 0.2,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default CategoryNavigationCards;
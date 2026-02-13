import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 4 - 16;

const categories = [
  { name: "Hostels", image: require("../../assets/images/hostel.png"), route: "/(categories)/(hostels)" },
  { name: "Storage", image: require("../../assets/images/storagebox.png"), route: "/(StorageForm)" },
  { name: "Shop", image: require("../../assets/images/shop.png"), route: "/(categories)/(shop)" },
  { name: "Transport", image: require("../../assets/images/transport.png"), route: "/(categories)/(transport)" },
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

  // Shuffle categories on every render/mount
  const randomizedCategories = useMemo(() => shuffleArray(categories), []);

  return (
    <View style={styles.container}>
      {randomizedCategories.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[styles.card, { width: cardWidth }]}
          onPress={() => router.push(item.route)}
        >
          <View style={styles.imageWrapper}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
          </View>
          <Text style={styles.label}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageWrapper: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A202C",
    textAlign: "center",
  },
});

export default CategoryNavigationCards;
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";


const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 4 - 16; // Adjust to fit 4 cards in one row


const categories = [
  {
    name: "Hostels",
    image: require("../../assets/images/hostel.png"),
    route: "(hostels)",
  },
  {
    name: "Shop",
    image: require("../../assets/images/shop.png"),
    route: "(shop)",
  },
  {
    name: "Transport",
    image: require("../../assets/images/transport.png"),
    route: "(transport)",
  },
  {
    name: "Storage",
    image: require("../../assets/images/storage.png"),
    route: "(StorageForm)",
  },
];

const CategoryNavigationCards = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {categories.map((item) => (
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
    paddingHorizontal:16
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

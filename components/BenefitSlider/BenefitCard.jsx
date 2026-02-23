import React, { useRef, useEffect } from "react";
import { Animated, Text, View, StyleSheet, Dimensions } from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const SEA_LIGHT_BLUE = "#e5f2fe";
const SCREEN_WIDTH = Dimensions.get("window").width;

const Icons = {
  Agent: () => (
    <MaterialCommunityIcons name="account-tie" size={30} color="#000" />
  ),
    Payment: () => (
      <FontAwesome5 name="money-bill-wave" size={30} color="#000" />
    ),
    Location: () => <Ionicons name="location-sharp" size={30} color="#000" />,
    Security: () => <MaterialIcons name="security" size={30} color="#000" />,
    Support: () => (
      <FontAwesome5 name="headset" size={30} color="#000" />
    ),
    Downloads: () => (
      <MaterialCommunityIcons name="download" size={30} color="#000" />
    ),
    Storage: () => (
      <Ionicons name="archive" size={30} color="#000" />
    ),
  };
  
const BenefitCard = ({ icon, title, description, index }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 150,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      delay: index * 150,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const IconComponent = Icons[icon] || Icons.Security;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <IconComponent />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.55, // fits 2 cards with small margin
    height: 160,
    backgroundColor: SEA_LIGHT_BLUE,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  iconContainer: {
    marginBottom: 6, // reduced top space
  },
  cardTitle: {
    fontSize: 15, // increased slightly
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13, 
    color: "#696969",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default BenefitCard;

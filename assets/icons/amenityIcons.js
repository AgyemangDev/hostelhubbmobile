// assets/amenityIcons.js
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const COLOR = "#2980b9";

export const AMENITY_ICONS = {
  "water supply": <Ionicons name="water-outline" size={20} color={COLOR} />,
  wardrobe: <Ionicons name="shirt-outline" size={20} color={COLOR} />,
  "shared kitchen": <Ionicons name="restaurant-outline" size={20} color={COLOR} />,
  "balcony/kitchen": <Ionicons name="home-outline" size={20} color={COLOR} />,
  "shared bathroom": <MaterialCommunityIcons name="shower" size={20} color={COLOR} />,
  "private bathroom": <MaterialCommunityIcons name="bathtub-outline" size={20} color={COLOR} />,
  "wifi services": <Ionicons name="wifi-outline" size={20} color={COLOR} />,
  "generators/plants": <Ionicons name="battery-charging-outline" size={20} color={COLOR} />,
  "dry lines": <Ionicons name="sunny-outline" size={20} color={COLOR} />,
  "study rooms": <Ionicons name="book-outline" size={20} color={COLOR} />,
  "table & chair": <Ionicons name="book-outline" size={20} color={COLOR} />,
  security: <Ionicons name="shield-checkmark-outline" size={20} color={COLOR} />,
  "cctv camera": <Ionicons name="shield-checkmark-outline" size={20} color={COLOR} />,
  ac: <Ionicons name="snow-outline" size={20} color={COLOR} />,
  "water heater": <Ionicons name="thermometer-outline" size={20} color={COLOR} />,
  "swimming pool": <Ionicons name="water-outline" size={20} color={COLOR} />,
  "basketball court": <Ionicons name="basketball-outline" size={20} color={COLOR} />,
  gym: <Ionicons name="barbell-outline" size={20} color={COLOR} />,
  "game/tv room": <Ionicons name="tv-outline" size={20} color={COLOR} />,
  television: <Ionicons name="tv-outline" size={20} color={COLOR} />,
  fridge: <Ionicons name="thermometer-outline" size={20} color={COLOR} />,
  salon: <Ionicons name="cut-outline" size={20} color={COLOR} />,
  restaurant: <Ionicons name="fast-food-outline" size={20} color={COLOR} />,
  eatery: <Ionicons name="fast-food-outline" size={20} color={COLOR} />,
  laundry: <Ionicons name="shirt-outline" size={20} color={COLOR} />,
  "washing machine": <Ionicons name="shirt-outline" size={20} color={COLOR} />,
  "football pitch": <Ionicons name="football-outline" size={20} color={COLOR} />,
  "hostel shuttle": <Ionicons name="bus-outline" size={20} color={COLOR} />,
  "bunk beds": <Ionicons name="bed-outline" size={20} color={COLOR} />,
  "single beds": <Ionicons name="bed-outline" size={20} color={COLOR} />,
  "gas cooker": <Ionicons name="flame-outline" size={20} color={COLOR} />,
  "fenced wall": <Ionicons name="home-outline" size={20} color={COLOR} />,
};

export const getAmenityIcon = (amenity) => AMENITY_ICONS[amenity.toLowerCase()] || <Ionicons name="help-outline" size={20} color={COLOR} />;
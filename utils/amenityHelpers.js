import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AMENITIES } from "../assets/data/amenities";

const ALIASES = {
  "Water Supply": "Pipe Water Supply",
  "Generators/Plants": "Generator",
  "Balcony/Kitchen": "Balcony Kitchen",
  "Security": "Security Guard",
  "Study Rooms": "Study Room",
  "Game/TV room": "TV / Games Room",
  "Bunk Beds": "Bunk Bed",
  "Single Beds": "Single Bed",
  "Television": "Cable TV",
  "Fenced Wall": "Gated / Fenced",
    // 👇 new ones from your logs
  "Wifi Services": "Wifi",
  "Table & Chair": "Study Table & Chair",
  "CCTV camera": "CCTV",
  "Water Heater": "Hot Shower",  
};

export const getAmenityData = (amenityKey) => {
  const resolvedKey = ALIASES[amenityKey] ?? amenityKey;
  return AMENITIES.find((item) => item.key === resolvedKey);
};

export const renderAmenityIcon = (amenityKey, size = 22) => {
  const amenity = getAmenityData(amenityKey);

  if (!amenity) {
    return <Ionicons name="help-circle-outline" size={size} color="#222" />;
  }

  const { lib, name } = amenity.icon;

  if (lib === "Ionicons") {
    return <Ionicons name={name} size={size} color="#222" />;
  }

  if (lib === "MaterialCommunityIcons") {
    return <MaterialCommunityIcons name={name} size={size} color="#222" />;
  }

  return null;
};

export const formatAmenities = (amenities = []) => {
  return amenities.map((item) => {
    const found = getAmenityData(item);
    return found ?? { key: item, label: item, icon: null };
  });
};
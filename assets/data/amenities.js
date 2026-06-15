// src/data/amenitiesData.js
// Centralised amenities list for Ghana university hostels.
// Import anywhere: import { AMENITIES, AMENITY_CATEGORIES } from '../data/amenitiesData';

export const AMENITY_CATEGORIES = {
  ESSENTIALS: "Essentials",
  BATHROOM: "Bathroom",
  KITCHEN: "Kitchen",
  POWER_WATER: "Power & Water",
  BEDROOM: "Bedroom",
  CONNECTIVITY: "Connectivity",
  SECURITY: "Security",
  RECREATION: "Recreation & Sports",
  SERVICES: "Services",
  OUTDOOR: "Outdoor",
};

// icon libraries: "Ionicons" | "MaterialCommunityIcons"
export const AMENITIES = [
  // ─── Essentials ───────────────────────────────────────────
  {
    key: "Wifi",
    label: "WiFi",
    category: AMENITY_CATEGORIES.CONNECTIVITY,
    icon: { lib: "Ionicons", name: "wifi-outline" },
  },
  {
    key: "AC",
    label: "Air Conditioning",
    category: AMENITY_CATEGORIES.ESSENTIALS,
    icon: { lib: "Ionicons", name: "snow-outline" },
  },
  {
    key: "Ceiling Fan",
    label: "Ceiling Fan",
    category: AMENITY_CATEGORIES.ESSENTIALS,
    icon: { lib: "MaterialCommunityIcons", name: "fan" },
  },
  {
    key: "Wardrobe",
    label: "Wardrobe",
    category: AMENITY_CATEGORIES.ESSENTIALS,
    icon: { lib: "MaterialCommunityIcons", name: "wardrobe-outline" },
  },
  {
    key: "Study Table & Chair",
    label: "Study Table & Chair",
    category: AMENITY_CATEGORIES.ESSENTIALS,
    icon: { lib: "MaterialCommunityIcons", name: "desk" },
  },
  {
    key: "Locker / Safe",
    label: "Locker / Safe",
    category: AMENITY_CATEGORIES.ESSENTIALS,
    icon: { lib: "MaterialCommunityIcons", name: "lock-outline" },
  },
  {
    key: "Curtains / Blinds",
    label: "Curtains / Blinds",
    category: AMENITY_CATEGORIES.ESSENTIALS,
    icon: { lib: "MaterialCommunityIcons", name: "curtains" },
  },
  {
    key: "Reading Lamp",
    label: "Reading Lamp",
    category: AMENITY_CATEGORIES.ESSENTIALS,
    icon: { lib: "Ionicons", name: "bulb-outline" },
  },

  // ─── Bathroom ─────────────────────────────────────────────
  {
    key: "Private Bathroom",
    label: "Private Bathroom",
    category: AMENITY_CATEGORIES.BATHROOM,
    icon: { lib: "MaterialCommunityIcons", name: "bathtub-outline" },
  },
  {
    key: "Shared Bathroom",
    label: "Shared Bathroom",
    category: AMENITY_CATEGORIES.BATHROOM,
    icon: { lib: "MaterialCommunityIcons", name: "shower" },
  },
  {
    key: "Hot Shower",
    label: "Hot Shower",
    category: AMENITY_CATEGORIES.BATHROOM,
    icon: { lib: "Ionicons", name: "thermometer-outline" },
  },
  {
    key: "Flush Toilet",
    label: "Flush Toilet",
    category: AMENITY_CATEGORIES.BATHROOM,
    icon: { lib: "MaterialCommunityIcons", name: "toilet" },
  },
  {
    key: "Squat Toilet",
    label: "Squat Toilet",
    category: AMENITY_CATEGORIES.BATHROOM,
    icon: { lib: "MaterialCommunityIcons", name: "toilet" },
  },

  // ─── Kitchen ──────────────────────────────────────────────
  {
    key: "Shared Kitchen",
    label: "Shared Kitchen",
    category: AMENITY_CATEGORIES.KITCHEN,
    icon: { lib: "Ionicons", name: "restaurant-outline" },
  },
  {
    key: "Private Kitchen",
    label: "Private Kitchen",
    category: AMENITY_CATEGORIES.KITCHEN,
    icon: { lib: "MaterialCommunityIcons", name: "countertop-outline" },
  },
  {
    key: "Gas Cooker",
    label: "Gas Cooker",
    category: AMENITY_CATEGORIES.KITCHEN,
    icon: { lib: "Ionicons", name: "flame-outline" },
  },
  {
    key: "Electric Cooker",
    label: "Electric Cooker",
    category: AMENITY_CATEGORIES.KITCHEN,
    icon: { lib: "MaterialCommunityIcons", name: "stove" },
  },
  {
    key: "Microwave",
    label: "Microwave",
    category: AMENITY_CATEGORIES.KITCHEN,
    icon: { lib: "MaterialCommunityIcons", name: "microwave" },
  },
  {
    key: "Fridge",
    label: "Fridge",
    category: AMENITY_CATEGORIES.KITCHEN,
    icon: { lib: "MaterialCommunityIcons", name: "fridge-outline" },
  },
  {
    key: "Balcony Kitchen",
    label: "Balcony Kitchen",
    category: AMENITY_CATEGORIES.KITCHEN,
    icon: { lib: "Ionicons", name: "home-outline" },
  },

  // ─── Power & Water ────────────────────────────────────────
  {
    key: "Generator",
    label: "Generator",
    category: AMENITY_CATEGORIES.POWER_WATER,
    icon: { lib: "Ionicons", name: "battery-charging-outline" },
  },
  {
    key: "Solar Power",
    label: "Solar Power",
    category: AMENITY_CATEGORIES.POWER_WATER,
    icon: { lib: "Ionicons", name: "sunny-outline" },
  },
  {
    key: "Borehole Water",
    label: "Borehole Water",
    category: AMENITY_CATEGORIES.POWER_WATER,
    icon: { lib: "Ionicons", name: "water-outline" },
  },
  {
    key: "Pipe Water Supply",
    label: "Pipe Water Supply",
    category: AMENITY_CATEGORIES.POWER_WATER,
    icon: { lib: "MaterialCommunityIcons", name: "pipe" },
  },
  {
    key: "Water Tank / Polytank",
    label: "Water Tank / Polytank",
    category: AMENITY_CATEGORIES.POWER_WATER,
    icon: { lib: "MaterialCommunityIcons", name: "water-pump" },
  },
  {
    key: "Extra Power Sockets",
    label: "Extra Power Sockets",
    category: AMENITY_CATEGORIES.POWER_WATER,
    icon: { lib: "MaterialCommunityIcons", name: "power-socket-uk" },
  },

  // ─── Bedroom ──────────────────────────────────────────────
  {
    key: "Single Bed",
    label: "Single Bed",
    category: AMENITY_CATEGORIES.BEDROOM,
    icon: { lib: "Ionicons", name: "bed-outline" },
  },
  {
    key: "Bunk Bed",
    label: "Bunk Bed",
    category: AMENITY_CATEGORIES.BEDROOM,
    icon: { lib: "MaterialCommunityIcons", name: "bunk-bed-outline" },
  },
  {
    key: "Double Bed",
    label: "Double Bed",
    category: AMENITY_CATEGORIES.BEDROOM,
    icon: { lib: "MaterialCommunityIcons", name: "bed-king-outline" },
  },
  {
    key: "Mattress Provided",
    label: "Mattress Provided",
    category: AMENITY_CATEGORIES.BEDROOM,
    icon: { lib: "MaterialCommunityIcons", name: "bed" },
  },
  {
    key: "Pillow & Bedding",
    label: "Pillow & Bedding",
    category: AMENITY_CATEGORIES.BEDROOM,
    icon: { lib: "MaterialCommunityIcons", name: "pillow" },
  },

  // ─── Connectivity ─────────────────────────────────────────
  {
    key: "Cable TV",
    label: "Cable TV",
    category: AMENITY_CATEGORIES.CONNECTIVITY,
    icon: { lib: "Ionicons", name: "tv-outline" },
  },
  {
    key: "DSTV",
    label: "DSTV",
    category: AMENITY_CATEGORIES.CONNECTIVITY,
    icon: { lib: "MaterialCommunityIcons", name: "satellite-variant" },
  },

  // ─── Security ─────────────────────────────────────────────
  {
    key: "Security Guard",
    label: "Security Guard",
    category: AMENITY_CATEGORIES.SECURITY,
    icon: { lib: "Ionicons", name: "shield-checkmark-outline" },
  },
  {
    key: "CCTV",
    label: "CCTV",
    category: AMENITY_CATEGORIES.SECURITY,
    icon: { lib: "MaterialCommunityIcons", name: "cctv" },
  },
  {
    key: "Gated / Fenced",
    label: "Gated / Fenced",
    category: AMENITY_CATEGORIES.SECURITY,
    icon: { lib: "MaterialCommunityIcons", name: "gate" },
  },
  {
    key: "Intercom",
    label: "Intercom",
    category: AMENITY_CATEGORIES.SECURITY,
    icon: { lib: "MaterialCommunityIcons", name: "doorbell" },
  },
  {
    key: "Key Card Access",
    label: "Key Card Access",
    category: AMENITY_CATEGORIES.SECURITY,
    icon: { lib: "MaterialCommunityIcons", name: "card-account-details-outline" },
  },

  // ─── Recreation & Sports ──────────────────────────────────
  {
    key: "Gym",
    label: "Gym",
    category: AMENITY_CATEGORIES.RECREATION,
    icon: { lib: "Ionicons", name: "barbell-outline" },
  },
  {
    key: "Swimming Pool",
    label: "Swimming Pool",
    category: AMENITY_CATEGORIES.RECREATION,
    icon: { lib: "MaterialCommunityIcons", name: "pool" },
  },
  {
    key: "Football Pitch",
    label: "Football Pitch",
    category: AMENITY_CATEGORIES.RECREATION,
    icon: { lib: "Ionicons", name: "football-outline" },
  },
  {
    key: "Basketball Court",
    label: "Basketball Court",
    category: AMENITY_CATEGORIES.RECREATION,
    icon: { lib: "Ionicons", name: "basketball-outline" },
  },
  {
    key: "Table Tennis",
    label: "Table Tennis",
    category: AMENITY_CATEGORIES.RECREATION,
    icon: { lib: "MaterialCommunityIcons", name: "table-tennis" },
  },
  {
    key: "TV / Games Room",
    label: "TV / Games Room",
    category: AMENITY_CATEGORIES.RECREATION,
    icon: { lib: "MaterialCommunityIcons", name: "gamepad-variant-outline" },
  },
  {
    key: "Study Room",
    label: "Study Room",
    category: AMENITY_CATEGORIES.RECREATION,
    icon: { lib: "Ionicons", name: "book-outline" },
  },
  {
    key: "Common Room",
    label: "Common Room",
    category: AMENITY_CATEGORIES.RECREATION,
    icon: { lib: "MaterialCommunityIcons", name: "sofa-outline" },
  },

  // ─── Services ─────────────────────────────────────────────
  {
    key: "Laundry",
    label: "Laundry",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "MaterialCommunityIcons", name: "washing-machine" },
  },
  {
    key: "Dry Lines",
    label: "Dry Lines",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "MaterialCommunityIcons", name: "hanger" },
  },
  {
    key: "Ironing Board",
    label: "Ironing Board",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "MaterialCommunityIcons", name: "iron-outline" },
  },
  {
    key: "Salon",
    label: "Salon / Barbershop",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "Ionicons", name: "cut-outline" },
  },
  {
    key: "Eatery / Restaurant",
    label: "Eatery / Restaurant",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "Ionicons", name: "fast-food-outline" },
  },
  {
    key: "Mini Shop",
    label: "Mini Shop / Provisions",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "MaterialCommunityIcons", name: "store-outline" },
  },
  {
    key: "Printing Center",
    label: "Printing Center",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "MaterialCommunityIcons", name: "printer-outline" },
  },
  {
    key: "Hostel Shuttle",
    label: "Hostel Shuttle",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "Ionicons", name: "bus-outline" },
  },
  {
    key: "Cleaning Service",
    label: "Cleaning Service",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "MaterialCommunityIcons", name: "broom" },
  },
  {
    key: "Trash Collection",
    label: "Trash Collection",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "MaterialCommunityIcons", name: "trash-can-outline" },
  },
  {
    key: "Pharmacy Nearby",
    label: "Pharmacy Nearby",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "MaterialCommunityIcons", name: "pill" },
  },
  {
    key: "ATM Nearby",
    label: "ATM Nearby",
    category: AMENITY_CATEGORIES.SERVICES,
    icon: { lib: "MaterialCommunityIcons", name: "atm" },
  },

  // ─── Outdoor ──────────────────────────────────────────────
  {
    key: "Balcony",
    label: "Balcony",
    category: AMENITY_CATEGORIES.OUTDOOR,
    icon: { lib: "MaterialCommunityIcons", name: "balcony" },
  },
  {
    key: "Parking",
    label: "Parking",
    category: AMENITY_CATEGORIES.OUTDOOR,
    icon: { lib: "Ionicons", name: "car-outline" },
  },
  {
    key: "Bicycle Parking",
    label: "Bicycle Parking",
    category: AMENITY_CATEGORIES.OUTDOOR,
    icon: { lib: "MaterialCommunityIcons", name: "bicycle" },
  },
  {
    key: "Garden / Green Area",
    label: "Garden / Green Area",
    category: AMENITY_CATEGORIES.OUTDOOR,
    icon: { lib: "MaterialCommunityIcons", name: "tree-outline" },
  },
];
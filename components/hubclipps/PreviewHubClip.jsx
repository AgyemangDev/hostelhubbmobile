// components/hubclipps/PreviewHubClip.jsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import VideoPlayer from "./VideoPlayer";

export default function PreviewHubClip({ item, height }) {
  return (
    <View style={[styles.container, { height }]}>
      {/* Video Player */}
      {item.video_url ? (
        <VideoPlayer uri={item.video_url} isActive />
      ) : (
        <View style={styles.noVideo}>
          <Ionicons name="videocam-off-outline" size={60} color="#666" />
          <Text style={styles.noVideoText}>No video uploaded</Text>
        </View>
      )}

      {/* Overlay Content */}
      <View style={styles.overlay}>
        {/* Left Info */}
        <View style={styles.leftInfo}>
          <Text style={styles.title}>
            {item.room_type || "Room Type"} • {item.category || "Category"}
          </Text>

          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" color="white" size={18} />
            <Text style={styles.location}>
              {item.location || "Location"} — {item.institution || "Institution"}
            </Text>
          </View>

          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          {item.amenities?.length > 0 && (
            <Text style={styles.amenities}>
              Amenities: {item.amenities.join(", ")}
            </Text>
          )}

          {item.price && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>GH₵{item.price}</Text>
            </View>
          )}
        </View>

        {/* Right UI Actions (Preview Only) */}
        <View style={styles.rightActions}>
          {item.front_image_url ? (
            <Image source={{ uri: item.front_image_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialIcons name="home" size={24} color="white" />
            </View>
          )}

          {/* Heart icon (UI only) */}
          <View style={styles.actionButton}>
            <AntDesign name="heart" size={30} color="white" />
          </View>
        </View>
      </View>

      {/* Preview Watermark */}
      <View style={styles.watermark}>
        <Text style={styles.watermarkText}>PREVIEW</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#000",
    overflow: "hidden",
  },
  noVideo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  noVideoText: {
    color: "#666",
    fontSize: 16,
    marginTop: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 100,
    left: 15,
    right: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  leftInfo: {
    maxWidth: "70%",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  location: {
    color: "white",
    fontSize: 14,
    marginLeft: 3,
  },
  description: {
    color: "white",
    fontSize: 14,
    marginVertical: 5,
    lineHeight: 18,
  },
  amenities: {
    color: "#ddd",
    fontSize: 12,
    marginTop: 5,
  },
  priceContainer: {
    marginTop: 8,
    backgroundColor: "rgba(255, 56, 92, 0.9)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  price: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  rightActions: {
    alignItems: "center",
    gap: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    backgroundColor: "#ff385c",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
  },
  watermark: {
    position: "absolute",
    top: 20,
    left: 15,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  watermarkText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});

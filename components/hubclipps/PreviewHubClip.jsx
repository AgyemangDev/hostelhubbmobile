import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VideoPlayer from "./VideoPlayer";
import LeftInfo from "./LeftInfo";
import { money } from "../ui/ds";
import { colors, onVideo, radius, space } from "../../constants/theme";

const FEE_RATE = 0.05;

/**
 * A clip drawn with the same pieces as the live feed (video, LeftInfo, price
 * and Reserve pill), so a poster sees exactly what students will see.
 * The Reserve pill is drawn but not tappable here.
 */
export default function PreviewHubClip({ item, height = 420 }) {
  const price = Number(item.price) || 0;
  return (
    <View style={[styles.frame, { height }]}>
      {item.video_url ? (
        <VideoPlayer uri={item.video_url} isActive />
      ) : (
        <View style={styles.noVideo}>
          <Ionicons name="videocam-off-outline" size={40} color="#A8A29E" />
          <Text style={styles.noVideoText}>No video yet</Text>
        </View>
      )}
      <View pointerEvents="none" style={styles.info}>
        <LeftInfo item={item} />
      </View>
      <View pointerEvents="none" style={styles.bar}>
        <View>
          <Text style={styles.price}>{money(price * (1 + FEE_RATE), { decimals: 0 })}</Text>
          <Text style={styles.caption}>per year, fees included</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Reserve</Text>
        </View>
      </View>
    </View>
  );
}

const shadow = onVideo.text;
const styles = StyleSheet.create({
  frame: { width: "100%", borderRadius: radius.xl, overflow: "hidden", backgroundColor: "#1C1917" },
  noVideo: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", gap: space.xs },
  noVideoText: { color: "#D6D3D1", fontSize: 13, fontWeight: "600" },
  info: { position: "absolute", left: space.md, right: space.md, bottom: 84 },
  bar: { position: "absolute", left: space.md, right: space.md, bottom: space.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", ...shadow },
  caption: { color: "#E7E5E4", fontSize: 11, fontWeight: "600", ...shadow },
  pill: { minHeight: 44, paddingHorizontal: space.lg, borderRadius: 22, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  pillText: { fontSize: 14, fontWeight: "800", color: colors.text },
});

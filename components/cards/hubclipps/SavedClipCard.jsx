// components/cards/hubclipps/SavedClipCard.jsx
//
// A saved Hubclip on the Wishlists screen, shaped like the listing card:
// square media on top, ListingSummary underneath. The media is the clip
// itself, loaded but paused on its first frame (muted, never auto-plays),
// with the cover photo underneath until that frame is ready. Tapping the
// card opens the clip in the Hubclips feed.
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "../../ui";
import ListingSummary from "../accommodation/ListingSummary";
import { money } from "../../../utils/formatMoney";
import { colors, radius } from "../../../constants/theme";

const FEE_RATE = 0.05;

export default function SavedClipCard({ item, onPress, onUnsave }) {
  const player = useVideoPlayer(item.video_url || null, (p) => {
    p.muted = true;
    p.loop = false;
    p.pause();
  });

  const place = [item.room_type, item.location].filter(Boolean).join(" · ");
  const price = item.price ? money((Number(item.price) || 0) * (1 + FEE_RATE), { decimals: 0 }) : null;

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Play clip of ${item.hostel_name}${place ? `, ${place}` : ""}`}
    >
      <View style={styles.media}>
        {item.front_image_url ? (
          <Image source={{ uri: item.front_image_url }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : null}
        {item.video_url ? (
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            nativeControls={false}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            pointerEvents="none"
          />
        ) : null}

        <View style={styles.play} pointerEvents="none">
          <Ionicons name="play" size={20} color={colors.textInverse} style={{ marginLeft: 2 }} />
        </View>

        <PressableScale
          onPress={onUnsave}
          accessibilityRole="button"
          accessibilityLabel="Remove from saved"
          hitSlop={8}
          style={styles.heart}
        >
          <Ionicons name="heart" size={18} color="#FF385C" />
        </PressableScale>
      </View>

      <ListingSummary name={item.hostel_name} place={place} institution={item.institution} price={price} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  media: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.fill,
  },
  play: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 52,
    height: 52,
    marginTop: -26,
    marginLeft: -26,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  heart: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
});

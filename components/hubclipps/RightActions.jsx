import React from "react";
import { Image, Pressable, Share, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../../context/FavoritesContext";
import { shareUrl } from "../../utils/links";
import { onVideo } from "../../constants/theme";

const label = [onVideo.text, { fontSize: 12, fontWeight: "700" }];

export default function RightActions({ frontImage, views, clipId, title }) {
  const { isClipFavorite, toggleClipFavorite } = useFavorites();
  const saved = clipId ? isClipFavorite(clipId) : false;
  const handleShare = async () => {
    if (!clipId) return;
    const url = shareUrl.clip(clipId);
    try {
      // `url` is used on iOS; Android only shows `message`, so it carries the link too.
      await Share.share({ message: `${title ? `${title} on HostelHubb` : "Watch this on HostelHubb"}\n${url}`, url });
    } catch {}
  };

  return (
    <View style={{ alignItems: "center", gap: 22 }}>
      <Image
        source={{ uri: frontImage }}
        style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: "#fff", backgroundColor: "rgba(0,0,0,0.3)" }}
      />
      {clipId ? (
        <Pressable
          onPress={() => toggleClipFavorite(clipId)}
          accessibilityRole="button"
          accessibilityState={{ selected: saved }}
          accessibilityLabel={saved ? "Remove from saved" : "Save this clip"}
          hitSlop={10}
          style={{ alignItems: "center", gap: 4 }}
        >
          <Ionicons name={saved ? "heart" : "heart-outline"} size={30} color={saved ? "#FF385C" : "#FFFFFF"} style={onVideo.text} />
          <Text style={label}>{saved ? "Saved" : "Save"}</Text>
        </Pressable>
      ) : null}
      <View style={{ alignItems: "center", gap: 4 }}>
        <Feather name="eye" size={26} style={onVideo.text} />
        <Text style={label}>{views}</Text>
      </View>
      {clipId ? (
        <Pressable
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="Share this clip"
          hitSlop={10}
          style={{ alignItems: "center", gap: 4 }}
        >
          <Feather name="send" size={26} style={onVideo.text} />
          <Text style={label}>Share</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

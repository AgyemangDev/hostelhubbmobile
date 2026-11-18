import React from "react";
import { Image, Share, StyleSheet, View } from "react-native";
import { LabeledIconButton } from "../../ui";
import { useFavorites } from "../../../context/FavoritesContext";
import { shareUrl } from "../../../utils/links";
import { colors } from "../../../constants/theme";

/** The column on the right of a clip: poster, Save, views and Share. */
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
    <View style={styles.column}>
      <Image source={{ uri: frontImage }} style={styles.poster} />
      {clipId ? (
        <LabeledIconButton
          variant="onVideo"
          icon="heart-outline"
          selectedIcon="heart"
          selectedColor="#FF385C"
          selected={saved}
          size={30}
          label={saved ? "Saved" : "Save"}
          accessibilityLabel={saved ? "Remove from saved" : "Save this clip"}
          onPress={() => toggleClipFavorite(clipId)}
        />
      ) : null}
      <LabeledIconButton variant="onVideo" icon="eye-outline" size={26} label={String(views ?? "")} />
      {clipId ? (
        <LabeledIconButton variant="onVideo" icon="paper-plane-outline" size={26} label="Share" accessibilityLabel="Share this clip" onPress={handleShare} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  column: { alignItems: "center", gap: 22 },
  poster: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors.surface, backgroundColor: "rgba(0,0,0,0.3)" },
});

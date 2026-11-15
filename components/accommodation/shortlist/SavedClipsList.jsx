import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFavorites } from "../../../context/FavoritesContext";
import { useHubclippsById } from "../../../hooks/hubclippsContext/useHubclippsById";
import { Button, EmptyState, PressableScale, money } from "../../ui/ds";
import { colors, radius, space, type } from "../../../constants/theme";

const FEE_RATE = 0.05;

/** Hubclips the student saved with the heart on the feed. */
export default function SavedClipsList() {
  const router = useRouter();
  const { getFavoriteClipIds, toggleClipFavorite } = useFavorites();
  const { fetchById } = useHubclippsById();
  const ids = useMemo(() => getFavoriteClipIds(), [getFavoriteClipIds]);
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all(ids.map((id) => fetchById(id).catch(() => null)))
      .then((rows) => active && setClips(rows.filter(Boolean)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // fetchById is recreated each render; the id list is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  if (loading) return <ActivityIndicator color={colors.brand} style={{ marginTop: space.xxl }} />;
  if (!clips.length) {
    return (
      <View style={{ paddingHorizontal: space.lg, paddingTop: space.xl }}>
        <EmptyState
          icon="videocam-outline"
          title="No saved clips yet"
          body="Tap the heart on a Hubclip to keep the room tour here."
          action={<Button title="Watch Hubclips" onPress={() => router.push("/(tabs)/(Hubclipps)")} />}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={clips}
      keyExtractor={(c) => String(c.id)}
      numColumns={2}
      columnWrapperStyle={{ gap: space.sm }}
      contentContainerStyle={{ paddingHorizontal: space.lg, paddingTop: space.xs, paddingBottom: space.xxxl, gap: space.lg }}
      renderItem={({ item }) => (
        <PressableScale
          style={{ flex: 1, gap: 6 }}
          onPress={() => router.push({ pathname: "/(tabs)/(Hubclipps)", params: { clip: String(item.id) } })}
          accessibilityRole="button"
          accessibilityLabel={`Play ${item.hostel_name}`}
        >
          <View>
            <Image source={{ uri: item.front_image_url }} style={styles.thumb} />
            <View style={styles.play}>
              <Ionicons name="play" size={16} color="#FFFFFF" />
            </View>
            <PressableScale
              onPress={() => toggleClipFavorite(item.id)}
              accessibilityRole="button"
              accessibilityLabel="Remove from saved"
              hitSlop={8}
              style={styles.heart}
            >
              <Ionicons name="heart" size={18} color="#FF385C" />
            </PressableScale>
          </View>
          <Text style={type.bodyStrong} numberOfLines={1}>{item.hostel_name}</Text>
          <Text style={[type.caption, { color: colors.textSecondary }]} numberOfLines={1}>
            {[item.room_type, item.location].filter(Boolean).join(" · ")}
          </Text>
          <Text style={type.caption}>
            <Text style={{ fontWeight: "800" }}>{money((Number(item.price) || 0) * (1 + FEE_RATE), { decimals: 0 })}</Text> per year
          </Text>
        </PressableScale>
      )}
    />
  );
}

const styles = StyleSheet.create({
  thumb: { width: "100%", aspectRatio: 9 / 14, borderRadius: radius.xl, backgroundColor: colors.fill },
  play: { position: "absolute", left: 10, bottom: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" },
  heart: { position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center" },
});

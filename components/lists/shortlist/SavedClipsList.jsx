import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useFavorites } from "../../../context/FavoritesContext";
import { useHubclippsById } from "../../../hooks/hubclippsContext/useHubclippsById";
import SavedClipCard from "../../cards/hubclipps/SavedClipCard";
import SkeletonCards from "../../skeletons/accommodation/SkeletonCard";
import { Button, EmptyState } from "../../ui";
import { space } from "../../../constants/theme";

/** Hubclips the student saved with the heart on the feed, one card per row like saved places. */
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

  // Unsaving a clip removes it right away, before the next fetch.
  const saved = useMemo(() => {
    const keep = new Set(ids.map(String));
    return clips.filter((c) => keep.has(String(c.id)));
  }, [clips, ids]);

  if (loading && saved.length === 0) {
    return (
      <View style={styles.pad}>
        <SkeletonCards />
      </View>
    );
  }

  if (!saved.length) {
    return (
      <View style={styles.pad}>
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
      data={saved}
      keyExtractor={(c) => String(c.id)}
      renderItem={({ item }) => (
        <SavedClipCard
          item={item}
          onPress={() => router.push({ pathname: "/(tabs)/(Hubclipps)", params: { clip: String(item.id) } })}
          onUnsave={() => toggleClipFavorite(item.id)}
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: space.xl }} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      // Each card holds a paused video player; keep only nearby ones mounted.
      windowSize={5}
      initialNumToRender={3}
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
  pad: { flex: 1, paddingHorizontal: space.lg, paddingTop: space.xl },
  list: { paddingHorizontal: space.md + 2, paddingTop: space.xs, paddingBottom: space.xxxl },
});

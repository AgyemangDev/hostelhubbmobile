// Wishlists: saved hostels and saved Hubclips.
import React, { useContext, useMemo, useState } from "react";
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import SavedClipsList from "../components/accommodation/shortlist/SavedClipsList";
import ShortListCardList from "../components/accommodation/shortlist/ShortListCardList";
import { FadeIn, IconButton, PillTabs } from "../components/ui/ds";
import { useFavorites } from "../context/FavoritesContext";
import { UserContext } from "../context/UserContext";
import NoAccountPrompt from "../components/auth/NoAccountPrompt";
import { colors, space, type } from "../constants/theme";

export default function Shortlist() {
  const router = useRouter();
  const { userInfo } = useContext(UserContext);
  const { getFavoriteIds, getFavoriteClipIds } = useFavorites();
  const [tab, setTab] = useState("hostels");

  const hostelCount = useMemo(() => getFavoriteIds().length, [getFavoriteIds]);
  const clipCount = useMemo(() => getFavoriteClipIds().length, [getFavoriteClipIds]);

  if (!userInfo) {
    return (
      <View style={{ flex: 1 }}>
        <NoAccountPrompt message="Sign in to see your wishlists" />
      </View>
    );
  }

  const total = hostelCount + clipCount;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>

      </View>

      <View style={styles.head}>
        <Text style={type.display} accessibilityRole="header">Wishlists</Text>
        <Text style={[type.body, { color: colors.textSecondary }]}>
          {total === 0 ? "Tap the heart on any place or clip to save it here." : `${total} saved ${total === 1 ? "item" : "items"}`}
        </Text>
      </View>

      <PillTabs
        value={tab}
        onChange={setTab}
        options={[
          { value: "hostels", label: hostelCount ? `Places · ${hostelCount}` : "Places", icon: "home-outline" },
          { value: "clips", label: clipCount ? `Clips · ${clipCount}` : "Clips", icon: "videocam-outline" },
        ]}
        style={styles.tabs}
      />

      <FadeIn key={tab} style={{ flex: 1 }}>
        {tab === "clips" ? <SavedClipsList /> : <ShortListCardList />}
      </FadeIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === "android" ? 30 : 0 },
  top: { paddingHorizontal: space.xs, paddingTop: space.xs },
  head: { paddingHorizontal: space.lg, gap: 4, paddingBottom: space.md },
  tabs: { paddingHorizontal: space.lg, paddingBottom: space.sm },
});

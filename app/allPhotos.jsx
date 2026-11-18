import React, { useMemo, useRef, useState } from "react";
import { Animated, StatusBar, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton, Text } from "../components/ui";
import PhotoPager from "../components/media/gallery/PhotoPager";
import ThumbnailStrip from "../components/media/gallery/ThumbnailStrip";
import useReducedMotion from "../hooks/useReducedMotion";
import { motion, space } from "../constants/theme";

/**
 * All photos of a place: the photo large on top, an iOS Photos–style
 * thumbnail scrubber underneath. Tap a photo to hide the controls.
 */
export default function AllPhotos() {
  const { images, initialIndex } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();

  const photos = useMemo(() => {
    try {
      return JSON.parse(decodeURIComponent(images || "%5B%5D"));
    } catch {
      return [];
    }
  }, [images]);
  const [index, setIndex] = useState(() => Math.min(Math.max(Number(initialIndex) || 0, 0), Math.max(photos.length - 1, 0)));

  const [chromeVisible, setChromeVisible] = useState(true);
  const chrome = useRef(new Animated.Value(1)).current;
  const toggleChrome = () => {
    const next = !chromeVisible;
    setChromeVisible(next);
    Animated.timing(chrome, { toValue: next ? 1 : 0, duration: reduced ? 0 : motion.base, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" hidden={!chromeVisible} />

      <Animated.View
        pointerEvents={chromeVisible ? "box-none" : "none"}
        style={[styles.top, { paddingTop: insets.top + space.xs, opacity: chrome }]}
      >
        <IconButton icon="close" variant="onVideo" accessibilityLabel="Close photos" onPress={() => router.back()} />
        {photos.length ? (
          <Text variant="bodyStrong" tone="inverse" accessibilityLiveRegion="polite">
            {index + 1} of {photos.length}
          </Text>
        ) : null}
        <View style={styles.spacer} />
      </Animated.View>

      <PhotoPager images={photos} index={index} onIndexChange={setIndex} onTap={toggleChrome} />

      {photos.length > 1 ? (
        <Animated.View
          pointerEvents={chromeVisible ? "auto" : "none"}
          style={[styles.bottom, { paddingBottom: insets.bottom + space.sm, opacity: chrome }]}
        >
          <ThumbnailStrip images={photos} index={index} onIndexChange={setIndex} />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  top: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.md,
    paddingBottom: space.xs,
  },
  spacer: { width: 44 },
  bottom: { paddingTop: space.sm, backgroundColor: "#000" },
});

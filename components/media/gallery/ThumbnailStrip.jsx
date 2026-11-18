import React, { useEffect, useRef } from "react";
import { FlatList, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import useReducedMotion from "../../../hooks/useReducedMotion";
import { colors } from "../../../constants/theme";

const THUMB_W = 44;
const THUMB_H = 56;
const GAP = 4;
const STRIDE = THUMB_W + GAP;

/**
 * iOS Photos–style scrubber: a row of small thumbnails with the current one
 * centred and outlined. Drag it to scrub through photos instantly, or tap a
 * thumbnail to jump to it. Controlled by `index`.
 */
export default function ThumbnailStrip({ images, index, onIndexChange }) {
  const { width } = useWindowDimensions();
  const listRef = useRef(null);
  const dragging = useRef(false);
  const lastIndex = useRef(index);
  const reduced = useReducedMotion();
  const side = (width - THUMB_W) / 2;

  // Keep the current photo centred when the index changes from the pager or a tap.
  useEffect(() => {
    lastIndex.current = index;
    if (!dragging.current) listRef.current?.scrollToOffset({ offset: index * STRIDE, animated: !reduced });
  }, [index, reduced]);

  const onScroll = (e) => {
    if (!dragging.current) return;
    const i = Math.max(0, Math.min(images.length - 1, Math.round(e.nativeEvent.contentOffset.x / STRIDE)));
    if (i !== lastIndex.current) {
      lastIndex.current = i;
      onIndexChange(i);
    }
  };

  return (
    <FlatList
      ref={listRef}
      data={images}
      horizontal
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={index}
      getItemLayout={(_, i) => ({ length: STRIDE, offset: STRIDE * i, index: i })}
      keyExtractor={(uri, i) => `${i}-${uri}`}
      contentContainerStyle={{ paddingHorizontal: side - GAP / 2 }}
      snapToInterval={STRIDE}
      decelerationRate="fast"
      scrollEventThrottle={16}
      onScroll={onScroll}
      onScrollBeginDrag={() => (dragging.current = true)}
      onMomentumScrollEnd={() => (dragging.current = false)}
      onScrollEndDrag={(e) => {
        // A drag with no fling never fires momentum end.
        if (Math.abs(e.nativeEvent.velocity?.x || 0) < 0.05) dragging.current = false;
      }}
      renderItem={({ item, index: i }) => {
        const active = i === index;
        return (
          <Pressable
            onPress={() => onIndexChange(i)}
            accessibilityRole="imagebutton"
            accessibilityLabel={`Photo ${i + 1}`}
            accessibilityState={{ selected: active }}
            hitSlop={{ top: 8, bottom: 8 }}
            style={[styles.thumb, active ? styles.active : styles.inactive]}
          >
            <Image source={{ uri: item }} style={styles.image} contentFit="cover" cachePolicy="memory-disk" />
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  thumb: { width: THUMB_W, height: THUMB_H, marginHorizontal: GAP / 2, borderRadius: 6, overflow: "hidden", borderWidth: 2 },
  active: { borderColor: colors.surface, transform: [{ scale: 1.08 }] },
  inactive: { borderColor: "transparent", opacity: 0.55 },
  image: { width: "100%", height: "100%" },
});

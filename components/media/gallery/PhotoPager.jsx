import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import PhotoCard from "./PhotoCard";
import useReducedMotion from "../../../hooks/useReducedMotion";

/**
 * Swipeable deck of photos (see PhotoCard for the animation). Controlled by
 * `index`: swiping reports the new index as soon as the next photo is more
 * than half-way in, and an index change from outside (a thumbnail tap or
 * scrub) jumps straight to that photo. Tapping a photo calls `onTap`.
 */
export default function PhotoPager({ images, index, onIndexChange, onTap }) {
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(0);
  const listRef = useRef(null);
  const dragging = useRef(false);
  const lastIndex = useRef(index);
  const scrollX = useRef(new Animated.Value(index * width)).current;
  const reduced = useReducedMotion();

  const cardWidth = Math.round(width * 0.84);
  const cardHeight = Math.max(0, Math.min(height - 48, cardWidth * 1.35));

  // Follow index changes that didn't come from swiping this pager.
  useEffect(() => {
    lastIndex.current = index;
    if (!dragging.current && height) listRef.current?.scrollToOffset({ offset: index * width, animated: false });
  }, [index, width, height]);

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
    useNativeDriver: true,
    listener: (e) => {
      if (!dragging.current) return;
      const i = Math.max(0, Math.min(images.length - 1, Math.round(e.nativeEvent.contentOffset.x / width)));
      if (i !== lastIndex.current) {
        lastIndex.current = i;
        onIndexChange(i);
      }
    },
  });

  // The front card must draw above its neighbours, so stack cells by distance from the current photo.
  const Cell = useCallback(
    ({ index: i, style, ...props }) => <View style={[style, { zIndex: 1000 - Math.abs(i - index), elevation: 1000 - Math.abs(i - index) }]} {...props} />,
    [index]
  );

  return (
    <View style={styles.fill} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      {height ? (
        <Animated.FlatList
          ref={listRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={index}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          keyExtractor={(uri, i) => `${i}-${uri}`}
          scrollEventThrottle={16}
          onScroll={onScroll}
          onScrollBeginDrag={() => (dragging.current = true)}
          onMomentumScrollEnd={() => (dragging.current = false)}
          CellRendererComponent={Cell}
          removeClippedSubviews={false}
          windowSize={5}
          style={styles.list}
          renderItem={({ item, index: i }) => (
            <PhotoCard
              uri={item}
              index={i}
              total={images.length}
              scrollX={scrollX}
              pageWidth={width}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              onPress={onTap}
              reduced={reduced}
            />
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  list: { overflow: "visible" },
});

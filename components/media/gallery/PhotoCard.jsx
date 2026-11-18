import React from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

const AnimatedImage = Animated.createAnimatedComponent(Image);

/**
 * One photo in the PhotoPager deck. Its look is driven by the pager's scroll
 * position: centred, it sits flat and full size in front; as it moves off it
 * tilts, shrinks and tucks behind its neighbour, so the next photo appears to
 * rise out of the stack. The photo also drifts inside the card (parallax).
 */
export default function PhotoCard({ uri, index, total, scrollX, pageWidth, cardWidth, cardHeight, onPress, reduced }) {
  const input = [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth];

  // Pull neighbours toward the centre so they peek out from behind the front card.
  const tuck = pageWidth - cardWidth * 0.18;
  const translateX = scrollX.interpolate({ inputRange: input, outputRange: [-tuck, 0, tuck], extrapolate: "clamp" });
  const scale = scrollX.interpolate({ inputRange: input, outputRange: [0.86, 1, 0.86], extrapolate: "clamp" });
  const rotate = scrollX.interpolate({
    inputRange: input,
    outputRange: reduced ? ["0deg", "0deg", "0deg"] : ["7deg", "0deg", "-7deg"],
    extrapolate: "clamp",
  });
  const translateY = scrollX.interpolate({ inputRange: input, outputRange: reduced ? [0, 0, 0] : [18, 0, 18], extrapolate: "clamp" });
  const opacity = scrollX.interpolate({ inputRange: input, outputRange: [0.55, 1, 0.55], extrapolate: "clamp" });
  const parallax = scrollX.interpolate({
    inputRange: input,
    outputRange: reduced ? [0, 0, 0] : [cardWidth * 0.12, 0, -cardWidth * 0.12],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.page, { width: pageWidth }]}>
      <Animated.View
        style={[
          styles.card,
          { width: cardWidth, height: cardHeight, opacity, transform: [{ translateX }, { translateY }, { rotate }, { scale }] },
        ]}
      >
        <Pressable onPress={onPress} style={styles.fill} accessibilityRole="image" accessibilityLabel={`Photo ${index + 1} of ${total}`}>
          <AnimatedImage
            source={{ uri }}
            style={[styles.image, { width: cardWidth * 1.24, left: -cardWidth * 0.12, transform: [{ translateX: parallax }] }]}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { alignItems: "center", justifyContent: "center" },
  card: {
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#1C1917",
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  fill: { flex: 1 },
  image: { position: "absolute", top: 0, bottom: 0 },
});

import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import AvailabilityTag from "../../badges/accommodation/AvailabilityTag";
import SaveHeartButton from "../../buttons/accommodation/SaveHeartButton";
import { listingPhotos } from "../../../utils/listingFacts";
import { colors, radius } from "../../../constants/theme";

/** Swipeable square photos (up to 5) with page dots, availability tag and save heart. */
export default function ListingPhotoCarousel({ item, tag, onPress }) {
  const photos = useMemo(() => listingPhotos(item), [item]);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const list = photos.length ? photos : [null];

  return (
    <View style={styles.carousel} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <FlatList
          data={list}
          keyExtractor={(u, i) => `${i}-${u}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={list.length > 1}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item: uri }) => (
            <Pressable onPress={onPress} accessibilityRole="imagebutton" accessibilityLabel={`Photo of ${item.accommodation_name}`}>
              <Image
                source={uri ? { uri } : undefined}
                style={{ width, height: width, backgroundColor: colors.fill, opacity: tag?.booked ? 0.7 : 1 }}
                resizeMode="cover"
              />
            </Pressable>
          )}
        />
      ) : null}
      <AvailabilityTag tag={tag} />
      <SaveHeartButton id={item.id} />
      {list.length > 1 ? (
        <View pointerEvents="none" style={styles.dots}>
          {list.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: { width: "100%", aspectRatio: 1, borderRadius: radius.xl, overflow: "hidden", backgroundColor: colors.fill },
  dots: { position: "absolute", bottom: 12, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.6)" },
  dotOn: { backgroundColor: colors.surface, transform: [{ scale: 1.2 }] },
});

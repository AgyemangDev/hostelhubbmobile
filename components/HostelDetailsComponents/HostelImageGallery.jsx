import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import PlaceHolderCard from "../PlaceHolderCard";
import COLORS from "../../constants/Colors";

const { width } = Dimensions.get("window");
const THUMBNAIL_SIZE = 70;
const THUMBNAIL_SPACING = 10;
const THUMBNAIL_BORDER_RADIUS = 10;

const HostelImageGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const thumbnailsScrollRef = useRef(null);

  // Scroll thumbnail into view
  const scrollToActiveThumbnail = (index, animated = true) => {
    const scrollX =
      index * (THUMBNAIL_SIZE + THUMBNAIL_SPACING) - width / 2 + THUMBNAIL_SIZE / 2;
    thumbnailsScrollRef.current?.scrollTo({ x: Math.max(scrollX, 0), animated });
  };

  const handleThumbnailPress = (index) => {
    if (index >= 0 && index < images.length) {
      setActiveIndex(index);
      try {
        flatListRef.current?.scrollToIndex({ index, animated: true });
      } catch (error) {
        console.warn("scrollToIndex failed:", error);
      }
      scrollToActiveThumbnail(index);
    }
  };

  // Sync activeIndex when user scrolls FlatList
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setActiveIndex(newIndex);
      scrollToActiveThumbnail(newIndex);
    }
  };

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  useEffect(() => {
    if (images && images.length > 0) {
      scrollToActiveThumbnail(0, false);
    }
  }, [images]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <ExpoImage
              source={{ uri: item }}
              style={styles.image}
              placeholderContent={<PlaceHolderCard />}
              contentFit="cover"
            />
          </View>
        )}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Thumbnails */}
      <View style={styles.thumbnailContainer}>
        <ScrollView
          ref={thumbnailsScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailScroll}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleThumbnailPress(index)}
              style={[
                styles.thumbnailTouch,
                activeIndex === index && styles.activeThumbnail,
              ]}
            >
              <ExpoImage
                source={{ uri: image }}
                style={styles.thumbnail}
                contentFit="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    marginBottom: 16,
  },
  page: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 400,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  thumbnailContainer: {
    marginTop: 10,
    height: THUMBNAIL_SIZE + 10,
    width: "100%",
  },
  thumbnailScroll: {
    paddingHorizontal: 10,
  },
  thumbnailTouch: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: THUMBNAIL_BORDER_RADIUS,
    marginHorizontal: THUMBNAIL_SPACING / 2,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeThumbnail: {
    borderColor: COLORS.background,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: THUMBNAIL_BORDER_RADIUS,
  },
});

export default HostelImageGallery;
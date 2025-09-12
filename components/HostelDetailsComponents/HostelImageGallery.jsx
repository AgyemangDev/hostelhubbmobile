import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Viewability tracking
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: { viewAreaCoveragePercentThreshold: 50 },
      onViewableItemsChanged: ({ viewableItems }) => {
        if (viewableItems.length > 0) {
          const newIndex = viewableItems[0].index;
          setActiveIndex(newIndex);
          scrollToActiveThumbnail(newIndex);
        }
      },
    },
  ]);

  useEffect(() => {
    if (images && images.length > 0) {
      scrollToActiveThumbnail(0, false);
    }
  }, [images]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [activeIndex]);

  const scrollToActiveThumbnail = (index, animated = true) => {
    const scrollX = index * (THUMBNAIL_SIZE + THUMBNAIL_SPACING) - width / 2 + THUMBNAIL_SIZE / 2;
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
          <Animated.View style={[styles.page, { opacity: fadeAnim }]}>
            <ExpoImage
              source={{ uri: item }}
              style={styles.image}
              placeholderContent={<PlaceHolderCard />}
              contentFit="cover"
            />
          </Animated.View>
        )}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />

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
              <Animated.View
                style={{ transform: [{ scale: activeIndex === index ? 1.1 : 1 }] }}
              >
                <ExpoImage
                  source={{ uri: image }}
                  style={styles.thumbnail}
                  contentFit="cover"
                />
              </Animated.View>
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

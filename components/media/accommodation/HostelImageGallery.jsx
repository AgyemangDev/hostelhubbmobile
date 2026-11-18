import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Text,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import PlaceHolderCard from "../../skeletons/accommodation/ImagePlaceholder";
import { useRouter } from "expo-router";
import { Button } from "../../ui";
import { colors } from "../../../constants/theme";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 430;

const HostelImageGallery = ({ images = [], onShowAllPhotos }) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 60,
  };

const handleShowAllPhotos = () => {
  // Re-encode the %2F in each Firebase URL before passing through router
  const encodedImages = images.map(url =>
    url.replace(
      /(\/o\/)(.*?)(\?)/,
      (_, pre, path, post) => `${pre}${encodeURIComponent(path)}${post}`
    )
  );

  router.push({
    pathname: "/allPhotos",
    params: {
      images: encodeURIComponent(JSON.stringify(encodedImages)),
      initialIndex: activeIndex,
    },
  });
};

  return (
    <View style={styles.container}>
      {!images.length && <View style={styles.empty}><Text style={styles.emptyText}>Photos have not been provided yet.</Text></View>}
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ExpoImage
            source={{ uri: item }}
            style={styles.image}
            placeholderContent={<PlaceHolderCard />}
            contentFit="cover"
          />
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* image counter */}
      {images.length > 0 && <View style={styles.counter}>
        <Text style={styles.counterText}>
          {activeIndex + 1} / {images.length}
        </Text>
      </View>}

      {/* show all photos */}
{images.length > 0 ? (
        <Button title="Show all photos" icon="grid-outline" variant="inverse" size="sm" compact onPress={handleShowAllPhotos} style={styles.showPhotosButton} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    marginBottom: 2,
  },

  image: {
    width: width,
    height: IMAGE_HEIGHT,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  counter: {
    position: "absolute",
    bottom: 18,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  counterText: {
    color: colors.textInverse,
    fontSize: 13,
    fontWeight: "500",
  },

  showPhotosButton: { position: "absolute", bottom: 18, left: 16 },

  showPhotosText: {
    marginLeft: 8,
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
  empty: { height: IMAGE_HEIGHT, alignItems: "center", justifyContent: "center", backgroundColor: colors.fill },
  emptyText: { color: colors.textSecondary, fontSize: 14 },
});

export default HostelImageGallery;
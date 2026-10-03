import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Feather } from "@expo/vector-icons";
import PlaceHolderCard from "../PlaceHolderCard";
import { useRouter } from "expo-router";

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
{images.length > 0 && <TouchableOpacity
  style={styles.showPhotosButton}
  onPress={handleShowAllPhotos}
>
        <Feather name="grid" size={16} color="#222" />
        <Text style={styles.showPhotosText}>Show all photos</Text>
      </TouchableOpacity>}
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
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  showPhotosButton: {
    position: "absolute",
    bottom: 18,
    left: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  showPhotosText: {
    marginLeft: 8,
    color: "#222",
    fontSize: 14,
    fontWeight: "500",
  },
  empty: { height: IMAGE_HEIGHT, alignItems: "center", justifyContent: "center", backgroundColor: "#f3f5f4" },
  emptyText: { color: "#777", fontSize: 14 },
});

export default HostelImageGallery;
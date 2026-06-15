import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const AllPhotos = () => {
  const { images, initialIndex } = useLocalSearchParams();
  const router = useRouter();

  const imageArray = JSON.parse(decodeURIComponent(images || "%5B%5D"));
  const startIndex = Number(initialIndex) || 0;

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const flatListRef = useRef(null);

  // Scroll to initial index after mount
  const handleLayout = () => {
    if (startIndex > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: startIndex,
        animated: false,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {imageArray.length}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={imageArray}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onLayout={handleLayout}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <ExpoImage
              source={{ uri: item }}
              style={styles.image}
              contentFit="contain"
              transition={200}
              onError={(e) => console.log("❌ Image error:", item, e)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default AllPhotos;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  imageContainer: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "80%" },
  closeButton: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 100,
  },
  counter: {
    position: "absolute",
    top: 55,
    right: 20,
    zIndex: 100,
  },
  counterText: { color: "#fff", fontSize: 15, fontWeight: "500" },
});
import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";

import StorageBanner from "../BannerComponents/Banner";
import StoreData from "../../assets/data/StoreData";

const { width } = Dimensions.get("window");

const StorageBannerSlider = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // auto scroll
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % StoreData.length;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(slideIndex);
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={StoreData}
        renderItem={({ item }) => (
          <StorageBanner facility={item} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* pagination dots */}
      <View style={styles.pagination}>
        {StoreData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default StorageBannerSlider;

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#610b0c",
    width: 12,
  },
});
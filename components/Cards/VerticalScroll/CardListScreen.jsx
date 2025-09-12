import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import Cads from "./Cads";
import { useRouter } from "expo-router"; // <-- 👈 useRouter not useNavigation
import SkeletonCards from "../../SkeletonCard";

const CardListScreen = ({ hostels }) => {
  const router = useRouter(); // <-- 👈

  const [loadingMore, setLoadingMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    setCurrentIndex(ITEMS_PER_PAGE);
  }, [hostels]);

  const loadMoreHostels = () => {
    if (loadingMore || currentIndex >= hostels.length) return;
    setLoadingMore(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + ITEMS_PER_PAGE);
      setLoadingMore(false);
    }, 500);
  };

  const visibleHostels = hostels.slice(0, currentIndex);

  return (
    <View style={styles.container}>
      <FlatList
        data={visibleHostels}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <Cads
            hostelId={item.id}
            hostelName={item.hostelName}
            ImageUrl={{ uri: item.frontImage }}
            institution={item.institution}
            views={item.views}
            location={item.location}
            availability={item.hostelAvailability}
            onCardPress={() =>
              router.push({
                pathname: "(Details)/[id]",
                params: { hostelId: item.id }
              })
            }
            transactionScreen={() => router.push("(ProfileScreens)")} // if you need ProfileScreens later
          />
        )}
        onEndReached={loadMoreHostels}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loadingMore ? <SkeletonCards /> : null}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 0,
  },
  flatListContent: {
    width: '100%',
  },
});

export default CardListScreen;

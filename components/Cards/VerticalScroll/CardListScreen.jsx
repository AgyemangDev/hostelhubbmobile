import React from "react";
import { StyleSheet, FlatList, View } from "react-native";
import Cads from "./Cads";
import { useRouter } from "expo-router";
import SkeletonCards from "../../Loading/SkeletonCard";

const CardListScreen = ({ hostels, loading, onEndReached }) => {
  const router = useRouter();
  const onEndReachedCalledDuringMomentum = React.useRef(false);
const uniqueHostels = React.useMemo(() => {
  const map = new Map();
  hostels.forEach(h => map.set(h.id, h));
  return Array.from(map.values());
}, [hostels]);

  return (
    <View style={styles.container}>
      <FlatList
        data={uniqueHostels}
        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }
        renderItem={({ item, index }) => (
          <Cads
            id={item.id}
            accommodation_name={item.accommodation_name}
            ImageUrl={item.front_image}
            institution={item.institution}
            views={item.views}
            location={item.location}
            availability={item.accommodation_availability}
            isLastItem={false}
            onCardPress={() =>
              router.push({
                pathname: "(Details)/[id]",
                params: { hostelId: item.id },
              })
            }
            transactionScreen={() => router.push("(ProfileScreens)")}
          />
        )}
        onEndReachedThreshold={0.4}
        ListFooterComponent={loading ? <SkeletonCards /> : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        onMomentumScrollBegin={() => {
    onEndReachedCalledDuringMomentum.current = false;
  }}
  onEndReached={() => {
    if (!onEndReachedCalledDuringMomentum.current && onEndReached) {
      onEndReachedCalledDuringMomentum.current = true;
      onEndReached();
    }
  }}  
      />
    </View>
  );
};

export default CardListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  flatListContent: {
    width: "100%",
  },
});
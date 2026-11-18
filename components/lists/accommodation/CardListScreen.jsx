// Search results: one Airbnb-style listing card per row.
import React from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import ListingCard from "../../cards/accommodation/ListingCard";
import SkeletonCards from "../../skeletons/accommodation/SkeletonCard";
import { space } from "../../../constants/theme";

const CardListScreen = ({ hostels, loading, onEndReached, ListHeaderComponent }) => {
  const router = useRouter();
  const endCalledDuringMomentum = React.useRef(false);

  const uniqueHostels = React.useMemo(() => {
    const map = new Map();
    (hostels || []).forEach((h) => map.set(h.id, h));
    return Array.from(map.values());
  }, [hostels]);

  return (
    <View style={styles.container}>
      <FlatList
        data={uniqueHostels}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            onPress={() => router.push({ pathname: "/hostel/[id]", params: { id: item.id } })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: space.xl }} />}
        ListHeaderComponent={ListHeaderComponent}
        onEndReachedThreshold={0.4}
        ListFooterComponent={loading ? <SkeletonCards /> : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        onMomentumScrollBegin={() => {
          endCalledDuringMomentum.current = false;
        }}
        onEndReached={() => {
          if (!endCalledDuringMomentum.current && onEndReached) {
            endCalledDuringMomentum.current = true;
            onEndReached();
          }
        }}
      />
    </View>
  );
};

export default CardListScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: space.xs, paddingHorizontal: 2, paddingBottom: space.xxxl },
});

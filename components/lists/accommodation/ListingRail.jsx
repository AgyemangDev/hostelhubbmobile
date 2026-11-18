import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, SectionHeader } from "../../ui";
import ListingCard from "../../cards/accommodation/ListingCard";
import EmptyHostelShimmer from "../../skeletons/accommodation/EmptyHostelShimmer";
import { space } from "../../../constants/theme";

/**
 * A titled, sideways-scrolling row of listing cards with a "See more" link.
 * Shows placeholder cards while `list` is empty.
 */
export default function ListingRail({ title, list, onSeeMore, onPressItem }) {
  return (
    <View style={styles.rail}>
      <SectionHeader
        title={title}
        style={styles.header}
        right={onSeeMore ? <Button title="See more" variant="ghost" size="sm" compact onPress={onSeeMore} /> : null}
      />
      {list?.length > 0 ? (
        <FlatList
          data={list}
          keyExtractor={(item) => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ListingCard item={item} variant="rail" onPress={() => onPressItem(item)} />}
        />
      ) : (
        <EmptyHostelShimmer />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { marginBottom: space.xxl },
  header: { paddingHorizontal: space.md, marginBottom: space.xs },
  list: { paddingHorizontal: space.md, paddingBottom: space.xs, gap: 14 },
});

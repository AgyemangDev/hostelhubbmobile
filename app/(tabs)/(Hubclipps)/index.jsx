import React, { useState, useRef, useContext, useCallback } from "react";
import { FlatList, Dimensions, StatusBar } from "react-native";
import HubClip from "../../../components/hubclipps/HubClip";
import FilterOverlay from "../../../components/hubclipps/FilterOverlay";
import AddAccommodationButton from "../../../components/ButtonComponents/AddAccommodationButton";
import EmptyFeedState from "../../../components/hubclipps/EmptyFeedState";
import { AddHubclippsContext } from "../../../context/AddHubclippsContext";
import HubClipSkeleton from "../../../components/EmptyStates/HubClipSkeleton";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function HubClippsFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const {
    hubclipps,
    loadMore,
    refresh,
    hasMore,
    loading,
    filters,
    applyFilters,
    clearFilters,
  } = useContext(AddHubclippsContext);

  const flatListRef = useRef(null);

  // ─── Viewability ─────────────────────────────────────────────────────────────
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const isAtLastItem = currentIndex === hubclipps.length - 1;

  // ─── Pagination ───────────────────────────────────────────────────────────────
  const handleEndReached = useCallback(() => {
    if (loading || !hasMore) return;
    loadMore();
  }, [loading, hasMore, loadMore]);

  // Loading state
  if (loading && hubclipps.length === 0) {
  return (
    <>
      <StatusBar hidden />
      <HubClipSkeleton />
    </>
  );
}

  // ─── Empty State ──────────────────────────────────────────────────────────────
  if (!loading && hubclipps.length === 0) {
    return (
      <>
        <StatusBar hidden />
        <EmptyFeedState />
        <FilterOverlay
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />
        <AddAccommodationButton />
      </>
    );
  }

  return (
    <>
      <StatusBar hidden />
      <FlatList
        ref={flatListRef}
        data={hubclipps}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        bounces={!(isAtLastItem && !hasMore)}
        overScrollMode="never"
        onEndReached={handleEndReached}
        onEndReachedThreshold={3}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <HubClip
            item={item}
            height={SCREEN_HEIGHT}
            isActive={index === currentIndex}
          />
        )}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />

      <FilterOverlay
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        onToggle={() => setShowFilters(!showFilters)}
      />

      <AddAccommodationButton />
    </>
  );
}
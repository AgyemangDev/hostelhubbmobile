import React, { useState, useRef, useContext, useCallback, useEffect, useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { useHubclippsById } from "../../../hooks/hubclippsContext/useHubclippsById";
import { FlatList, Dimensions, StatusBar } from "react-native";
import HubClip from "../../../components/media/hubclipps/HubClip";
import FilterOverlay from "../../../components/headers/hubclipps/FilterOverlay";
import EmptyFeedState from "../../../components/feedback/hubclipps/EmptyFeedState";
import { AddHubclippsContext } from "../../../context/AddHubclippsContext";
import HubClipSkeleton from "../../../components/skeletons/hubclipps/HubClipSkeleton";

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

  // Opened from a shared link or notification (/clips/:id): show that clip
  // first, fetching it if it isn't in the loaded page of the feed.
  const { clip: linkedClipId } = useLocalSearchParams();
  const { fetchById } = useHubclippsById();
  const [linkedClip, setLinkedClip] = useState(null);

  useEffect(() => {
    if (!linkedClipId) {
      setLinkedClip(null);
      return;
    }
    const inFeed = hubclipps.find((c) => String(c.id) === String(linkedClipId));
    if (inFeed) {
      setLinkedClip(inFeed);
      return;
    }
    let active = true;
    fetchById(linkedClipId).then((found) => {
      if (active && found) setLinkedClip(found);
    });
    return () => {
      active = false;
    };
    // fetchById is recreated each render; the id is what matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedClipId]);

  useEffect(() => {
    if (!linkedClip) return;
    setCurrentIndex(0);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [linkedClip]);

  const feed = useMemo(
    () => (linkedClip ? [linkedClip, ...hubclipps.filter((c) => c.id !== linkedClip.id)] : hubclipps),
    [linkedClip, hubclipps]
  );

  // ─── Viewability ─────────────────────────────────────────────────────────────
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const isAtLastItem = currentIndex === feed.length - 1;

  // ─── Pagination ───────────────────────────────────────────────────────────────
  const handleEndReached = useCallback(() => {
    if (loading || !hasMore) return;
    loadMore();
  }, [loading, hasMore, loadMore]);

  // Loading state
  if (loading && feed.length === 0) {
  return (
    <>
      <StatusBar hidden />
      <HubClipSkeleton />
    </>
  );
}

  // ─── Empty State ──────────────────────────────────────────────────────────────
  if (!loading && feed.length == 0) {
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
      </>
    );
  }

  return (
    <>
      <StatusBar hidden />
      <FlatList
        ref={flatListRef}
        data={feed}
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

    </>
  );
}
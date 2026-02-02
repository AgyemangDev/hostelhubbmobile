import { View } from 'react-native';
import React, { useMemo } from 'react';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';
import { shuffleArray } from '../../../utils/arrayUtils';

const PopularHostel = ({ hostels, loading, loadMore, hasMore }) => {
  const shuffledAndSlicedHostels = useMemo(() => {
    const popularHostels = (hostels || []).filter(
      (hostel) => Number(hostel?.views) > 3500
    );
    return shuffleArray(popularHostels);
  }, [hostels]);

  const handleEndReached = () => {
    if (!loading && hasMore) loadMore();
  };

  return (
    <View style={{ flex: 1 }}>
      <CardListScreen
        hostels={shuffledAndSlicedHostels}
        onEndReached={handleEndReached}
        loading={loading}
      />
    </View>
  );
};

export default PopularHostel;
import { View } from 'react-native';
import React, { useMemo } from 'react';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';
import { shuffleArray } from '../../../utils/arrayUtils';

const NewHostels = ({ hostels, loading, loadMore, hasMore }) => {
  const filteredNewHostels = useMemo(() => {
    const filtered = (hostels || []).filter(
      (hostel) => Number(hostel?.views) < 600
    );
    return shuffleArray(filtered).slice(0, 20);
  }, [hostels]);

  const handleEndReached = () => {
    if (!loading && hasMore && loadMore) {
      loadMore();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CardListScreen
        hostels={filteredNewHostels}
        loading={loading}
        onEndReached={handleEndReached}
      />
    </View>
  );
};

export default NewHostels;
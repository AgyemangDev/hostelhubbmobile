import { View } from 'react-native';
import React, { useMemo } from 'react';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';
import { shuffleArray } from '../../../utils/arrayUtils';

const Homestel = ({ hostels, loading, loadMore, hasMore }) => {
  const filteredHomestels = useMemo(() => {
    return (hostels || []).filter(
      (item) => item.category?.toLowerCase() === 'homestel'
    );
  }, [hostels]);

  const handleEndReached = () => {
    if (!loading && hasMore && loadMore) {
      loadMore();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CardListScreen
        hostels={shuffleArray(filteredHomestels)}
        loading={loading}
        onEndReached={handleEndReached}
      />
    </View>
  );
};

export default Homestel;
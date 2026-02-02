import { StyleSheet, View } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';
import { shuffleArray } from '../../../utils/arrayUtils';

const AllHostels = ({ hostels, loading, loadMore, hasMore }) => {
  const [displayHostels, setDisplayHostels] = useState(hostels || []);

  // Shuffle only when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (hostels && hostels.length > 0) {
        const shuffled = shuffleArray(hostels);
        setDisplayHostels(shuffled);
      }
    }, [hostels])
  );

  // Keep displayHostels updated when hostels change
  useEffect(() => {
    if (hostels && hostels.length > 0) {
      setDisplayHostels(shuffleArray(hostels));
    }
  }, [hostels]);

  const handleEndReached = () => {
    if (!loading && hasMore) {
      loadMore();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CardListScreen
        hostels={displayHostels}
        loading={loading}
        onEndReached={handleEndReached}
      />
    </View>
  );
};

export default AllHostels;

const styles = StyleSheet.create({});
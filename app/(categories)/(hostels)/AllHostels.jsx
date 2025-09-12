import { StyleSheet, View } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';
import { shuffleArray } from '../../../utils/arrayUtils';

const AllHostels = ({ hostels }) => {
  const [displayHostels, setDisplayHostels] = useState(hostels || []);
  useFocusEffect(
    useCallback(() => {
      // Shuffle only when screen is re-focused (navigated back to)
      if (hostels && hostels.length > 0) {
        const shuffled = shuffleArray(hostels);
        setDisplayHostels(shuffled);
      }
    }, [hostels])
  );

  return (
    <View style={{ flex: 1 }}>
      <CardListScreen hostels={displayHostels} />
    </View>
  );
};

export default AllHostels;

const styles = StyleSheet.create({});

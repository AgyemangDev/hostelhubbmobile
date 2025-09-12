import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';
import { shuffleArray } from '../../../utils/arrayUtils';

const PopularHostel = ({ hostels }) => {
  const shuffledAndSlicedHostels = useMemo(() => {
    const popularHostels = (hostels || []).filter(
      (hostel) => Number(hostel?.views) > 400
    );
    return shuffleArray(popularHostels).slice(0, 20);
  }, [hostels]);

  return (
    <View style={{ flex: 1 }}>
      <CardListScreen hostels={shuffledAndSlicedHostels} />
    </View>
  );
};

export default PopularHostel;

const styles = StyleSheet.create({});

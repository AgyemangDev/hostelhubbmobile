import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';
import { shuffleArray } from '../../../utils/arrayUtils';

const NewHostels = ({ hostels }) => {
  const newHostels = useMemo(() => {
    const filtered = (hostels || []).filter(
      (hostel) => Number(hostel?.views) < 400
    );

    return shuffleArray(filtered).slice(0, 20);
  }, [hostels]);

  return (
    <View style={{ flex: 1 }}>
      <CardListScreen hostels={newHostels} />
    </View>
  );
};

export default NewHostels;

const styles = StyleSheet.create({});

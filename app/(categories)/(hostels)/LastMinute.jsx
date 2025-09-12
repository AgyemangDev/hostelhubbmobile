import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';
import { shuffleArray } from '../../../utils/arrayUtils';

const LastMinute = ({ hostels }) => {
  const shuffledAndSlicedHostels = useMemo(() => {
    const availableHostels = (hostels || []).filter(
      (hostel) => hostel?.hostelAvailability !== false
    );
    return shuffleArray(availableHostels).slice(0, 20);
  }, [hostels]);

  return (
    <View style={{ flex: 1 }}>
      <CardListScreen hostels={shuffledAndSlicedHostels} />
    </View>
  );
};

export default LastMinute;

const styles = StyleSheet.create({});

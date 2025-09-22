// screens/hostels/Homestel.jsx
import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';
import { shuffleArray } from '../../../utils/arrayUtils';

const Homestel = ({ hostels }) => {
  const homestels = useMemo(() => {
    return (hostels || []).filter(
      (item) => item.category?.toLowerCase() === 'homestel'
    );
  }, [hostels]);

  return (
    <View style={{ flex: 1 }}>
      <CardListScreen hostels={shuffleArray(homestels)} />
    </View>
  );
};

export default Homestel;

const styles = StyleSheet.create({});

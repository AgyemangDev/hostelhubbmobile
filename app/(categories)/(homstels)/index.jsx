import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';
import { useHostels } from '../../../context/HostelsContext';
import CardListScreen from '../../../components/Cards/VerticalScroll/CardListScreen';

const index = () => {
  const { hostels, loading } = useHostels();

  const homstelHostels = hostels.filter(
    (hostel) => hostel.category?.toLowerCase() === 'homestel'
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#610b0c" />
      ) : (
        <CardListScreen hostels={homstelHostels} />
      )}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal:15
  },
});

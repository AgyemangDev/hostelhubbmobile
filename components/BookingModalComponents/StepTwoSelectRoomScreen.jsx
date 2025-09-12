import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RoomTypeSection from './RoomTypeSelection';

const StepTwoSelectRoomScreen = ({ hostelData, handleSelectPaymentRange, formData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Room Type</Text>
      <RoomTypeSection
        roomTypes={hostelData?.paymentRanges}
        selectedRoomType={formData.selectedRoomType}
        selectedPayment={formData.selectedPayment}
        onSelect={handleSelectPaymentRange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});

export default StepTwoSelectRoomScreen;

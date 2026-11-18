import React from 'react';
import { View, StyleSheet } from 'react-native';
import RoomTypeSection from './RoomTypeSelection';

const StepSelectAccommodationScreen = ({ hostelData, handleSelectPaymentRange, formData }) => {
  return (
    <View style={styles.container}>
      <RoomTypeSection
        roomTypes={hostelData?.paymentRanges}
        selectedRoomType={formData?.selectedRoomType}
        selectedPayment={formData.selectedPayment}
        onSelect={handleSelectPaymentRange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 8 },
});

export default StepSelectAccommodationScreen;
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import StepSelectAccommodationScreen from './StepSelectAccommodationScreen';
import COLORS from '../../constants/Colors';

const BookingStepper = ({
  hostelData,
  formData,
  handleSelectPaymentRange,
  handleBooking,
}) => {

  const isBookingReady = () =>
    formData.selectedPayment && formData.selectedRoomType;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Reservation at {hostelData?.accommodation_name}
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
<StepSelectAccommodationScreen
  hostelData={hostelData}
  formData={formData} 
  handleSelectPaymentRange={handleSelectPaymentRange}
/>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.button,
          !isBookingReady() && { opacity: 0.5 }
        ]}
        disabled={!isBookingReady()}
        onPress={handleBooking}
      >
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookingStepper;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.button,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});

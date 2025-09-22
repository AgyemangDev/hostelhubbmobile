import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import BookingHeader from '../components/Headers/BookingHeader';
import EditPersonalInfoSection from '../components/StoreComponent/EditPersonalInfoSection';
import DatesSection from '../components/StoreComponent/DatesSection';
import LocationsSection from '../components/StoreComponent/LocationsSection';
import ItemsSection from '../components/StoreComponent/ItemsSection';
import SummarySection from '../components/StoreComponent/SummarySection';

const StorageEdit = () => {
  const { booking } = useLocalSearchParams();
  const parsedBooking = booking ? JSON.parse(booking) : null;
  
  const [bookingData, setBookingData] = useState(parsedBooking);

  const handleLocationUpdate = (newDeliveryLocation) => {
    setBookingData(prev => ({
      ...prev,
      deliveryLocation: newDeliveryLocation
    }));
    // Here you would typically make an API call to update the backend
    console.log('Updated delivery location:', newDeliveryLocation);
  };

  if (!bookingData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking data not found.</Text>
        <Text style={styles.errorSubtext}>
          Please check your booking reference and try again.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BookingHeader bookingReference={bookingData.bookingReference} />
      
      <EditPersonalInfoSection 
        personalInfo={{
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone
        }}
      />
      
      <DatesSection 
        dates={{
          bookingDate: bookingData.bookingDate,
          pickupDate: bookingData.pickupDate,
          deliveryDate: bookingData.deliveryDate
        }}
      />
      
      <LocationsSection 
        locations={{
          pickupLocation: bookingData.pickupLocation,
          deliveryLocation: bookingData.deliveryLocation,
        }}
        deliveryDate={bookingData.deliveryDate}
        onUpdateLocation={handleLocationUpdate}
        bookingReference={bookingData.bookingReference}

      />
      
      <ItemsSection items={bookingData.items} />
      
      <SummarySection 
        summary={{
          status: bookingData.status,
          totalPrice: bookingData.totalPrice
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f7fa",
    minHeight: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: "#f5f7fa",
  },
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#dc3545",
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default StorageEdit;
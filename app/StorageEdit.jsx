import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { UserContext } from '../context/UserContext';

import BookingHeader from '../components/Headers/BookingHeader';
import DatesSection from '../components/StoreComponent/DatesSection';
import LocationsSection from '../components/StoreComponent/LocationsSection';
import ItemsSection from '../components/StoreComponent/ItemsSection';
import DeliveryStatusSection from '../components/StoreComponent/DeliveryStatusSection';

const StorageEdit = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useContext(UserContext); // ✅ useContext here

  const { booking } = useLocalSearchParams();
  const parsedBooking = booking ? JSON.parse(booking) : null;

  const [bookingData, setBookingData] = useState(parsedBooking);

  const handleStatusUpdate = (newStatus) => {
    setBookingData(prev => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handleLocationUpdate = (newDeliveryLocation) => {
    setBookingData(prev => ({
      ...prev,
      deliveryLocation: newDeliveryLocation,
    }));

    console.log('Updated delivery location:', newDeliveryLocation);
  };

  if (!bookingData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Booking data not found.</Text>
          <Text style={styles.errorSubtext}>
            Please check your booking reference and try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <BookingHeader
          bookingReference={bookingData.bookingReference}
          summary={{
            status: bookingData.status,
            totalPrice: bookingData.totalPrice,
          }}
        />

        <DatesSection
          dates={{
            bookingDate: bookingData.bookingDate,
            pickupDate: bookingData.pickupDate,
            deliveryDate: bookingData.deliveryDate,
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

        <DeliveryStatusSection
          status={bookingData.status}
          bookingReference={bookingData.bookingReference}
          onStatusUpdate={handleStatusUpdate}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          router={router}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  container: {
    padding: 16,
    paddingBottom: 32,
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

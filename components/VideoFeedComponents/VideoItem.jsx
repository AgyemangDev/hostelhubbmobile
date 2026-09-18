// components/video/VideoItem.jsx
import React, { useCallback, useContext, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import VideoPlayer from './VideoPlayer';
import VideoOverlay from './VideoOverlay';
import HostelInfo from './HostelInfo';
import { useRouter } from 'expo-router';
import { UserContext } from '../../context/UserContext';
import { handleBookingProcess } from '../../services/bookingServices';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoItem = ({ item, index, isActive, shouldRestart }) => {
  const { user, userInfo, patchUserData, currentExpoToken } = useContext(UserContext);
  const router = useRouter();
  const [isBooking, setIsBooking] = useState(false);

  // Previously an independent Firestore-only implementation
  // (showBookingAlert/proceedWithPaymentAndBooking in the old BookingAlert.jsx)
  // that wrote straight to Firestore and bypassed the Postgres backend
  // entirely, with its own booking-count gate. Now routed through the same
  // handleBookingProcess used by bookingModal.jsx and HubClip.jsx, so the
  // video feed goes through the same booking-creation + direct-Paystack
  // payment flow as every other entry point, with no booking-count limit.
  const handleBookNow = useCallback(async () => {
    if (!user || !userInfo || isBooking) return;

    setIsBooking(true);
    try {
      const firebaseToken = await user.getIdToken(true);

      await handleBookingProcess({
        user,
        userInfo,
        formData: {
          selectedRoomType: item.roomType,
          selectedPayment: item.price,
        },
        hostelId: item.id,
        bookingSource: "videofeed",
        patchUserData,
        currentExpoToken,
        firebaseToken,
        onSuccess: () => router.push("/(tabs)/(bookings)"),
        onError: () => {},
        onFinally: () => setIsBooking(false),
      });
    } catch (err) {
      console.error('Booking failed:', err);
      setIsBooking(false);
    }
  }, [user, userInfo, patchUserData, currentExpoToken, item, router, isBooking]);

  return (
    <View style={styles.container}>
<VideoPlayer
  videoUrl={item.videoUrl}
  isActive={isActive}
  shouldRestart={shouldRestart} // ✅ Add this line
/>
      <VideoOverlay>
<View style={styles.infoWrapper}>
   <HostelInfo hostel={item} onBookNow={handleBookNow} />
</View>
      </VideoOverlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  leftInfo: {
    flex: 1,
    paddingRight: 10,
  },
  rightButton: {
    justifyContent: 'flex-end',
  },
});


export default VideoItem;

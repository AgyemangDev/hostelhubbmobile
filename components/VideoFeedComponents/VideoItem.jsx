// components/video/VideoItem.jsx
import React, { useCallback, useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import VideoPlayer from './VideoPlayer';
import VideoOverlay from './VideoOverlay';
import HostelInfo from './HostelInfo';
import { showBookingAlert } from './BookingAlert';
import { useRouter } from 'expo-router';
import { UserContext } from '../../context/UserContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoItem = ({ item, index, isActive, shouldRestart }) => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const router = useRouter();

  const handleBookNow = useCallback(() => {
    showBookingAlert(
      item, // hostel data
      () => {
        // Optional success callback
        console.log('Navigating to booking with data:', {
          hostelId: item.id,
          hostelName: item.hostelName,
          roomType: item.roomType,
          price: item.price,
          location: item.location,
          porterNumber: item.porter?.number,
          porterName: item.porter?.number,
        });
      },
      userInfo, // user information
      setUserInfo, // function to update user info
      router // router for navigation
    );
  }, [item, userInfo, setUserInfo, router]);

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
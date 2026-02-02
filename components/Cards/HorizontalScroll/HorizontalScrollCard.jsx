import { TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useContext } from 'react';
import { db, auth } from '../../../app/firebase/FirebaseConfig';
import { UserContext } from '../../../context/UserContext';
import { handleHostelCardPress } from '../../../utils/PaymentCheck';
import HostelImage from './HostelImage';
import FavoriteButton from '../../ButtonComponents/FavoriteButton';
import HostelOverlay from './HostelOverlay';
import { addRecentlyViewedHostel } from "../../../utils/recentlyViewedUtils";

const HorizontalScrollCard = ({
  hostelName,
  location,
  institution,
  ImageUrl,
  availability,
  isLastItem,
  isFirstItem,
  onCardPress,
  hostelId,
  views,
  transactionScreen,
  price = "74",
  rating = "4.8",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  
  const { userInfo } = useContext(UserContext);
  const user = auth.currentUser;

  // Handle card press with swipe detection
  const handleCardPress = async () => {
    // Only treat as a click if there was minimal horizontal movement
    const horizontalMovement = Math.abs(touchEndX - touchStartX);
    
    if (horizontalMovement < 10) { // Increased threshold from 5 to 10 for better UX
      // Add to recently viewed
      if (hostelId) {
        await addRecentlyViewedHostel(hostelId);
      }

      // Navigate to hostel details
      handleHostelCardPress({
        userInfo,
        user,
        db,
        onCardPress,
        transactionScreen,
        setIsLoading,
      });
    }
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.nativeEvent.pageX);
  };

  const handleTouchEnd = (e) => {
    setTouchEndX(e.nativeEvent.pageX);
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={[
        styles.card, 
        isLastItem && styles.lastCard,
        isFirstItem && styles.firstCard,
      ]}
      activeOpacity={0.95}
      delayPressIn={150} 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={isLoading}
    >
      <HostelImage source={ImageUrl} />
      <FavoriteButton accommodationId={hostelId} />
      <HostelOverlay 
        hostelName={hostelName} 
        location={location} 
        institution={institution}
        availability={availability} 
        views={views}
        hostelId={hostelId}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  firstCard: {
    marginLeft: 14, 
  },
  lastCard: {
    marginRight: 0,
  },
});

export default HorizontalScrollCard;
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { db, auth } from '../../../app/firebase/FirebaseConfig';
import { ReviewsContext } from '../../../context/ReviewsContext';
import { UserContext } from '../../../context/UserContext';
import { fetchStarStatus, toggleStarStatus } from '../../../utils/firebaseUtils';
import { handleHostelCardPress } from '../../../utils/PaymentCheck';
import HostelImage from './HostelImage';
import FavoriteButton from './FavoriteButton';
import HostelOverlay from './HostelOverlay';
import { StarredHostelsContext } from '../../../context/StarredHostelsContext';
import {addRecentlyViewedHostel } from "../../../utils/recentlyViewedUtils"

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
  const { starredMap, fetchStarredStatus, toggleStar } = useContext(StarredHostelsContext);
  const { reviews } = useContext(ReviewsContext);
  const { userInfo } = useContext(UserContext);
  const user = auth.currentUser;

  useEffect(() => {
    fetchStarredStatus(hostelId);
  }, [hostelId]);
  
  const isStarred = starredMap[hostelId] ?? false;
  
  const handleToggleStar = (e) => {
    e.stopPropagation();
    toggleStar(hostelId);
  };

  useEffect(() => {
    const loadStarStatus = async () => {
      if (user) {
        const status = await fetchStarStatus(db, user.uid, hostelId);
        setIsStarred(status);
      }
    };
    loadStarStatus();
  }, [user, hostelId]);


  const handleCardPress = async () => {
    // Only treat as a click if there was minimal horizontal movement
    if (Math.abs(touchEndX - touchStartX) < 5) {
      await addRecentlyViewedHostel(hostelId);

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
      style={[styles.card, isLastItem && styles.lastCard,isFirstItem && styles.firstCard,]}
      activeOpacity={0.95}
      delayPressIn={150} 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <HostelImage source={ImageUrl} />
      <FavoriteButton isStarred={isStarred} onPress={handleToggleStar} />
      <HostelOverlay 
        hostelName={hostelName} 
        location={ location} 
        institution={institution}
        availability={availability} 
        views={views}
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
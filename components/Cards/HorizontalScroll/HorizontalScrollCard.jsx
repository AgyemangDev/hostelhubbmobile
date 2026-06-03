import { TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../../../app/firebase/FirebaseConfig';
import { UserContext } from '../../../context/UserContext';
import { handleHostelCardPress } from '../../../utils/PaymentCheck';
import HostelImage from './HostelImage';
import FavoriteButton from '../../ButtonComponents/FavoriteButton';
import HostelOverlay from './HostelOverlay';
import { addRecentlyViewedHostel } from "../../../utils/recentlyViewedUtils";
import ClientLogIn from '../../../app/(Client)/ClientLogIn';

const HorizontalScrollCard = ({
  hostelName, location, institution, ImageUrl, availability,
  isLastItem, isFirstItem, onCardPress, hostelId, views,
  transactionScreen, price = "74", rating = "4.8",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [showAuth, setShowAuth] = useState(false);

  const { userInfo, refreshUserInfo } = useContext(UserContext);
  const user = auth.currentUser;

  // Refresh user data every time the user navigates back to this screen
  // This picks up noofbooking increments that happened during a booking flow
  useFocusEffect(
    useCallback(() => {
      refreshUserInfo(true);
    }, [refreshUserInfo])
  );

  const handleCardPress = async () => {
    const horizontalMovement = Math.abs(touchEndX - touchStartX);
    if (horizontalMovement < 10) {
      if (hostelId) await addRecentlyViewedHostel(hostelId);
      handleHostelCardPress({
        userInfo,
        user,
        onCardPress,
        transactionScreen,
        setIsLoading,
        showAuthModal: () => setShowAuth(true),
        refreshUserInfo,
      });
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleCardPress}
        style={[styles.card, isLastItem && styles.lastCard, isFirstItem && styles.firstCard]}
        activeOpacity={0.95}
        delayPressIn={150}
        onTouchStart={(e) => setTouchStartX(e.nativeEvent.pageX)}
        onTouchEnd={(e) => setTouchEndX(e.nativeEvent.pageX)}
        disabled={isLoading}
      >
        <HostelImage source={ImageUrl} />
        <FavoriteButton accommodationId={hostelId} />
        <HostelOverlay
          hostelName={hostelName} location={location} institution={institution}
          availability={availability} views={views} hostelId={hostelId}
        />
      </TouchableOpacity>

      <Modal visible={showAuth} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAuth(false)}>
        <ClientLogIn onClose={() => setShowAuth(false)} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300, height: 240, borderRadius: 16, overflow: 'hidden',
    marginRight: 12, backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  firstCard: { marginLeft: 14 },
  lastCard: { marginRight: 0 },
});

export default HorizontalScrollCard;
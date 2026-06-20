import { Pressable, StyleSheet, View, Animated, Modal } from "react-native";
import React, { useState, useContext, useRef } from "react";
import { ReviewsContext } from "../../../context/ReviewsContext";
import { UserContext } from "../../../context/UserContext";
import { auth } from "../../../app/firebase/FirebaseConfig";
import ImageSection from "./ImageSection";
import FavoriteButton from "../../ButtonComponents/FavoriteButton";
import ContentSection from "./ContentSection";
import { addRecentlyViewedHostel } from "../../../utils/recentlyViewedUtils";
import { handleHostelCardPress } from "../../../utils/PaymentCheck";
import ClientLogIn from "../../../app/(Client)/ClientLogIn";

const HostelCard = ({
  accommodation_name, location, institution, ImageUrl,
  availability, isLastItem, onCardPress, id, transactionScreen, views,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { reviews } = useContext(ReviewsContext);
  const { userInfo, refreshUserInfo } = useContext(UserContext);
  const user = auth.currentUser;

  const handleCardPress = async () => {
    await addRecentlyViewedHostel(id);
    handleHostelCardPress({
      userInfo, user, onCardPress, transactionScreen,
      showAuthModal: () => setShowAuth(true),
      refreshUserInfo,
    });
  };

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const reviewCount = reviews.filter(r => r.hostelId === id).length;
  const reviewText = reviewCount === 0 ? "No reviews yet" : `${reviewCount} review${reviewCount > 1 ? "s" : ""}`;

  return (
    <>
      <Animated.View style={[styles.container, isLastItem && styles.lastCard, { transform: [{ scale: scaleAnim }] }]}>
        <Pressable onPress={handleCardPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <View style={styles.imageContainer}>
            <ImageSection ImageUrl={ImageUrl} setImageLoaded={setImageLoaded} availability={availability} />
            <FavoriteButton accommodationId={id} />
          </View>
          <ContentSection
            id={id}
            accommodation_name={accommodation_name}
            location={location}
            institution={institution}
            reviewText={reviewText}
            views={views}
            availability={availability}
          />
        </Pressable>
      </Animated.View>

      <Modal visible={showAuth} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAuth(false)}>
        <ClientLogIn onClose={() => setShowAuth(false)} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  lastCard: { marginBottom: 100 },
  imageContainer: { position: 'relative' },
});

export default HostelCard;
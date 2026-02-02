import { Pressable, StyleSheet, View, Animated } from "react-native";
import React, { useState, useContext, useRef } from "react";
import { ReviewsContext } from "../../../context/ReviewsContext";
import { UserContext } from "../../../context/UserContext";
import { auth } from "../../../app/firebase/FirebaseConfig";
import ImageSection from "./ImageSection";
import FavoriteButton from "../../ButtonComponents/FavoriteButton";
import ContentSection from "./ContentSection";
import { addRecentlyViewedHostel } from "../../../utils/recentlyViewedUtils";
import { handleHostelCardPress } from "../../../utils/PaymentCheck";

const HostelCard = ({
  accommodation_name,
  location,
  institution,
  ImageUrl,
  availability,
  isLastItem,
  onCardPress,
  id,
  transactionScreen,
  views,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { reviews } = useContext(ReviewsContext);
  const { userInfo } = useContext(UserContext);
  const user = auth.currentUser;

  const handleCardPress = async () => {
    await addRecentlyViewedHostel(id);
    handleHostelCardPress({ userInfo, user, onCardPress, transactionScreen });
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const reviewCount = reviews.filter(r => r.hostelId === id).length;
  const reviewText = reviewCount === 0 ? "No reviews yet" : `${reviewCount} review${reviewCount > 1 ? "s" : ""}`;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, isLastItem && styles.lastCard]}
      >
        <View style={styles.imageContainer}>
          <ImageSection ImageUrl={ImageUrl} setImageLoaded={setImageLoaded} />
          <FavoriteButton accommodationId={id} style={styles.favoriteButton} />
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
  );
};

const styles = StyleSheet.create({
  container: { 
    marginBottom: 20, 
    borderRadius: 10, 
    overflow: "hidden" 
  },
  card: {
    backgroundColor: "#fff",
    elevation: 3,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  lastCard: { 
    marginBottom: 100 
  },
  imageContainer: { 
    position: "relative" 
  },
  favoriteButton: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    zIndex: 10, 
    elevation: 10 
  },
});

export default HostelCard;
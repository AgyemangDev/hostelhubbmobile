// HostelCard.js
import { Pressable, StyleSheet, View } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { ReviewsContext } from "../../../context/ReviewsContext";
import { UserContext } from "../../../context/UserContext";
import { StarredHostelsContext } from "../../../context/StarredHostelsContext";
import { auth, db } from "../../../app/firebase/FirebaseConfig";
import { formatViews } from "../../../utils/firebaseUtils";
import { handleHostelCardPress } from "../../../utils/PaymentCheck";
import ImageSection from "./ImageSection";
import FavoriteButton from "../HorizontalScroll/FavoriteButton";
import ContentSection from "./ContentSection";
import { addRecentlyViewedHostel } from "../../../utils/recentlyViewedUtils";

const HostelCard = ({
  hostelName,
  location,
  institution,
  ImageUrl,
  availability,
  isLastItem,
  onCardPress,
  hostelId,
  transactionScreen,
  views,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const scale = useSharedValue(1);

  const { reviews } = useContext(ReviewsContext);
  const { userInfo } = useContext(UserContext);
  const { starredMap, fetchStarredStatus, toggleStar } = useContext(StarredHostelsContext);
  const user = auth.currentUser;

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    fetchStarredStatus(hostelId);
  }, [hostelId]);

  const isStarred = starredMap[hostelId] ?? false;

  const handleToggleStar = (e) => {
    e.stopPropagation();
    toggleStar(hostelId);
  };

  const handleCardPress = async () => {
    
    await addRecentlyViewedHostel(hostelId);

    handleHostelCardPress({
      userInfo,
      user,
      db,
      onCardPress,
      transactionScreen,
    });
  };

  const reviewCount = reviews.filter((review) => review.hostelId === hostelId).length;
  const reviewText = reviewCount === 0 ? "No reviews yet" : `${reviewCount} review${reviewCount > 1 ? "s" : ""}`;
  const formattedViews = formatViews(views);

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <Pressable
        onPress={handleCardPress}
        onPressIn={() => (scale.value = withSpring(0.98))}
        onPressOut={() => (scale.value = withSpring(1))}
        style={[styles.card, isLastItem && styles.lastCard]}
      >
        <View style={styles.imageContainer}>
          <ImageSection
            ImageUrl={ImageUrl}
            setImageLoaded={setImageLoaded}
          />
          <FavoriteButton
            isStarred={isStarred}
            onPress={handleToggleStar}
            style={styles.favoriteButton} 
          />
        </View>
        <ContentSection
          hostelName={hostelName}
          location={location}
          institution={institution}
          reviewText={reviewText}
          views={formattedViews}
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
    overflow: "hidden",
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
    marginBottom: 100,
  },
  imageContainer: {
    position: "relative",
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    elevation: 10,
  },
});

export default HostelCard;
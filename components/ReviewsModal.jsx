import React, { useEffect, useState, useContext } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReviewsContext } from "../context/ReviewsContext";
import EmptyState from "../components/BookingsComponent/EmptyState";

const ReviewsModal = ({ visible, onClose, hostelId }) => {
  const { reviews } = useContext(ReviewsContext);
  const [loading, setLoading] = useState(true);
  const hostelReviews = reviews
  .filter((review) => review.hostelId === hostelId)
  .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  useEffect(() => {
    if (hostelId && visible) {
      setLoading(false);
    }
  }, [hostelId, visible]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name="star"
          size={18}
          color={i <= rating ? "gold" : "#ddd"}
        />
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent 
      onRequestClose={onClose} // Ensures modal closes on back button (Android)
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Reviews</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading reviews...</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.reviewsContainer}>
              {hostelReviews.length > 0 ? (
                <>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Reviews are given by present and past residents of this hostel</Text>
                  {hostelReviews.map((review) => (
                    <View key={review.id} style={styles.reviewItem}>
                      <View style={styles.reviewContent}>
                        {renderStars(review.rating)}
                        <Text style={styles.reviewText}>{review.review}</Text>
                        <Text style={styles.reviewer}>{review.userName}</Text>
                        <Text style={styles.dateText}>
                          {formatDate(review.createdAt)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              ) : (
                <EmptyState message="No Reviews Yet" />
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "80%",
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#ff5a5f",
    borderRadius: 20,
    padding: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 20,
  },
  reviewsContainer: {
    paddingBottom: 40,
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  reviewContent: {
    flex: 1,
    justifyContent: "center",
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 0,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  reviewer: {
    fontSize: 13,
    color: "#888",
    paddingBottom:5
  },
});

export default ReviewsModal;

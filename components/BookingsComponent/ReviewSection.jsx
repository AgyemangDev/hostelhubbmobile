import React, { useState,useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';
import { db } from '../../app/firebase/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { UserContext } from '../../context/UserContext';


const ReviewSection = ({ bookingId, userId, hostelId, adminId }) => {
  const {userInfo} = useContext(UserContext)
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const userEmail = userInfo.email
  const userName = userInfo.firstName

  const handleReviewSubmit = async () => {
    if (rating > 0 && review.length >= 5) {
      setLoading(true); // Show loading indicator
      try {
        // Add review to Firestore
        await addDoc(collection(db, 'Reviews'), {
          userId,
          hostelId,
          bookingId,
          adminId,
          rating,
          review,
          userEmail,
          userName,
          createdAt: new Date() // Optionally store the creation date
        });

        // Clear the input fields
        setReview('');
        setRating(0);
        
        // Show success alert
        Alert.alert("Review Sent", "You just helped someone make better decisions!");
      } catch (error) {
        console.error("Error adding review: ", error);
        Alert.alert("Error", "There was an issue submitting your review. Please try again.");
      } finally {
        setLoading(false); // Hide loading indicator
      }
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
        <FontAwesome
          name="star"
          size={32}
          color={index < rating ? '#FFD700' : '#D3D3D3'}
          style={styles.star}
        />
      </TouchableOpacity>
    ));
  };

  const ratingMessage = [
    'Tap a star to rate',
    'Very Dissatisfied',
    'Dissatisfied',
    'Neutral',
    'Satisfied',
    'Very Satisfied'
  ];

  const isSubmitEnabled = rating > 0 && review.length >= 5;

  return (
    <View style={styles.container}>
      <Text style={styles.introText}>
        Your reviews go a long way in helping others make the right choices about the hostel they want to stay in based on your experience. Kindly don't forget to give a review about your current hostel. 
        Reviews are shown anonymously.
      </Text>
      <Text style={styles.title}>Review & Recommendation</Text>
      <View style={styles.starsContainer}>{renderStars()}</View>
      {rating > 0 && (
        <Text style={styles.ratingText}>{ratingMessage[rating]}</Text>
      )}
      <TextInput
        placeholder="Share your experience or recommendations"
        value={review}
        onChangeText={setReview}
        style={styles.input}
        multiline
        placeholderTextColor={COLORS.placeholder}
      />
      <TouchableOpacity
        style={[styles.submitButton, isSubmitEnabled ? styles.enabledButton : styles.disabledButton]}
        onPress={handleReviewSubmit}
        disabled={!isSubmitEnabled || loading} // Disable button if loading
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" /> // Show activity indicator while loading
        ) : (
          <Text style={styles.submitButtonText}>Submit Review</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  introText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  star: {
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 6,
  },
  input: {
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    marginTop: 10,
    backgroundColor: '#F9F9F9',
    color: '#333',
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  enabledButton: {
    backgroundColor: COLORS.background,
  },
  disabledButton: {
    backgroundColor: '#A5A5A5',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewSection;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Reviews</Text>
      {reviews.map((review, index) => (
        <View key={index} style={styles.reviewItem}>
          <View style={styles.header}>
            <Text style={styles.reviewerName}>{review.reviewerName}</Text>
            <Text style={styles.rating}>⭐ {review.rating}</Text>
          </View>
          <Text style={styles.comment}>{review.comment}</Text>
        </View>
      ))}
    </View>
  );
};

export default ProductReviews;

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  reviewItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  rating: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: '500',
  },
  comment: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
});

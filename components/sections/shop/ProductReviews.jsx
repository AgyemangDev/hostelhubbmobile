import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from "../../../constants/theme";

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
    borderTopColor: colors.border,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: colors.text,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.fill,
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
    color: colors.text,
  },
  rating: {
    fontSize: 12,
    color: colors.warningText,
    fontWeight: '500',
  },
  comment: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

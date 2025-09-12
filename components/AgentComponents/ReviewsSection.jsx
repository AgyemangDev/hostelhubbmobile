import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const formatDate = (timestamp) => {
  let date;
  if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }
  if (isNaN(date)) return 'Recent';

  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
      ? 'rd'
      : 'th';
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${day}${suffix} ${month}, ${year}`;
};

const RatingStars = ({ rating }) => (
  <View style={styles.starsContainer}>
    {[1, 2, 3, 4, 5].map(star => (
      <Ionicons
        key={star}
        name={star <= rating ? 'star' : 'star-outline'}
        size={14}
        color={star <= rating ? '#FFD700' : '#ccc'}
        style={{ marginRight: 2 }}
      />
    ))}
  </View>
);

const ReviewItem = ({ review }) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <View style={styles.reviewerInfo}>
        <Text style={styles.reviewerName}>{review.userName}</Text>
        <RatingStars rating={review.rating} />
      </View>
      <Text style={styles.reviewDate}>
        {review.createdAt ? formatDate(review.createdAt) : 'Recent'}
      </Text>
    </View>
    <Text style={styles.reviewComment}>{review.reviewText}</Text>
  </View>
);

const ReviewsSection = ({ reviews }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      const dateA = new Date(a.createdAt?.seconds * 1000 || a.createdAt);
      const dateB = new Date(b.createdAt?.seconds * 1000 || b.createdAt);
      return dateB - dateA;
    });
  }, [reviews]);

  const visibleReviews = sortedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < sortedReviews.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, sortedReviews.length));
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="chatbubbles-outline" size={20} color="#007AFF" />
        <Text style={styles.sectionTitle}>Reviews</Text>
        <View style={styles.reviewCount}>
          <Text style={styles.reviewCountText}>{reviews.length}</Text>
        </View>
      </View>

      {visibleReviews.map(review => (
        <ReviewItem key={review.id} review={review} />
      ))}

      {reviews.length === 0 && (
        <Text style={styles.noReviews}>No reviews yet</Text>
      )}

      {hasMore && (
        <Pressable onPress={handleLoadMore} style={styles.readMoreContainer}>
          <Text style={styles.readMoreText}>Read more</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  reviewCount: {
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  noReviews: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 16,
  },
  readMoreContainer: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  readMoreText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ReviewsSection;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatItem = ({ icon, value, label }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={20} color="#007AFF" style={styles.statIcon} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const QuickStats = ({ agent }) => {

    const calculateAverageRating = () => {
    if (!agent.reviews || agent.reviews.length === 0) return 0;
    const total = agent.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / agent.reviews.length).toFixed(1); // 1 decimal place
  };

  return (
    <View style={styles.statsContainer}>
      <StatItem 
        icon="people-outline" 
        value={agent.studentsHelped || "5"} 
        label="Students Helped" 
      />
      <StatItem 
        icon="star-outline" 
        value={calculateAverageRating() || 4} 
        label="Rating" 
      />
      <StatItem 
        icon="calendar-outline" 
        value={"Available"} 
        label="Availability" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default QuickStats;
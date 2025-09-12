import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';

const AgentCard = ({ agent, onPress }) => {
  console.log("AgentCard rendered:", agent);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const averageRating = calculateAverageRating(agent.reviews);

  // Truncate name if it's too long
  const truncatedName = agent.name?.length > 18 ? agent.name.slice(0, 18) + '...' : agent.name;

  // Default location
  const location = agent.location?.trim() ? agent.location : 'KNUST';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: agent.agentProfilePicture || agent.schoolIdURL }} style={styles.profileImage} />
      </View>
      <Text style={styles.name}>{truncatedName}</Text>
      <Text style={styles.location}>📍 {location}</Text>

      <Rating 
        imageSize={16} 
        readonly 
        startingValue={averageRating} 
        style={styles.rating} 
      />

      <Text style={styles.helpedText}>🎯 {agent.studentsHelped || "few"} students helped</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    margin: 8,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 150,
    maxWidth: '48%',
  },
  imageWrapper: {
    backgroundColor: '#F0F0F0',
    borderRadius: 40,
    padding: 8,
    marginBottom: 8,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  location: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  rating: {
    marginVertical: 6,
  },
  helpedText: {
    fontSize: 12,
    color: '#555',
  },
});

export default AgentCard;

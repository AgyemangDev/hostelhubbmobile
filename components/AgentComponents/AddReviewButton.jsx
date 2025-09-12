import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddReviewButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.addReviewButton} onPress={onPress}>
      <Ionicons name="star-outline" size={18} color="#fff" style={styles.buttonIcon} />
      <Text style={styles.addReviewButtonText}>Add Your Review</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addReviewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddReviewButton;
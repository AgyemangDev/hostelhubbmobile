import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BecomeAgentCTA = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Become an Agent</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1E40AF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%', // To take up the full width of the container
    maxWidth: 300, // Limits the button size for better readability
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BecomeAgentCTA;

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BecomeAgentCTA from '../../../components/AgentComponents/BecomeAgentCTA';

const BecomeAgentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Become an Agent</Text>
      <Text style={styles.description}>
        Want to become a part of our community? Here's how to get started!
      </Text>
      <BecomeAgentCTA onPress={() => {/* handle press */}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default BecomeAgentScreen;

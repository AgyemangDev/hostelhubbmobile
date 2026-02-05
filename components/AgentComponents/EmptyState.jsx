import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const EmptyState = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="account-tie" size={80} color="#610B0C" />
      <Text style={styles.title}>No Agents Available</Text>
      <Text style={styles.subtitle}>
        We’re getting more trusted agents on board just for you.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(tabs)/(index)')}
      >
        <Ionicons name="home" size={20} color="#fff" />
        <Text style={styles.buttonText}>Find Accommodation</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#555',
    width: '80%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#610B0C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
});

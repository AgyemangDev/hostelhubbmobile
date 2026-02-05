import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ContactInfo = ({ phone, email }) => {
  const handlePhonePress = () => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="call-outline" size={20} color="#007AFF" />
        <Text style={styles.sectionTitle}>Contact</Text>
      </View>
      
      <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
        <View style={styles.contactIconContainer}>
          <Ionicons name="call" size={18} color="#fff" />
        </View>
        <Text style={styles.contactText}>{phone}</Text>
        <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrowIcon} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
        <View style={[styles.contactIconContainer, styles.emailIconContainer]}>
          <Ionicons name="mail" size={18} color="#fff" />
        </View>
        <Text style={styles.contactText}>{email}</Text>
        <Ionicons name="chevron-forward" size={16} color="#999" style={styles.arrowIcon} />
      </TouchableOpacity>
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emailIconContainer: {
    backgroundColor: '#4CAF50',
  },
  contactText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  arrowIcon: {
    opacity: 0.5,
  },
});

export default ContactInfo;
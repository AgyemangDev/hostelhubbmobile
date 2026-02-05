import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileSection = ({ agent }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openImageModal = () => {
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.profileContainer}>
      <TouchableOpacity onPress={openImageModal} activeOpacity={0.9}>
        <Image
          source={{ uri: agent.agentProfilePicture || agent.schoolIdURL }}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.nameContainer}>
        <Text style={styles.name}>{agent.name}</Text>
        {agent.verified && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color="#4CAF50"
            style={styles.verifiedIcon}
          />
        )}
      </View>
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={16} color="#666" />
        <Text style={styles.location}>{agent.location}</Text>
      </View>

      {/* Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeImageModal}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={closeImageModal}
        >
          <View style={styles.modalContent}>
            <Image
              source={{ uri: agent.agentProfilePicture || agent.schoolIdURL }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginVertical: 16,
    paddingTop:30
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#f0f0f0',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 15,
    color: '#666',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '70%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  }
});

export default ProfileSection;
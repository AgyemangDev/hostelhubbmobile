import React from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

const RoomTypeSelectionModal = ({ visible, onClose, data, onSelect, selectedItem = null }) => (
  <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedItem === item.value && styles.selectedItem, // Highlight selected item
              ]}
              onPress={() => onSelect(item)} // Set selected item
            >
              <Text
                style={[
                  styles.itemText,
                  selectedItem === item.value && styles.selectedItemText, // Highlight selected text
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff', // White background for the modal container
    borderRadius: 10,
    padding: 18,
    height: '70%',
  },
  item: {
    padding: 14,
    borderWidth: 1, 
    borderColor: COLORS.background, // Light brown border color
    marginBottom: 10, // Space between items
    borderRadius: 8, // Rounded borders for items
  },
  selectedItem: {
    backgroundColor: COLORS.background,
    borderColor:"white"
  },
  itemText: {
    fontSize: 15,
    color: '#8b4513', 
  },
  selectedItemText: {
    fontWeight: 'bold', // Bold text for the selected item
    color: "white", // Change text color when selected
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  closeText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight:"bold"
  },
});

export default RoomTypeSelectionModal;

import React from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

const PriceRangeModal = ({ visible, onClose, data, onSelect, selectedItems = [] }) => (
  <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <FlatList
        showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedItems.includes(item.value) && styles.selectedItem,
              ]}
              onPress={() => onSelect(item)}
            >
              <Text
                style={[
                  styles.itemText,
                  selectedItems.includes(item.value) && styles.selectedItemText,
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background, // Light brown border color
    borderWidth: 1, // Added border to each item
    borderColor: COLORS.background, // Light brown border color for items
    marginBottom: 10, // Space between items
    borderRadius: 8, // Rounded borders for items
  },
  selectedItem: {
    backgroundColor: '#ffe4b5', // Light background for selected item
  },
  itemText: {
    fontSize: 15,
    color: '#8b4513', // Dark brown text color
  },
  selectedItemText: {
    fontWeight: 'bold', // Bold text for the selected item
    color: '#d2691e', // Change text color when selected
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: COLORS.background, // Light brown background for close button
    borderRadius: 8,
  },
  closeText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PriceRangeModal;

import React from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

const AmenitiesModal = ({ visible, onClose, data, onSelect, selectedItems = [] }) => (
  <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <FlatList
        showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item.value}
          numColumns={2} // Display two items per row
          key="2-columns" // Key to force re-render when column changes (fixed here as 2)
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
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    height: '70%',
  },
  item: {
    flex: 1,
    padding: 15,
    margin: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: COLORS.background, 
  },
  itemText: {
    fontSize: 12,
    color: '#8b0000', // Default text color
  },
  selectedItemText: {
    fontWeight: 'bold',
    color: '#fff', // Text turns white when selected
  },
  closeButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  closeText: {
    textAlign: 'center',
    color: '#fff',
  },
});

export default AmenitiesModal;

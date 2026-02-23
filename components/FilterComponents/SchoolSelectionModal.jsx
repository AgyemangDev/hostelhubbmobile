import React from 'react';
import { Modal, View, FlatList, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import COLORS from "../../constants/Colors"

const SchoolSelectionModal = ({ visible, onClose, data, onSelect, selectedItems = [] }) => (
  <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <FlatList
        showsVerticalScrollIndicator={false}
          data={data}
          numColumns={2} // Display two items per row
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedItems.includes(item.value) && styles.selectedItem,
              ]}
              onPress={() => onSelect(item)}
            >
              <View style={styles.itemContent}>
                <View style={styles.itemContainer}>
                  <Image source={item.logo} style={styles.itemImage} />
                  <Text
                    style={[
                      styles.itemText,
                      selectedItems.includes(item.value) && styles.selectedItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </View>
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
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    height: '70%',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
  },
  itemContent: {
    alignItems: 'center',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
    borderRadius: 12, // Rounded border for the entire item
    padding: 10,
    width: 120, // Fixed width for each item
    height: 120, // Fixed height for each item
    marginBottom: 8,
  },
  itemImage: {
    width:60,
    height:60,
    borderRadius: 20,
    resizeMode:"cover"
  },
  itemText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  selectedItem: {
    backgroundColor: '#ddd',
  },
  selectedItemText: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor:COLORS.background,
    borderRadius: 8,
  },
  closeText: {
    textAlign: 'center',
    color:"white",
    fontWeight:'bold'
  },
});

export default SchoolSelectionModal;

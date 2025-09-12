import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, FlatList } from 'react-native';
import COLORS from '../constants/Colors';

const CustomDropdown = ({ 
  data, 
  selectedValue, 
  onSelect, 
  placeholder, 
  visible, 
  onClose,
  onPress,
}) => {
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={onPress} style={styles.selectedItem}>
        <Text style={styles.selectedText}>{selectedValue || placeholder}</Text>
      </TouchableOpacity>

      {visible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={visible}
          onRequestClose={onClose}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            onPress={onClose}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={data}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.item}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    width: '100%',
    marginBottom: 15,
  },
  selectedItem: {
    backgroundColor: "white",
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderColor: COLORS.background,
    borderWidth: 1,
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.background,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  item: {
    padding: 15,
    borderBottomColor: COLORS.background,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.background,
  },
});

export default CustomDropdown;

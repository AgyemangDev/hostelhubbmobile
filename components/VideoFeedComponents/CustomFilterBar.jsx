import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

const CustomDropdown = ({ label, value, options, onSelect, style }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View style={[styles.dropdownContainer, style]}>
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.dropdownText} numberOfLines={1}>
          {selectedOption?.label || label}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdownModal}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[
                    styles.optionText,
                    item.value === value && styles.selectedOptionText
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const CustomFilterBar = ({ 
  priceFilter, 
  setPriceFilter, 
  roomFilter, 
  setRoomFilter, 
  typeFilter, 
  setTypeFilter 
}) => {
  const priceOptions = [
    { label: 'All Prices', value: 'All' },
    { label: 'Below 4000', value: 'below_4000' },
    { label: '4000-5000', value: '4000_5000' },
    { label: '5000-8000', value: '5000_8000' },
    { label: '8000-12000', value: '8000_12000' },
    { label: 'above 12000', value: 'above_12000' },
  ];

  const roomOptions = [
    { label: 'All Rooms', value: 'All' },
    { label: '1 in 1', value: 'One in One' },
    { label: '2 in 1', value: 'Two in One' },
    { label: '3 in 1', value: 'Three in One' },
    { label: '4 in 1', value: 'Four in One' },
  ];

  const typeOptions = [
    { label: 'All Types', value: 'All' },
    { label: 'Hostel', value: 'hostel' },
    { label: 'Homestel', value: 'homestel' },
    { label: 'Apartment', value: 'apartment' },
  ];

  return (
    <View style={styles.filterBar}>
      <CustomDropdown
        label="Price"
        value={priceFilter}
        options={priceOptions}
        onSelect={setPriceFilter}
        style={styles.filterItem}
      />
      
      <CustomDropdown
        label="Rooms"
        value={roomFilter}
        options={roomOptions}
        onSelect={setRoomFilter}
        style={styles.filterItem}
      />
      
      <CustomDropdown
        label="Type"
        value={typeFilter}
        options={typeOptions}
        onSelect={setTypeFilter}
        style={styles.filterItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterBar: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  filterItem: {
    flex: 1,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    backgroundColor: '#333',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#555',
  },
  dropdownText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  arrow: {
    color: '#888',
    fontSize: 10,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#333',
    borderRadius: 8,
    maxHeight: 250,
    minWidth: 150,
    borderWidth: 1,
    borderColor: '#555',
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  optionText: {
    color: 'white',
    fontSize: 14,
  },
  selectedOption: {
    backgroundColor: '#555',
  },
  selectedOptionText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default CustomFilterBar;
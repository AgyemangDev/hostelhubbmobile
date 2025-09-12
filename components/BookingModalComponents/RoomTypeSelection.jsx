import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const RoomTypeSection = ({ roomTypes, selectedRoomType, selectedPayment, onSelect }) => {
  console.log(roomTypes,selectedRoomType,selectedPayment)
  const getRoomTypeIcon = (roomType) => {
    switch (roomType) {
      case 'OneInARoom':
        return { iconComponent: MaterialCommunityIcons, name: 'bed-single', size: 24 };
      case 'TwoInARoom':
        return { iconComponent: MaterialCommunityIcons, name: 'bed-queen', size: 24 };
      case 'ThreeInARoom':
        return { iconComponent: FontAwesome5, name: 'bed', size: 20 };
      case 'FourInARoom':
        return { iconComponent: MaterialCommunityIcons, name: 'bunk-bed', size: 24 };
      case 'FiveInARoom':
        return { iconComponent: MaterialCommunityIcons, name: 'bunk-bed-outline', size: 24 };
      case 'Apartment':
        return { iconComponent: Ionicons, name: 'apartment', size: 24 };
      default:
        return { iconComponent: Ionicons, name: 'home-outline', size: 24 };
    }
  };

  const formatRoomTypeName = (roomType) =>
    roomType.replace(/([A-Z])/g, ' $1').trim();

  const isAvailable = (option) =>
    option?.price && Number(option?.roomsAvailable) > 0;

  const displayOrder = ['Apartment', 'OneInARoom', 'TwoInARoom', 'ThreeInARoom', 'FourInARoom', 'FiveInARoom'];

  const filteredRoomTypes = displayOrder
    .filter((type) => {
      const options = roomTypes[type];
      return options?.some((opt) => opt?.price); // skip if all prices are null/empty
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Room Type</Text>
      <Text style={styles.subtitle}>Choose your preferred accommodation option</Text>

      <View style={styles.roomTypesContainer}>
        {filteredRoomTypes.map((roomType) => {
          const options = roomTypes[roomType];
          const { iconComponent: IconComponent, name: iconName, size: iconSize } =
            getRoomTypeIcon(roomType);

          return (
            <View key={roomType} style={styles.roomTypeCard}>
              <View style={styles.roomTypeHeader}>
                <View style={styles.roomTypeIconContainer}>
                  <IconComponent name={iconName} size={iconSize} color="#610b0c" />
                </View>
                <Text style={styles.roomTypeName}>{formatRoomTypeName(roomType)}</Text>
              </View>

              {options
                .filter((option) => option?.price)
                .map((option, index) => {
                  const isSelected =
                    selectedRoomType === roomType && selectedPayment === option.price;
                  const available = isAvailable(option);

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionContainer,
                        isSelected && styles.selectedOption,
                        !available && styles.unavailableOption,
                      ]}
                      onPress={() => available && onSelect(roomType, option.price, available)}
                      disabled={!available}
                    >
                      <View style={styles.optionContent}>
                        <Text
                          style={[
                            styles.optionDescription,
                            isSelected && styles.selectedText,
                            !available && styles.unavailableText,
                          ]}
                        >
                          {option.description}
                        </Text>

                        <View style={styles.priceContainer}>
                          <Text
                            style={[
                              styles.currency,
                              isSelected && styles.selectedText,
                              !available && styles.unavailableText,
                            ]}
                          >
                            GHS
                          </Text>
                          <Text
                            style={[
                              styles.price,
                              isSelected && styles.selectedText,
                              !available && styles.unavailableText,
                            ]}
                          >
                            {(Number(option.price) * 1.05).toFixed(2)}
                          
                          </Text>
                        </View>
                      </View>

                      {isSelected && (
                        <View style={styles.checkmarkContainer}>
                          <Ionicons name="checkmark-circle" size={22} color="#fff" />
                        </View>
                      )}

                      {!available && (
                        <View style={styles.unavailableBadge}>
                          <Text style={styles.unavailableBadgeText}>Full</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  roomTypesContainer: { 
    gap: 16 
  },
  roomTypeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  roomTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  roomTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roomTypeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  selectedOption: {
    backgroundColor: '#610b0c',
    borderColor: '#610b0c',
  },
  unavailableOption: {
    opacity: 0.7,
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 12,
    color: '#666',
    marginRight: 2,
  },
  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedText: { 
    color: '#fff' 
  },
  unavailableText: { 
    color: '#999' 
  },
  checkmarkContainer: { 
    marginLeft: 8 
  },
  unavailableBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unavailableBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default RoomTypeSection;
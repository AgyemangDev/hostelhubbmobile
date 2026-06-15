import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const TEAL = "#0F6E56";
const TEAL_LIGHT = "#E1F5EE";
const TEAL_MID = "#1D9E75";

const ROOM_CONFIG = {
  Apartment:    { lib: Ionicons,                  name: "home-outline",         size: 20 },
  OneInARoom:   { lib: MaterialCommunityIcons,    name: "bed-single",           size: 22 },
  TwoInARoom:   { lib: MaterialCommunityIcons,    name: "bed-queen",            size: 22 },
  ThreeInARoom: { lib: FontAwesome5,              name: "bed",                  size: 18 },
  FourInARoom:  { lib: MaterialCommunityIcons,    name: "bunk-bed",             size: 22 },
  FiveInARoom:  { lib: MaterialCommunityIcons,    name: "bunk-bed-outline",     size: 22 },
};

const DISPLAY_ORDER = ['Apartment', 'OneInARoom', 'TwoInARoom', 'ThreeInARoom', 'FourInARoom', 'FiveInARoom'];

const formatRoomTypeName = (roomType) => roomType.replace(/([A-Z])/g, ' $1').trim();

const RoomTypeSection = ({ roomTypes, selectedRoomType, selectedPayment, onSelect }) => {
  const filteredRoomTypes = DISPLAY_ORDER.filter((type) =>
    roomTypes[type]?.some((opt) => opt?.price)
  );

  return (
    <View>
      <Text style={styles.sectionLabel}>Select room type</Text>
      <Text style={styles.subtitle}>Choose your preferred accommodation</Text>

      <View style={styles.list}>
        {filteredRoomTypes.map((roomType) => {
          const options = roomTypes[roomType];
          const config = ROOM_CONFIG[roomType];
          const IconComponent = config?.lib ?? Ionicons;

          return (
            <View key={roomType} style={styles.card}>
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={styles.iconWrap}>
                  <IconComponent name={config?.name ?? "home-outline"} size={config?.size ?? 20} color={TEAL} />
                </View>
                <Text style={styles.roomName}>{formatRoomTypeName(roomType)}</Text>
              </View>

              {/* Options */}
              <View style={styles.optionsWrap}>
                {options
                  .filter((opt) => opt?.price)
                  .map((option, index) => {
                    const isSelected = selectedRoomType === roomType && selectedPayment === option.price;
                    const available = option?.price && Number(option?.roomsAvailable) > 0;

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionRow,
                          isSelected && styles.optionRowSelected,
                          !available && styles.optionRowUnavailable,
                        ]}
                        onPress={() => available && onSelect(roomType, option.price, available)}
                        disabled={!available}
                        activeOpacity={0.75}
                      >
                        <Text
                          style={[
                            styles.optionDesc,
                            isSelected && styles.textSelected,
                            !available && styles.textUnavailable,
                          ]}
                          numberOfLines={1}
                        >
                          {option.description}
                        </Text>

                        <View style={styles.optionRight}>
                          <Text style={[styles.currency, isSelected && styles.textSelected, !available && styles.textUnavailable]}>
                            GHS
                          </Text>
                          <Text style={[styles.price, isSelected && styles.textSelected, !available && styles.textUnavailable]}>
                            {(Number(option.price) * 1.05).toFixed(2)}
                          </Text>
                        </View>

                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={18} color="#fff" style={styles.checkmark} />
                        )}

                        {!available && (
                          <View style={styles.fullBadge}>
                            <Text style={styles.fullBadgeText}>Full</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 11,
    color: "#888",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#999",
    marginBottom: 16,
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: TEAL_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  roomName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
    flex: 1,
  },
  optionsWrap: {
    padding: 10,
    gap: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#E8E8E8",
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
  },
  optionRowSelected: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  optionRowUnavailable: {
    opacity: 0.5,
  },
  optionDesc: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#222",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  currency: {
    fontSize: 11,
    color: "#888",
  },
  price: {
    fontSize: 15,
    fontWeight: "500",
    color: TEAL,
  },
  textSelected: {
    color: "#fff",
  },
  textUnavailable: {
    color: "#bbb",
  },
  checkmark: {
    marginLeft: 4,
  },
  fullBadge: {
    backgroundColor: "#FCEBEB",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fullBadgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#A32D2D",
  },
});

export default RoomTypeSection;
import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

const { width } = Dimensions.get("window");

const SearchInput = ({ value, onChangeText, placeholder }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useState(new Animated.Value(0))[0];

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const animatedBorderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.background + "20", COLORS.background],
  });

  const animatedShadow = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 8],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: animatedBorderColor,
            shadowRadius: animatedShadow,
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                }),
              },
            ],
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isFocused ? COLORS.background : "#666"}
          style={styles.icon}
        />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {value ? (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color="#888"
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.infoButton}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={isFocused ? COLORS.background : "#666"}
          />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Information</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            <Text style={styles.modalText}>
              You can search hostels by name, location and description
            </Text>

            <View style={styles.searchTipContainer}>
              <View style={styles.searchTipItem}>
                <Ionicons name="home" size={20} color={COLORS.background} />
                <Text style={styles.searchTipText}>Hostel names</Text>
              </View>
              <View style={styles.searchTipItem}>
                <Ionicons name="location" size={20} color={COLORS.background} />
                <Text style={styles.searchTipText}>Locations</Text>
              </View>
              <View style={styles.searchTipItem}>
                <Ionicons name="text" size={20} color={COLORS.background} />
                <Text style={styles.searchTipText}>Descriptions</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    shadowColor: COLORS.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 10,
    marginTop: 12,
    height: 56,
    borderWidth: 1,
    borderColor: "transparent",
  },
  icon: {
    marginRight: 12,
  },
  clearIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
    fontWeight: "500",
  },
  infoButton: {
    padding: 4,
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width - 64,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
    lineHeight: 22,
  },
  searchTipContainer: {
    marginBottom: 24,
  },
  searchTipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchTipText: {
    fontSize: 15,
    color: "#555",
    marginLeft: 12,
  },
  modalButton: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: COLORS.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default SearchInput;

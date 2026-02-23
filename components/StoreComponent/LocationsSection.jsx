import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from "../../app/firebase/FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

// Utility functions
const parseDate = (dateStr) => {
  if (!dateStr) return null;

  let day, month, year;
  if (dateStr.includes('/')) {
    [day, month, year] = dateStr.split('/');
  } else if (dateStr.includes('-')) {
    [year, month, day] = dateStr.split('-');
  } else {
    return null;
  }

  return new Date(year, month - 1, day);
};

const canEditDeliveryLocation = () => {
  const cutoffDate = new Date(2026, 0, 9, 23, 59, 59); // Jan is 0
  const now = new Date();

  return now <= cutoffDate;
};

const LocationsSection = ({ locations, deliveryDate, onUpdateLocation, bookingReference }) => {
  const { pickupLocation, deliveryLocation } = locations;
  const [isEditing, setIsEditing] = useState(false);
  const [newDeliveryLocation, setNewDeliveryLocation] = useState(deliveryLocation);

  const canEdit = canEditDeliveryLocation();

  const handleSave = async () => {
    if (newDeliveryLocation.trim() === '') {
      Alert.alert('Error', 'Delivery location cannot be empty');
      return;
    }

    try {
      const docRef = doc(db, "Storage", bookingReference);
      await updateDoc(docRef, {
        deliveryLocation: newDeliveryLocation
      });

      onUpdateLocation?.(newDeliveryLocation);
      setIsEditing(false);
      Alert.alert('Success', 'Delivery location updated successfully');
    } catch (error) {
      console.error("Error updating delivery location:", error);
      Alert.alert('Error', 'Failed to update delivery location');
    }
  };

  const handleCancel = () => {
    setNewDeliveryLocation(deliveryLocation);
    setIsEditing(false);
  };

  return (
    <View style={styles.section}>
      {/* Pickup Location */}
      <View style={styles.locationRow}>
        <View style={styles.labelContainer}>
          <Ionicons name="arrow-up-circle" size={16} color="#6B7280" />
          <Text style={styles.label}>Pickup</Text>
        </View>
        <Text style={styles.value}>{pickupLocation || "N/A"}</Text>
      </View>

      {/* Delivery Location */}
      <View style={[styles.locationRow, styles.deliveryRow]}>
        <View style={styles.labelContainer}>
          <Ionicons name="arrow-down-circle" size={16} color="#6B7280" />
          <Text style={styles.label}>Delivery</Text>
        </View>
        
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.textInput}
              value={newDeliveryLocation}
              onChangeText={setNewDeliveryLocation}
              placeholder="Enter delivery hostel"
              autoFocus
            />
            <View style={styles.buttonRow}>
              <Pressable style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.valueWithEdit}>
            <Text style={styles.value}>{deliveryLocation || "Not provided"}</Text>
            {canEdit && (
              <Pressable 
                style={styles.editIconButton}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="pencil" size={18} color="#007AFF" />
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Warning if editing not allowed */}
      {!canEdit && !isEditing && (
        <View style={styles.warningRow}>
          <Ionicons name="information-circle" size={16} color="#F59E0B" />
          <Text style={styles.warningText}>
            Cannot edit within 7 days of delivery
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  deliveryRow: {
    borderBottomWidth: 0,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  valueWithEdit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editIconButton: {
    backgroundColor: "#EFF6FF",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  editContainer: {
    flex: 1,
    marginLeft: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    minHeight: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  cancelButtonText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#047857",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  warningText: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "500",
    flex: 1,
  },
});

export default LocationsSection;
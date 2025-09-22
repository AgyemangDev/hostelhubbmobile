import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput, 
  Alert 
} from 'react-native';
import {db} from "../../app/firebase/FirebaseConfig"
import { doc, updateDoc } from "firebase/firestore";
// Utility functions
const parseDate = (dateStr) => {
  if (!dateStr) return null;

  // Handle DD/MM/YYYY or YYYY-MM-DD
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

const canEditDeliveryLocation = (deliveryDate, deliveryLocation) => {
  // Allow edit if location is empty
  if (!deliveryLocation || deliveryLocation.trim() === '') return true;

  const deliveryDateObj = parseDate(deliveryDate);
  if (!deliveryDateObj) return false;

  const currentDate = new Date();
  const weekBeforeDelivery = new Date(deliveryDateObj);
  weekBeforeDelivery.setDate(weekBeforeDelivery.getDate() - 7);

  return currentDate < weekBeforeDelivery;
};

const LocationsSection = ({ locations, deliveryDate, onUpdateLocation,bookingReference }) => {
  const { pickupLocation, deliveryLocation } = locations;
  console.log("Booking Ref in LocationsSection:", bookingReference); // Debug log
  const [isEditing, setIsEditing] = useState(false);
  const [newDeliveryLocation, setNewDeliveryLocation] = useState(deliveryLocation);

  const canEdit = canEditDeliveryLocation(deliveryDate, deliveryLocation);

const handleSave = async () => {
  if (newDeliveryLocation.trim() === '') {
    Alert.alert('Error', 'Delivery location cannot be empty');
    return;
  }

  try {
    // Reference to the document with ID = bookingReference
    const docRef = doc(db, "Storage", bookingReference);

    // Update the deliveryLocation field
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
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Locations</Text>
        {canEdit && !isEditing && (
          <Pressable 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
            android_ripple={{ color: '#e3f2fd' }}
          >
            <Text style={styles.editButtonText}>Edit Delivery</Text>
          </Pressable>
        )}
      </View>

      {/* Pickup Location */}
      <View style={styles.locationCard}>
        <Text style={styles.label}>Pickup Location</Text>
        <Text style={styles.value}>{pickupLocation || "N/A"}</Text>
      </View>

      {/* Delivery Location */}
      <View style={styles.locationCard}>
        <Text style={styles.label}>Delivery Location</Text>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.textInput}
              value={newDeliveryLocation}
              onChangeText={setNewDeliveryLocation}
              placeholder="Enter delivery Hostel"
              
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
          <Text style={styles.value}>{deliveryLocation || "N/A"}</Text>
        )}
      </View>

      {/* Warning if editing not allowed */}
      {!canEdit && !isEditing && (
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            Delivery location cannot be changed within 7 days of delivery date.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  locationCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#28a745",
  },
  label: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  editContainer: {
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#dc3545",
  },
  cancelButtonText: {
    color: "#dc3545",
    fontWeight: "600",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#28a745",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  warningCard: {
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#ffc107",
  },
  warningText: {
    fontSize: 14,
    color: "#856404",
    fontWeight: "500",
  },
});

export default LocationsSection;

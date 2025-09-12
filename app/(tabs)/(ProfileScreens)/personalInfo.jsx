import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from "../../../context/UserContext";
import COLORS from "../../../constants/Colors";
import { auth, db } from "../../firebase/FirebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";

const PersonalInfo = () => {
  const { userInfo } = useContext(UserContext);
  const [editable, setEditable] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  // Function to handle image selection from gallery
  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted) {
      let imageResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!imageResult.cancelled) {
        // Handle image update logic here
      }
    }
  };

  // Function to enable/disable edit mode
  const toggleEdit = () => setEditable(!editable);

  // Function to handle input changes
  const handleChange = (key, value) => setEditedInfo({ ...editedInfo, [key]: value });

  // Function to handle saving changes
  const saveChanges = async () => {
    if (userId) {
      setLoading(true); // Start loading
      try {
        const userDocRef = doc(db, 'Student_Users', userId);
        await setDoc(userDocRef, {
          firstName: editedInfo.firstName,
          surname: editedInfo.surname,
          email: editedInfo.email,
          gender: editedInfo.gender,
          phoneNumber: editedInfo.phoneNumber,
        }, { merge: true });
        setEditable(false); // Disable edit mode after saving
      } catch (error) {
        console.error("Error updating document: ", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <TouchableOpacity onPress={toggleEdit}>
            <Ionicons name="pencil" size={24} color="#9a0b0d" />
          </TouchableOpacity>
        </View>

        <View style={styles.textContainer}>
          {/* Input Fields */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: editable ? "#f9f9f9" : "#e0e0e0" }]}
              value={editedInfo.firstName}
              editable={editable}
              onChangeText={(value) => handleChange("firstName", value)}
            />
          </View>

          {/* Surname */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Surname</Text>
            <TextInput
              style={[styles.input, { backgroundColor: editable ? "#f9f9f9" : "#e0e0e0" }]}
              value={editedInfo.surname}
              editable={editable}
              onChangeText={(value) => handleChange("surname", value)}
            />
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: "#e0e0e0" }]}
              value={editedInfo.email}
              editable={false}
            />
          </View>

          {/* Gender Dropdown */}

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Gender</Text>
            <TextInput
            style={[styles.input, { backgroundColor: "#e0e0e0" }]}
              value={editedInfo.gender}
              editable={false}
            />
          </View>
          
          {/* Phone Number */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: editable ? "#f9f9f9" : "#e0e0e0" }]}
              value={editedInfo.phoneNumber}
              editable={editable}
              onChangeText={(value) => handleChange("phoneNumber", value)}
            />
          </View>

          {/* Save Changes Button */}
          {editable && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveChanges}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" /> // Show loader
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PersonalInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.background,
  },
  textContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: COLORS.background,
    marginBottom: 5,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#9a0b0d",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

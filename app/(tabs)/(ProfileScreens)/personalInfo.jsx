import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../../context/UserContext";
import FloatingLabelInput from "../../../components/InputFields/FormInput";
import COLORS from "../../../constants/Colors";

const PersonalInfo = () => {
  const { userInfo } = useContext(UserContext);
  const [editable, setEditable] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync editedInfo when userInfo changes
    setEditedInfo({ ...userInfo });
  }, [userInfo]);

  const toggleEdit = () => setEditable(!editable);

  const handleChange = (key, value) => setEditedInfo({ ...editedInfo, [key]: value });

  const saveChanges = async () => {
    setLoading(true);
    try {
      console.log("Saving changes:", editedInfo);
      setEditable(false);
    } catch (err) {
      console.error("Error saving changes:", err);
    } finally {
      setLoading(false);
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
          <FloatingLabelInput
            placeholder="First Name"
            value={editedInfo.first_name}
            onChangeText={(value) => handleChange("first_name", value)}
            disabled={!editable}
          />

          <FloatingLabelInput
            placeholder="Surname"
            value={editedInfo.surname}
            onChangeText={(value) => handleChange("surname", value)}
            disabled={!editable}
          />

          <FloatingLabelInput
            placeholder="Email"
            value={editedInfo.email}
            disabled={true}
          />

          <FloatingLabelInput
            placeholder="Gender"
            value={editedInfo.gender}
            disabled={true}
          />

          <FloatingLabelInput
            placeholder="Phone Number"
            value={editedInfo.phone_number}
            onChangeText={(value) => handleChange("phone_number", value)}
            disabled={!editable}
          />

          {editable && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveChanges}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
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
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingHorizontal: 20, paddingTop: 30 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.background },
  textContainer: { marginBottom: 30 },
  saveButton: { backgroundColor: "#9a0b0d", paddingVertical: 15, borderRadius: 10, marginTop: 20, alignItems: "center" },
  saveButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

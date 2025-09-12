import React, { useState,useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import COLORS from '../../constants/Colors';
import { db } from '../../app/firebase/FirebaseConfig';
import { UserContext } from '../../context/UserContext';

const ComplaintSection = ({ bookingId, userId, hostelId, adminId }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const {userInfo} = useContext(UserContext)

  const userEmail = userInfo.email
  const userName = userInfo.firstName

  const handleComplaintSubmit = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'Complaints'), {
        userId,
        hostelId,
        bookingId,
        adminId,
        roomNumber,
        complaint,
        userEmail,
        userName,
        timestamp: serverTimestamp(),
      });
      
      Alert.alert(
        "Complaint Successful",
        "If you don't receive a response in the next 48hrs from your hostel manager, kindly report to Hostelhubb Customer Care. Thank you"
      );
      
      // Clear the form
      setRoomNumber('');
      setComplaint('');
    } catch (error) {
      Alert.alert("Submission Failed", "There was an error submitting your complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitEnabled = roomNumber.length > 0 && complaint.length >= 10;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaint Section</Text>
      <Text style={styles.introText}>
        Please provide your room number and describe your complaint in detail. We value your feedback and are here to help resolve any issues.
      </Text>
      <TextInput
        placeholder="Room Number or Address"
        value={roomNumber}
        onChangeText={setRoomNumber}
        style={styles.input}
        placeholderTextColor={COLORS.placeholder}
      />
      <TextInput
        placeholder="Describe your complaint"
        value={complaint}
        onChangeText={setComplaint}
        style={[styles.input, styles.textArea]}
        multiline
        placeholderTextColor={COLORS.placeholder}
      />
      
      <TouchableOpacity
        style={[styles.submitButton, isSubmitEnabled ? styles.enabledButton : styles.disabledButton]}
        onPress={handleComplaintSubmit}
        disabled={!isSubmitEnabled || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Complaint</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  introText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  enabledButton: {
    backgroundColor: COLORS.background,
  },
  disabledButton: {
    backgroundColor: '#A5A5A5',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ComplaintSection;

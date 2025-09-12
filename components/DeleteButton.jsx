import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from '../context/UserContext';
import { auth } from '../app/firebase/FirebaseConfig';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeleteAccountButton = () => {
  const { clearUserSession } = useContext(UserContext);
  const [loading, setLoading] = React.useState(false);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Are you sure?",
      "Deleting your account is permanent and cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setLoading(true); // Start loading indicator
              console.log("Deleting account...");
              const user = auth.currentUser;

              if (user) {
                console.log("Clearing AsyncStorage...");
                await AsyncStorage.clear(); // Clear all local storage
                console.log("AsyncStorage cleared.");

                await user.delete(); // Delete Firebase user account
                console.log("Account deletion successful.");

                clearUserSession(); // Clear context state
                console.log("User session cleared.");
                router.replace('(Client)'); // Navigate back to login
              } else {
                Alert.alert("Error", "No user is logged in.");
              }
            } catch (error) {
              console.error("Account Deletion Error:", error);

              // Handle specific errors like re-authentication
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  "Session Expired",
                  "Please log in again to delete your account."
                );
              } else {
                Alert.alert(
                  "Error",
                  "There was an issue deleting your account. Please try again."
                );
              }
            } finally {
              setLoading(false); // Stop loading indicator
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={handleDeleteAccount}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          <MaterialIcons name="delete" size={30} color="red" />
          <Text style={styles.deleteText}>Delete Account</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // Use red to indicate danger
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: 'center',
  },
  deleteText: {
    color: 'red',
    marginLeft: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DeleteAccountButton;




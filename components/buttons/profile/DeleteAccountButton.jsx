import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { Button } from '../../ui';
import { UserContext } from '../../../context/UserContext';
import { auth } from '../../../lib/firebase/FirebaseConfig';
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
    <Button
      title="Delete account"
      icon="trash-outline"
      variant="dangerOutline"
      size="sm"
      compact
      loading={loading}
      onPress={handleDeleteAccount}
      style={{ alignSelf: 'flex-start' }}
    />
  );
};

export default DeleteAccountButton;




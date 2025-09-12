import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from '../context/UserContext';
import { auth } from '../app/firebase/FirebaseConfig';
import COLORS from '../constants/Colors';
import { router } from 'expo-router';

const LogoutButton = () => {
  const { clearUserSession } = useContext(UserContext);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Have you finished booking your hostel?",
      "",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setLoading(true); // Start loading indicator
              console.log("Clearing AsyncStorage...");
              console.log("Signing out from Firebase...");
              await auth.signOut(); // Firebase sign out
              console.log("Firebase sign-out successful.");
              clearUserSession(); // Clear context state
              console.log("User session cleared.");
              router.replace('(Client)'); // Navigate back to login
            } catch (error) {
              console.error("Logout Error:", error);
              Alert.alert("Error", "There was an issue logging out. Please try again.");
            } finally {
              setLoading(false); // Stop loading indicator
            }
          },
          style: "default",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          <MaterialIcons name="swap-horiz" size={30} color="white" />
          <Text style={styles.LogText}>Logout</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: 'center',
  },
  LogText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LogoutButton;

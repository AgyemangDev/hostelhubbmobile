import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { UserContext } from '../../../context/UserContext';
import { auth } from '../../../lib/firebase/FirebaseConfig';
import { Button } from '../../ui';
import { router } from 'expo-router';

const LogoutButton = () => {
  const { logoutCleanup } = useContext(UserContext);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Have you finished making your student life comfortable with our services?",
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
  setLoading(true);

  await auth.signOut();

  await logoutCleanup();

} catch (error) {
  console.error("Logout Error:", error);
}
finally {
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
    <Button
      title="Logout"
      icon="log-out-outline"
      variant="secondary"
      size="sm"
      compact
      loading={loading}
      onPress={handleLogout}
      style={{ alignSelf: 'flex-start' }}
    />
  );
};

export default LogoutButton;

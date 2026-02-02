import React, { useState, useContext } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { validatePersonalInfoForm } from "../../utils/ValidationUtils/personalInfoValidation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from "../../utils/api/api";

import COLORS from "../../constants/Colors";
import PersonalInfoForm from "../../components/Forms/PersonalInfoForm";
import { UserContext } from "../../context/UserContext";

const ClientSignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, password, selectedUniversity } = route.params;
  const { setUserSession } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isGenderVisible, setIsGenderVisible] = useState(false);

  const handleSignUp = async () => {
    const error = validatePersonalInfoForm({
      firstName,
      surname,
      phoneNumber,
      gender: selectedGender,
    });

    if (error) {
      Alert.alert("Error", error);
      return;
    }

    setLoading(true);

    try {
      // Hit the backend API endpoint
      const response = await fetch(`${API_BASE_URL}/api/students/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          surname: surname,
          phone_number: phoneNumber,
          gender: selectedGender,
          institution: selectedUniversity,
          email: email,
          password: password,
          referred_by: referredBy?.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Store the user session data in AsyncStorage
      const sessionData = {
        firebaseUid: data.firebaseUid,
        firebaseToken: data.firebaseToken,
        student: data.student,
        tokenExpiry: Date.now() + (3600 * 1000), // Token expires in 1 hour
      };

      await AsyncStorage.setItem('userSession', JSON.stringify(sessionData));

      // Update the user context
      if (setUserSession) {
        setUserSession(sessionData);
      }

      // Success - Navigate to login or email verification
      Alert.alert(
        "Verify Your Email",
        "Account created successfully. Please verify your email before logging in.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: "ClientLogIn" }],
              }),
          },
        ]
      );
    } catch (err) {
      console.error('Signup error:', err);
      Alert.alert("Signup Failed", err.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Image
            source={require("../../assets/images/personal_data.gif")}
            style={styles.image}
          />

          <PersonalInfoForm
            firstName={firstName}
            setFirstName={setFirstName}
            surname={surname}
            setSurname={setSurname}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            referredBy={referredBy}
            setReferredBy={setReferredBy}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            isGenderVisible={isGenderVisible}
            toggleGenderVisibility={() =>
              setIsGenderVisible((prev) => !prev)
            }
            loading={loading}
            onSubmit={handleSignUp}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
});

export default ClientSignUp;
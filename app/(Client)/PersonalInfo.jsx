import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../constants/Colors";
import CustomDropdown from "../../components/CustomDropdown";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/FirebaseConfig";
import Button from "../../components/ButtonComponents/ButtonComponent"
import CustomInput from "../../components/CustomInput";
import { useRoute } from "@react-navigation/native";
import { findReferredUser } from "../../utils/referralFetcherUtils";

const ClientSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isGenderVisible, setIsGenderVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedUniversities } = route.params;

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleGenderVisibility = () => {
    setIsGenderVisible((prev) => !prev); // Toggle visibility
  };

  const generateReferralCode = () => {
    const firstLetter = firstName.charAt(0).toUpperCase(); // First letter of firstName (Uppercase)
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Random lowercase letter
    const randomNumber = Math.floor(10 + Math.random() * 90); // Random 2-digit number
    const secondLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random uppercase letter
    
    return `${firstLetter}${randomLetter}${randomNumber}${secondLetter}`;
  };
  

  const handleSignUp = async () => {
    if (!firstName || !surname || !phoneNumber || !selectedGender) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (!user) {
      Alert.alert("Error", "No user is currently logged in");
      return;
    }

    setLoading(true);
    try {
      const defaultReferredById = "9NDBkpDcM3ThpPXCaL5MvLg0Dtt2"; // Default referral ID
      let referredById = defaultReferredById;

      if (referredBy) {
        // Call the optimized Firestore query
        const referredUser = await findReferredUser(referredBy);

        if (referredUser) {
          referredById = referredUser.id;
          console.log(referredById);

          const referredDocRef = doc(db, "Student_Users", referredUser.id);
          await setDoc(
            referredDocRef,
            { totalReferal: (referredUser.totalReferal || 0) + 1 },
            { merge: true }
          );
        } else {
          Alert.alert("Error", "Invalid agent or referral code");
          setLoading(false);
          return;
        }
      } else {
        // Handle default referral user logic
        const defaultDocRef = doc(db, "Student_Users", defaultReferredById);
        const defaultUser = await getDoc(defaultDocRef);
        if (defaultUser.exists()) {
          await setDoc(
            defaultDocRef,
            { totalReferal: (defaultUser.data().totalReferal || 0) + 1 },
            { merge: true }
          );
        }
      }

      const referralCode = generateReferralCode();

      const personalInfoDocRef = doc(db, "Student_Users", user.uid);
      const userData = {
        firstName,
        surname,
        phoneNumber,
        gender: selectedGender,
        referralCode,
        referredBy: referredById,
        institution: selectedUniversities,
      };

      await setDoc(personalInfoDocRef, userData, { merge: true });

      navigation.reset({
        index: 0,
        routes: [{ name: "(tabs)" }],
      });

      Alert.alert("Success", "Account created successfully");
    } catch (error) {
      console.error("Sign-up error:", error);
      Alert.alert("Error", "Failed to complete sign-up");
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
          <View style={styles.containerInput}>
            <Text style={styles.title}>Personal Information</Text>
            <CustomInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />
            <CustomInput
              placeholder="Surname"
              value={surname}
              onChangeText={setSurname}
              editable={!loading}
            />
            <CustomInput
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              editable={!loading}
            />
            <CustomInput
              placeholder="Agent or Referral Code (Optional)"
              value={referredBy}
              onChangeText={setReferredBy}
              editable={!loading}
            />

            <CustomDropdown
              data={["Male", "Female"]}
              selectedValue={selectedGender}
              onSelect={setSelectedGender}
              placeholder="Select Gender"
              visible={isGenderVisible}
              onClose={() => setIsGenderVisible(false)}
              disabled={loading}
              onPress={toggleGenderVisibility}
            />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <Button
              buttonText="Complete Sign Up"
              onPressFunction={handleSignUp}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  containerInput: { width: "80%", alignItems: "center" },
  title: {
    color: COLORS.titleColor,
    fontSize: 30,
    fontWeight: "bold",
    paddingVertical: 15,
    textAlign: "center",
  },
  image: {
    height: 300,
    width: 300,
    resizeMode: "contain",
    justifyContent: "center",
    alignContent: "center",
  },
});

export default ClientSignUp;

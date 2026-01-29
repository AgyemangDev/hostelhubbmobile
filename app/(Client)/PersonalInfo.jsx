import React, { useState, useEffect } from "react";
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
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { validatePersonalInfoForm } from "../../utils/ValidationUtils/personalInfoValidation";
import { supabase } from "../firebase/supabaseCofig";

import COLORS from "../../constants/Colors";
import { auth, db } from "../firebase/FirebaseConfig";
import PersonalInfoForm from "../../components/Forms/PersonalInfoForm";
import { findReferredUser } from "../../utils/referralFetcherUtils";

const ClientSignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, password, selectedUniversity } = route.params;
  console.log( selectedUniversity,email,password);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isGenderVisible, setIsGenderVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const generateReferralCode = () => {
    return `${firstName[0]?.toUpperCase()}${String.fromCharCode(
      97 + Math.random() * 26
    )}${Math.floor(10 + Math.random() * 90)}${String.fromCharCode(
      65 + Math.random() * 26
    )}`;
  };

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
      const defaultReferrerId = "9NDBkpDcM3ThpPXCaL5MvLg0Dtt2";
      let referredById = defaultReferrerId;

      if (referredBy) {
        const referredUser = await findReferredUser(referredBy);
        if (!referredUser) {
          Alert.alert("Error", "Invalid referral code");
          setLoading(false);
          return;
        }

        referredById = referredUser.id;
        await setDoc(
          doc(db, "Student_Users", referredUser.id),
          { totalReferal: (referredUser.totalReferal || 0) + 1 },
          { merge: true }
        );
      }

      const userData = {
        firstName,
        surname,
        phoneNumber,
        gender: selectedGender,
        referralCode: generateReferralCode(),
        referredBy: referredById,
        institution: selectedUniversities,
      };

      await setDoc(doc(db, "Student_Users", user.uid), userData, { merge: true });
      await sendEmailVerification(auth.currentUser);

      Alert.alert(
        "Verify Your Email",
        "A verification email has been sent.",
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

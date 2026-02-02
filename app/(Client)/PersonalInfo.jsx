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
import { sendEmailVerification } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { validatePersonalInfoForm } from "../../utils/ValidationUtils/personalInfoValidation";
import { supabase } from "../firebase/supabaseConfig";

import COLORS from "../../constants/Colors";
import { auth } from "../firebase/FirebaseConfig";
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
    // -----------------------------
    // STEP 1 — Validate referral code
    // -----------------------------
    const defaultReferrerId = null;
    let referredById = defaultReferrerId;

    if (referredBy?.trim()) {
      const referredUser = await findReferredUser(referredBy.trim());

      if (!referredUser) {
        Alert.alert("Error", "Incorrect referral code");
        setLoading(false);
        return;
      }

      referredById = referredUser.id;
    }

    // -----------------------------
    // STEP 2 — Create Firebase user
    // -----------------------------
    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const firebaseUid = cred.user.uid;

    // -----------------------------
    // STEP 3 — Send verification email
    // -----------------------------
    await sendEmailVerification(cred.user);

    // -----------------------------
    // STEP 4 — Insert into Supabase
    // -----------------------------
    const { error: supabaseError } = await supabase
      .from("Student_Users")
      .insert({
        id: firebaseUid,
        first_name: firstName,
        surname: surname,
        email: email, 
        phone_number: phoneNumber,
        gender: selectedGender,
        institution: selectedUniversity,
        referral_code: generateReferralCode(),
        referred_by: referredById,
        balance: 0,
        expo_token: null,
        created_at: new Date().toISOString(),
        last_interacted: new Date().toISOString(),
        paymentStatus:false,
        paymentDate:null
      });

    if (supabaseError) {
      throw supabaseError;
    }

    // -----------------------------
    // STEP 5 — Success → go to login
    // -----------------------------
    Alert.alert(
      "Verify Your Email",
      "Account created. Please verify your email before logging in.",
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
    console.log(err);
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

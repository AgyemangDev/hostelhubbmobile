import React, { useState, useEffect,useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/Colors";
import FormInput from "../../components/InputFields/FormInput";
import Button from "../../components/ButtonComponents/ButtonComponent";
import SocialAuthButtons from "../../components/ButtonComponents/SocialAuthButtons";
import { UserContext } from "../../context/UserContext";

import { signInWithEmail, loadSavedCredentials } from "../../utils/auth/signInwithEmail";
import { useGoogleAuth } from "../../utils/auth/signInWithGoogle";
import { signInWithApple } from "../../utils/auth/signInWithApple";
import TermsLink from "../../components/Links/TermsLink";

const ClientLogIn = () => {
  const navigation = useNavigation();
  const { setUserFromAuthResponse } = useContext(UserContext);

  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe]           = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [appleLoading, setAppleLoading]       = useState(false);

  const { signIn: googleSignIn, loading: googleLoading } = useGoogleAuth();

  useEffect(() => {
    loadSavedCredentials().then((saved) => {
      if (saved) {
        setEmail(saved.email);
        setPassword(saved.password);
        setRememberMe(true);
      }
    });
  }, []);


const handleContinue = async () => {
  setLoading(true);
  await signInWithEmail(email, password, rememberMe, (student) => {
    console.log("[LOGIN] Email auth student:", JSON.stringify(student, null, 2));
    setUserFromAuthResponse(student);
  });
  setLoading(false);
};

const handleGoogleSignIn = () =>
  googleSignIn((student) => {
    console.log("[LOGIN] Google auth student:", JSON.stringify(student, null, 2));
    setUserFromAuthResponse(student);
  });

const handleAppleSignIn = async () => {
  setAppleLoading(true);
  await signInWithApple((student) => {
    console.log("[LOGIN] Apple auth student:", JSON.stringify(student, null, 2));
    setUserFromAuthResponse(student);
  });
  setAppleLoading(false);
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Drag handle */}
      <View style={styles.handle} />

      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Welcome to Hostelhubb</Text>
        <Text style={styles.subheading}>Sign in or create an account</Text>

        <View style={styles.formArea}>
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <FormInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPasswordInput
            isPasswordVisible={passwordVisible}
            togglePasswordVisibility={() => setPasswordVisible(!passwordVisible)}
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => navigation.replace("(Client)/ForgotPassword")} activeOpacity={0.7}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity> */}
          </View>

          <Button
            buttonText={loading ? "Please wait…" : "Continue"}
            onPressFunction={handleContinue}
            disabled={loading}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <SocialAuthButtons
            onGooglePress={handleGoogleSignIn}
            onApplePress={handleAppleSignIn}
            googleLoading={googleLoading}
            appleLoading={appleLoading}
          />

<View style={styles.termsContainer}>
  <Text style={styles.terms}>
    By continuing, you agree to our
  </Text>

  <View style={styles.linksRow}>
    <TermsLink
      text="Terms of Service"
      link="https://hostelhubb.com/terms"
      color="#1a1a1a"
    />

    <Text style={styles.andText}>and</Text>

    <TermsLink
      text="Privacy Policy"
      link="https://hostelhubb.com/privacy-policy"
      color="#1a1a1a"
    />
  </View>
</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e0e0e0",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  inner: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 27,
    paddingTop:100,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    color: "#888",
    marginBottom: 24,
  },
  formArea: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#1a1a1a",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1a1a1a",
  },
  rememberText: {
    fontSize: 13,
    color: "#1a1a1a",
  },
  forgotPassword: {
    fontSize: 13,
    color: COLORS.link,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e2e2e2",
  },
  dividerText: {
    fontSize: 12,
    color: "#888",
  },
  termsContainer: {
  alignItems: "center",
  marginTop: 20,
},

linksRow: {
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  justifyContent: "center",
},

andText: {
  fontSize: 12,
  color: "#aaa",
},

terms: {
  fontSize: 12,
  color: "#aaa",
  textAlign: "center",
},
});

export default ClientLogIn;
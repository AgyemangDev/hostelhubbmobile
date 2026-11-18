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

import SocialAuthButtons from "../../components/buttons/auth/SocialAuthButtons";
import { UserContext } from "../../context/UserContext";

import { signInWithEmail, loadSavedCredentials } from "../../utils/auth/signInwithEmail";
import { useGoogleAuth } from "../../utils/auth/signInWithGoogle";
import { signInWithApple } from "../../utils/auth/signInWithApple";
import TermsLink from "../../components/ui/links/TermsLink";
import { Button, CheckboxRow, TextField } from "../../components/ui";
import { colors } from "../../constants/theme";

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
          <TextField
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
            right={<TextField.Icon icon={passwordVisible ? "eye-outline" : "eye-off-outline"} onPress={() => setPasswordVisible(!passwordVisible)} />}
          />

          <View style={styles.row}>
            <CheckboxRow checked={rememberMe} onChange={setRememberMe} label="Remember me" variant="compact" />

            {/* <TouchableOpacity onPress={() => navigation.replace("(Client)/ForgotPassword")} activeOpacity={0.7}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity> */}
          </View>

          <Button
            title={loading ? "Please wait…" : "Continue"}
            onPress={handleContinue}
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
      color={colors.text}
    />

    <Text style={styles.andText}>and</Text>

    <TermsLink
      text="Privacy Policy"
      link="https://hostelhubb.com/privacy-policy"
      color={colors.text}
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
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.fill,
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
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    color: colors.textMuted,
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
    backgroundColor: colors.text,
  },
  rememberText: {
    fontSize: 13,
    color: colors.text,
  },
  forgotPassword: {
    fontSize: 13,
    color: colors.brand,
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
    color: colors.textMuted,
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
  color: colors.textMuted,
},

terms: {
  fontSize: 12,
  color: colors.textMuted,
  textAlign: "center",
},
});

export default ClientLogIn;
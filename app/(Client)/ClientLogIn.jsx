import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

import COLORS from "../../constants/Colors";
import { auth } from "../firebase/FirebaseConfig";
import FormInput from "../../components/InputFields/FormInput";
import Button from "../../components/ButtonComponents/ButtonComponent";

const ClientLogIn = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    const saved = await AsyncStorage.getItem("rememberMeCredentials");
    if (saved) {
      const { email, password } = JSON.parse(saved);
      setEmail(email);
      setPassword(password);
      setRememberMe(true);
    }
  };

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogIn = async () => {
    if (!email || !password) {
      Alert.alert("Credentials Needed", "Please fill all fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user.emailVerified) {
        Alert.alert(
          "Email Verification Required",
          "Please verify your email before logging in.",
          [
            {
              text: "Resend Email",
              onPress: () => sendEmailVerification(user),
            },
            { text: "OK" },
          ]
        );
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "(tabs)" }],
      });
    } catch {
      Alert.alert("Error", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/login.gif")}
        style={styles.image}
      />

      {/* Shared width wrapper */}
      <View style={styles.formArea}>
        <FormInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <FormInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          isPasswordInput
          isPasswordVisible={passwordVisible}
          togglePasswordVisibility={() =>
            setPasswordVisible(!passwordVisible)
          }
        />

        {/* Remember me */}
        <TouchableOpacity
          style={styles.rememberRow}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View
            style={[
              styles.checkbox,
              rememberMe && styles.checkboxChecked,
            ]}
          >
            {rememberMe && (
              <Ionicons name="checkmark" size={14} color={COLORS.white} />
            )}
          </View>
          <Text style={styles.rememberText}>
            Remember me for next login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Full-width button */}
        <Button
          buttonText={loading ? "Signing In..." : "Sign In"}
          onPressFunction={handleLogIn}
        />
      </View>

      <TouchableOpacity
        style={styles.signUpLink}
        onPress={() => navigation.navigate("ClientSignUp")}
      >
        <Text style={styles.signUpText}>
          Don’t have an account?{" "}
          <Text style={styles.signUpAction}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ClientLogIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 260,
    height: 260,
    resizeMode: "contain",
    marginBottom: 24,
  },
  formArea: {
    width: "100%",
    paddingHorizontal: 24, // 👈 controls BOTH input & button width
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.background,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.background,
  },
  rememberText: {
    fontSize: 14,
    color: COLORS.background,
  },
  forgotPassword: {
    color: COLORS.link,
    fontSize: 15,
    marginBottom: 24,
  },
  signUpLink: {
    marginTop: 32,
  },
  signUpText: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  signUpAction: {
    color: COLORS.background,
    fontWeight: "600",
  },
});

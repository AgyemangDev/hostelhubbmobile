import { signInWithCustomToken, sendEmailVerification } from "firebase/auth";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../app/firebase/FirebaseConfig";
import API_BASE_URL from "../api/api";

/**
 * Airbnb-style email auth — fully backend-driven.
 * Backend decides sign-in vs create, returns a custom token.
 */
export const signInWithEmail = async (email, password, rememberMe, onSuccess) => {
  if (!email || !password) {
    Alert.alert("Required", "Please enter your email and password.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    Alert.alert("Invalid Email", "Please enter a valid email address.");
    return;
  }
  if (password.length < 6) {
    Alert.alert("Weak Password", "Password must be at least 6 characters.");
    return;
  }

  try {
    const res  = await fetch(`${API_BASE_URL}/api/students/auth/email`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // ── New user — needs email verification ──────────────────────────────────
    if (res.status === 201 && data.requiresVerification) {
      Alert.alert(
        "Check Your Email",
        "We've sent a verification link. Please verify your email then sign in.",
        [{ text: "OK" }]
      );
      return;
    }

    // ── Unverified existing user ─────────────────────────────────────────────
    if (res.status === 403 && data.error === "email_not_verified") {
      Alert.alert(
        "Email Not Verified",
        "Please verify your email before continuing.",
        [
          {
            text: "Resend Email",
            onPress: () => resendVerificationEmail(email),
          },
          { text: "OK" },
        ]
      );
      return;
    }

    // ── Other errors ─────────────────────────────────────────────────────────
    if (!res.ok) {
      Alert.alert("Sign In Failed", data.error || "Please try again.");
      return;
    }

    // ── Success — sign in with custom token ──────────────────────────────────
    await signInWithCustomToken(auth, data.firebaseToken);
onSuccess?.(data.student);


    if (rememberMe) {
      await AsyncStorage.setItem(
        "rememberMeCredentials",
        JSON.stringify({ email, password })
      );
    } else {
      await AsyncStorage.removeItem("rememberMeCredentials");
    }

    onSuccess?.(data.student);

  } catch (err) {
    Alert.alert("Error", err.message || "Something went wrong.");
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/students/auth/resend-verification`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email }),
    });
    const data = await res.json();
    Alert.alert(
      res.ok ? "Email Sent" : "Error",
      data.message || data.error || "Please try again."
    );
  } catch {
    Alert.alert("Error", "Could not resend verification email.");
  }
};

export const loadSavedCredentials = async () => {
  try {
    const saved = await AsyncStorage.getItem("rememberMeCredentials");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};
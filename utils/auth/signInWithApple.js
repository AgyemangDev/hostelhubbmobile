import { signInWithCustomToken } from "firebase/auth";
import { Alert } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { auth } from "../../app/firebase/FirebaseConfig";
import API_BASE_URL from "../api/api";

/**
 * Apple Sign-In — sends idToken to backend for verification + student creation.
 */
export const signInWithApple = async (onSuccess) => {
  try {
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const res = await fetch(`${API_BASE_URL}/api/students/auth/apple`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken:  appleCredential.identityToken,
        email:    appleCredential.email,        // ← only present on first sign-in
        fullName: appleCredential.fullName,     // ← { givenName, familyName } or null
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Apple sign in failed.");

   await signInWithCustomToken(auth, data.firebaseToken);
onSuccess?.(data.student);

  } catch (err) {
    if (err.code !== "ERR_CANCELED") {
      Alert.alert("Apple Sign In Failed", err.message || "Please try again.");
    }
  }
};
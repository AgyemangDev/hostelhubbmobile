import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { signInWithCustomToken } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "../../app/firebase/FirebaseConfig";
import API_BASE_URL from "../api/api";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = "397953583899-ct9sqh87dh4ftv28qn8g8nk7llo7u7ei.apps.googleusercontent.com" || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const APP_SCHEME    = "hostelhubb";
const CALLBACK_URL  = "https://hostelhubbgh.web.app/auth/callback";

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);

  const signIn = async (onSuccess) => {
    try {
      setLoading(true);

      const nonce = Math.random().toString(36).substring(2);

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${encodeURIComponent(WEB_CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(CALLBACK_URL)}` +
        `&response_type=code` +
        `&scope=openid%20email%20profile` +
        `&nonce=${nonce}` +
        `&access_type=online` +  `&prompt=select_account`;;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        `${APP_SCHEME}://auth`
      );

      if (result.type !== "success") return;

      // Parse auth code from redirect
      const query  = result.url.includes("?")
        ? result.url.split("?")[1]
        : result.url.split("#")[1] ?? "";
      const params = new URLSearchParams(query);
      const code   = params.get("code");

      if (!code) throw new Error("No auth code returned from Google.");

      // Send code to backend — backend exchanges + verifies + creates student
      const res  = await fetch(`${API_BASE_URL}/api/students/auth/google/callback`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code, redirectUri: CALLBACK_URL }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign in failed.");

      // Sign in Firebase client with custom token from backend
      await signInWithCustomToken(auth, data.firebaseToken);
onSuccess?.(data.student);

    } catch (err) {
      Alert.alert("Google Sign In Failed", err.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, signIn };
}
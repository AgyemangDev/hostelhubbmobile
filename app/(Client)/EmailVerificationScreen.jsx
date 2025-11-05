import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { getAuth, sendEmailVerification, reload } from "firebase/auth";
import { useRouter } from "expo-router";
import Button from "../../components/ButtonComponents/ButtonComponent";

const EmailVerificationScreen = () => {
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  // Function to send verification email
  const handleSendVerification = async () => {
    if (!auth.currentUser) {
      Alert.alert("No User", "You must be logged in to send a verification email.");
      return;
    }

    try {
      setSending(true);
      await sendEmailVerification(auth.currentUser);
      Alert.alert(
        "Verification Sent",
        "A verification email has been sent to your inbox. Please check and verify. If you don't see it, check your SPAM folder."
      );
      // Start automatic verification checking
      checkVerificationStatus();
    } catch (error) {
      console.error("Error sending email verification:", error);
      Alert.alert("Error", "Failed to send verification email. Try again.");
    } finally {
      setSending(false);
    }
  };

  // Function to check if email is verified every 3 seconds
  const checkVerificationStatus = async () => {
    if (!auth.currentUser) return;

    setChecking(true);
    const interval = setInterval(async () => {
      await reload(auth.currentUser); // reload user info from Firebase
      if (auth.currentUser.emailVerified) {
        clearInterval(interval);
        Alert.alert("Email Verified", "Your email has been verified!");
        router.replace("/Login"); // Navigate to login
      }
    }, 3000); // check every 3 seconds
  };

  const handleGoToLogin = () => {
    auth.signOut();
    router.replace("/Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/Email.gif")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.text}>
          We’ve sent a verification link to your email address. Please verify it
          before continuing.
        </Text>

        <Button
          buttonText={sending ? "Sending..." : "Send Verification Email"}
          onPressFunction={handleSendVerification}
          customStyle={{}} // white background + brown border/text
        />

        <Button
          buttonText="Go to Login Page"
          onPressFunction={handleGoToLogin}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#fff" },
  content: { alignItems: "center", paddingHorizontal: 30 },
  image: { width: 250, height: 250, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#1a1a2e", marginBottom: 10, textAlign: "center" },
  text: { fontSize: 15, color: "#555", textAlign: "center", marginBottom: 30, lineHeight: 22 },
});

export default EmailVerificationScreen;

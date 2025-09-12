import React, { useState } from "react";
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../constants/Colors";
import SignupForm from "../../components/Authentication/SignUpForm";
import LoginLink from "../../components/Links/LoginLink";
import { validateForm } from "../../utils/validateEmailUtil";
import { signUpUser, getErrorMessage } from "../../services/AuthenticationService";

const ClientSignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputsDisabled, setInputsDisabled] = useState(false);

  const handleSignUp = async () => {
    // Validate form inputs
    const validationError = validateForm(email, password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setInputsDisabled(true);

    try {
      await signUpUser(email, password);
      
      navigation.navigate("locSelection");
      Alert.alert(
        "Verification Sent",
        "Please check your inbox and verify your account before continuing."
      );
    } catch (error) {
      setError(getErrorMessage(error));
      setLoading(false);
      setInputsDisabled(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("ClientLogIn");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Create An Account</Text>
          </View>
          
          <SignupForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isPasswordVisible={isPasswordVisible}
            setIsPasswordVisible={setIsPasswordVisible}
            isConfirmPasswordVisible={isConfirmPasswordVisible}
            setIsConfirmPasswordVisible={setIsConfirmPasswordVisible}
            error={error}
            loading={loading}
            inputsDisabled={inputsDisabled}
            handleSignUp={handleSignUp}
          />
          
          <LoginLink onPress={navigateToLogin} />
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
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    bottom: 20,
    fontSize: 30,
    fontWeight: "500",
    color: COLORS.background,
  },
});

export default ClientSignUp;
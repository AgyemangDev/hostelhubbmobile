import React,{useState} from "react";
import { StyleSheet, View, Image } from "react-native";
import FormInput from "../InputFields/FormInput";
import ErrorPopup from "../ErrorMessage/ErrorMessage";
import ActionButton from "../ButtonComponents/ActionButton";
import TermsLink from "../Links/TermsLink";
import EvilIcons from "@expo/vector-icons/EvilIcons";

const SignupForm = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isPasswordVisible,
  setIsPasswordVisible,
  isConfirmPasswordVisible,
  setIsConfirmPasswordVisible,
  error,
  loading,
  inputsDisabled,
  handleSignUp,
}) => {
  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Image
          source={require("../../assets/images/signup-client.gif")}
          style={styles.image}
        />
        <FormInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          disabled={inputsDisabled}
        />
      </View>

      <View style={styles.inputContainer}>
        <FormInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          isPasswordInput={true}
          isPasswordVisible={isPasswordVisible}
          togglePasswordVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
          disabled={inputsDisabled}
        />

        <FormInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPasswordInput={true}
          isPasswordVisible={isConfirmPasswordVisible}
          togglePasswordVisibility={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          disabled={inputsDisabled}
        />
      </View>

      <ErrorPopup message={error} />
      
      <TermsLink
        link={"https://hostelhubb.com/terms"}
        text={"Continue if you agree to our terms and conditions."}
      />
      
      <ActionButton
        title="Continue"
        onPress={handleSignUp}
        loading={loading}
        icon={<EvilIcons name="arrow-right" size={30} color="white" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
    alignItems: "center",
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: "contain",
  },
});

export default SignupForm;
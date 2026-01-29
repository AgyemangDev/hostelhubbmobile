import React from "react";
import { StyleSheet, View, Image } from "react-native";
import FormInput from "../InputFields/FormInput";
import ErrorPopup from "../ErrorMessage/ErrorMessage";
import Button from "../ButtonComponents/ButtonComponent";
import TermsLink from "../Links/TermsLink";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import COLORS from "../../constants/Colors";

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
      {/* Top Image */}
      <Image
        source={require("../../assets/images/signup-client.gif")}
        style={styles.image}
      />

      {/* Inputs */}
      <FormInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        disabled={inputsDisabled}
      />

      <FormInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        isPasswordInput
        isPasswordVisible={isPasswordVisible}
        togglePasswordVisibility={() =>
          setIsPasswordVisible(!isPasswordVisible)
        }
        disabled={inputsDisabled}
      />

      <FormInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        isPasswordInput
        isPasswordVisible={isConfirmPasswordVisible}
        togglePasswordVisibility={() =>
          setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
        }
        disabled={inputsDisabled}
      />

      {/* Error Message */}
      <ErrorPopup message={error} />

      {/* Terms */}
      <TermsLink
        link={"https://hostelhubb.com/terms"}
        text={"Continue if you agree to our terms and conditions."}
      />

      {/* Button */}
      <Button
        buttonText="Continue"
        onPressFunction={handleSignUp}
        icon={<EvilIcons name="arrow-right" size={30} color={COLORS.white} />}
        customStyle={{ marginTop: 20 }}
      />
    </View>
  );
};

export default SignupForm;


const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
});

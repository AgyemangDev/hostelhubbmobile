import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import COLORS from "../../constants/Colors";
import FormInput from "../InputFields/FormInput";
import CustomDropdown from "../CustomDropdown";
import Button from "../ButtonComponents/ButtonComponent";

const PersonalInfoForm = ({
  firstName,
  setFirstName,
  surname,
  setSurname,
  phoneNumber,
  setPhoneNumber,
  referredBy,
  setReferredBy,
  selectedGender,
  setSelectedGender,
  isGenderVisible,
  toggleGenderVisibility,
  loading,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Information</Text>

      <FormInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        editable={!loading}
      />

      <FormInput
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
        editable={!loading}
      />

      <FormInput
        placeholder="Phone Number(whatsapp preferred)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        editable={!loading}
      />

      <FormInput
        placeholder="Agent or Referral Code (Optional)"
        value={referredBy}
        onChangeText={setReferredBy}
        editable={!loading}
      />

      <CustomDropdown
        data={["Male", "Female"]}
        selectedValue={selectedGender}
        onSelect={setSelectedGender}
        placeholder="Select Gender"
        visible={isGenderVisible}
        onPress={toggleGenderVisibility}
        disabled={loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <Button buttonText="Complete Sign Up" onPressFunction={onSubmit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignItems: "center",
  },
  title: {
    color: COLORS.titleColor,
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 15,
    textAlign: "center",
  },
});

export default PersonalInfoForm;

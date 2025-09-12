import React from 'react';
import { View } from 'react-native';
import InputField from './InputField';

const BookingFormFields = ({ formData, handleInputChange }) => {
  return (
    <View>
      <InputField
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(value) => handleInputChange('fullName', value)}
      />
      <InputField
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
      />
      <InputField
        placeholder="Phone Number"
        value={formData.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
      />
      <InputField
        placeholder="Gender"
        value={formData.gender}
        onChangeText={(value) => handleInputChange('gender', value)}
      />
      <InputField
        placeholder="Program"
        value={formData.program}
        onChangeText={(value) => handleInputChange('program', value)}
      />
      <InputField
        placeholder="College"
        value={formData.college}
        onChangeText={(value) => handleInputChange('college', value)}
      />
      <InputField
        placeholder="Emergency Contact Name"
        value={formData.emergencyContactName}
        onChangeText={(value) => handleInputChange('emergencyContactName', value)}
      />
      <InputField
        placeholder="Emergency Contact Number"
        value={formData.emergencyContactNumber}
        onChangeText={(value) => handleInputChange('emergencyContactNumber', value)}
      />
    </View>
  );
};

export default BookingFormFields;

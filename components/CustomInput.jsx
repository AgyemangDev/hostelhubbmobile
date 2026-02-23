import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import COLORS from '../constants/Colors';

const CustomInput = ({ placeholder, value, onChangeText, keyboardType = 'default', placeholderTextColor = '#9a0b0d' }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={placeholderTextColor}
      keyboardType={keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderColor: COLORS.background, 
    borderWidth: 1,
    fontSize: 16,
    color: '#9a0b0d',
    width:330,
    marginBottom:8
  }
});

export default CustomInput;

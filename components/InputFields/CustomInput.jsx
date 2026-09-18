import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

const CustomInput = ({ placeholder, value, onChangeText, keyboardType = 'default', placeholderTextColor = '#0D9488' }) => {
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
    color: '#0D9488',
    width:330,
    marginBottom:8
  }
});

export default CustomInput;

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

const Button = ({ buttonText, onPressFunction }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPressFunction}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.background,
    marginBottom: 10,
    backgroundColor: COLORS.background, 
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: '500',
  },
});

export default Button;

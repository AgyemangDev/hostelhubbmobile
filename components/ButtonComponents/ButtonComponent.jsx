import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

const Button = ({ buttonText, onPressFunction, customStyle }) => {
  const isCustom = customStyle ? true : false;

  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        isCustom && {
          backgroundColor: '#fff',
          borderColor: COLORS.background,
        },
        customStyle,
      ]}
      onPress={onPressFunction}
    >
      <Text
        style={[
          styles.buttonText,
          isCustom && { color: COLORS.background },
        ]}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    width: 300,
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
    color: '#fff',
    fontWeight: '500',
  },
});

export default Button;

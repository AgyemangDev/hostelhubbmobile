import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  keyboardType = 'default',
  icon,
  secureTextEntry,
  error,
  required = false,
  autoCapitalize = 'none',
  maxLength,
  editable = true
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);
  
  // Animation for focus effect
  const animatedValue = new Animated.Value(value ? 1 : 0);
  
  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };
  
  // Animated styles for label
  const labelStyle = {
    position: 'absolute',
    left: icon ? 45 : 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [17, -10],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#888', '#610b0c'],
    }),
    backgroundColor: isFocused || value ? '#fff' : 'transparent',
    paddingHorizontal: isFocused || value ? 4 : 0,
    zIndex: 1,
  };
  
  return (
    <View style={styles.container}>
      {label && (
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}{required && <Text style={styles.required}> *</Text>}
        </Animated.Text>
      )}
      
      <View style={[
        styles.inputContainer, 
        isFocused && styles.focusedInput,
        error && styles.errorInput,
        !editable && styles.disabledInput
      ]}>
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color={isFocused ? "#610b0c" : "#888"} />
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            secureTextEntry && styles.secureInput
          ]}
          placeholder={isFocused || !label ? placeholder : ''}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          editable={editable}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.secureButton}
            onPress={() => setIsSecureVisible(!isSecureVisible)}
          >
            <Ionicons 
              name={isSecureVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color="#888" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={16} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  focusedInput: {
    borderColor: '#610b0c',
    borderWidth: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorInput: {
    borderColor: '#e74c3c',
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
    borderColor: '#eee',
  },
  iconContainer: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  secureInput: {
    paddingRight: 50,
  },
  secureButton: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '500',
  },
  required: {
    color: '#e74c3c',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default InputField;

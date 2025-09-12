import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../constants/Colors';
import { auth } from '../firebase/FirebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from 'expo-router';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const navigation = useNavigation()

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
         sendPasswordResetEmail(auth, email);
        Alert.alert('Success', 'Password reset link has been sent to your email.');
        navigation.navigate('ClientLogIn');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Forget Password</Text>
        <Text style={styles.subtitle}>Enter your email account to reset your hostelhubb account password</Text>

        <Image
          source={require('../../assets/images/forgotpassword.gif')}
          style={styles.image}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999999"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.button,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 60,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: '#dddddd',
    borderWidth: 1,
    marginBottom: 24,
    height: 60
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    height: 50
  },
  resetButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 15,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
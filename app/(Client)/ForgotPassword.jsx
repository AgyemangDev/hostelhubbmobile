import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../constants/Colors';
import { auth } from '../firebase/FirebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from 'expo-router';
import FormInput from "../../components/InputFields/FormInput";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset link has been sent to your email.');
      navigation.navigate('ClientLogIn');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email account to reset your HostelHubb account password
            </Text>

            <Image
              source={require('../../assets/images/forgotpassword.gif')}
              style={styles.image}
            />

            {/* ✅ Use FormInput instead of TextInput */}
            <FormInput
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: { width: '100%', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.button, marginBottom: 8 },
  subtitle: { fontSize: 16, color: COLORS.textMuted, textAlign: 'center', marginBottom: 40 },
  image: { width: '100%', height: 250, resizeMode: 'contain', marginBottom: 24 },
  resetButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { fontSize: 18, color: COLORS.white, fontWeight: 'bold' },
});

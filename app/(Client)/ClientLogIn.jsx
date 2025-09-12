import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import COLORS from "../../constants/Colors";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";

const ClientLogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  // Load saved credentials when component mounts
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedCredentials = await AsyncStorage.getItem('rememberMeCredentials');
      if (savedCredentials) {
        const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.log('Error loading saved credentials:', error);
    }
  };

  const saveCredentials = async (email, password) => {
    try {
      const credentials = {
        email,
        password,
      };
      await AsyncStorage.setItem('rememberMeCredentials', JSON.stringify(credentials));
    } catch (error) {
      console.log('Error saving credentials:', error);
    }
  };

  const clearSavedCredentials = async () => {
    try {
      await AsyncStorage.removeItem('rememberMeCredentials');
    } catch (error) {
      console.log('Error clearing saved credentials:', error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogIn = async () => {
    if (!email || !password) {
      Alert.alert("Credentials Needed", "Please fill all the fields");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Save or clear credentials based on remember me checkbox
      if (rememberMe) {
        await saveCredentials(email, password);
      } else {
        await clearSavedCredentials();
      }
      
      navigation.reset({
        index: 0,
        routes: [{ name: "(tabs)" }],
      });
    } catch (error) {
      Alert.alert("Error", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/login.gif")}
        style={styles.image}
      />
      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#610b0c"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#610b0c"
          autoCapitalize="none"
        />
      </View>

      {/* Remember Me Checkbox */}
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={toggleRememberMe}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
          <Text style={styles.rememberMeText}>Remember me for next login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
        style={styles.touchableOpacity}
      >
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.signInButtonContainer,
          Platform.OS === "android" && styles.androidTouchable,
        ]}
        onPress={handleLogIn}
        disabled={loading}
      >
        <Text style={styles.signInButtonText}>
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity
          style={[
            styles.signUpButtonContainer,
            Platform.OS === "android" && styles.androidTouchable,
          ]}
          onPress={() => navigation.navigate("ClientSignUp")}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  containerInput: {
    width: "80%",
    alignItems: "center",
  },
  image: {
    height: 300,
    width: 300,
    resizeMode: "contain",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 20,
    height: 50,
    paddingHorizontal: 10,
    borderColor: "#610b0c",
    borderWidth: 1,
    marginBottom: 10,
    width: "100%",
    color: "#000000",
  },
  rememberMeContainer: {
    width: "80%",
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#610b0c",
    borderRadius: 3,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  checkboxChecked: {
    backgroundColor: "#610b0c",
  },
  rememberMeText: {
    fontSize: 14,
    color: "#610b0c",
    fontWeight: "500",
  },
  forgotPassword: {
    color: "#610b0c",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "left",
  },
  signInButtonContainer: {
    height: 50,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#610b0c",
    backgroundColor: COLORS.button,
    marginBottom: 10,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  signUpContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 50,
  },
  signUpText: {
    fontSize: 16,
    marginRight: 5,
    color: "#000000",
  },
  signUpButtonContainer: {
    height: 50,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#610b0c",
    backgroundColor: "white",
    marginBottom: 10,
  },
  signUpButtonText: {
    fontSize: 16,
    color: "#610b0c",
    fontWeight: "500",
  },
  androidTouchable: {
    minHeight: 48,
    minWidth: 48,
  },
  touchableOpacity: {
    minHeight: 48,
    justifyContent: "center",
  },
});

export default ClientLogIn;
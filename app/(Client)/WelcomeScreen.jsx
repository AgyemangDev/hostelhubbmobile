import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../constants/Colors";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  const navigation = useNavigation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonSlideAnim = useRef(new Animated.Value(100)).current;
  
  useEffect(() => {
    // Title and content fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Content slide up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    
    // Image scale up
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    
    // Buttons slide up
    Animated.timing(buttonSlideAnim, {
      toValue: 0,
      duration: 1000,
      delay: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    navigation.navigate("ClientLogIn");
  };
  
  const handleSignUp = () => {
    navigation.navigate("ClientSignUp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.Text 
          style={[
            styles.logo, 
            { opacity: fadeAnim }
          ]}
        >
          Hostel Hubb
        </Animated.Text>
        
        <Animated.View style={{
          transform: [
            { scale: scaleAnim }
          ],
          opacity: fadeAnim
        }}>
          <Image
            source={require("../../assets/images/studentsignin_up.gif")}
            style={styles.image}
          />
        </Animated.View>
        
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim }
          ]
        }}>
          <Text style={styles.title}>Find Your Perfect Hostel</Text>
          <Text style={styles.description}>
            Are you a student looking for a comfortable and convenient place to
            stay? Discover the best hostels near your campus with all the
            amenities you need.
          </Text>
        </Animated.View>
      </View>
      
      <Animated.View style={[
        styles.buttonWrapper,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: buttonSlideAnim }
          ]
        }
      ]}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.adminContainer} 
          onPress={handleSignUp}
          activeOpacity={0.8}
        >
          <Text style={styles.adminText}>Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24, // Increased horizontal padding
    justifyContent: "space-between",
    paddingTop: 20, // Added top padding for better spacing
  },
  contentContainer: {
    alignItems: "center",
    marginTop: 50, // Increased top margin for better spacing
  },
  image: {
    height: width * 0.55, // Slightly larger
    width: width * 0.65, // Slightly larger
    resizeMode: "contain",
    marginVertical: 20, // Added vertical margin
  },
  logo: {
    color: "#8B0000",
    fontWeight: "900",
    fontStyle: "italic",
    fontSize: 38,
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: 'rgba(139, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    textAlign: "center",
    fontSize: 24, // Increased size
    fontStyle: "italic",
    fontWeight: "700",
    marginVertical: 12, // Increased spacing
    color: "#333", // Dark gray for better readability
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20, // Increased horizontal margin
    marginVertical: 15, // Increased vertical margin
    lineHeight: 24,
    color: "#555", // Neutral dark gray
  },
  buttonWrapper: {
    alignItems: "center",
    marginBottom: 40, // Increased bottom margin
    width: '100%',
  },
  buttonContainer: {
    height: 56, // Taller buttons
    width: width * 0.85, // Not touching edges
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12, // More rounded corners
    borderWidth: 1.5, // Slightly thicker border
    borderColor: "#8B0000",
    marginBottom: 16, // More space between buttons
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    color: "#8B0000",
    fontWeight: "600", // Slightly bolder
  },
  adminContainer: {
    height: 56, // Taller buttons
    width: width * 0.85, // Not touching edges
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12, // More rounded corners
    backgroundColor: COLORS.button,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  adminText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600", 
  },
});


console.log("Onboarding screen with animations created successfully!");
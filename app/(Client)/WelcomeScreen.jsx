import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../constants/Colors";
import Button from "../../components/ButtonComponents/ButtonComponent";

const { width } = Dimensions.get("window");

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonSlideAnim = useRef(new Animated.Value(100)).current;

  const handleLogin = () => { navigation.navigate("ClientLogIn"); }; 
  const handleSignUp = () => { navigation.navigate("ClientSignUp"); };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(buttonSlideAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.Text style={[styles.logo, { opacity: fadeAnim }]}>
          Hostel Hubb
        </Animated.Text>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Image
            source={require("../../assets/images/studentsignin_up.gif")}
            style={styles.image}
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={styles.title}>Simplify Student Life</Text>
          <Text style={styles.description}>
            Discover accomodation 🏠, store items 📦, shop essentials 🛍️, and
            book transports 🚍 — all in one easy platform built for students.
          </Text>
        </Animated.View>
      </View>

<Animated.View style={styles.buttonArea}>
  {/* Default Button */}
  <Button
    buttonText="Log In"
    onPressFunction={handleLogin}
  />

  <View style={{ height: 16 }} />

  {/* Inverted Button */}
  <Button
    buttonText="Sign Up"
    onPressFunction={handleSignUp}
    variant="inverted"
  />
</Animated.View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  content: {
    alignItems: "center",
    marginTop: 40,
  },
  image: {
    width: width * 0.65,
    height: width * 0.55,
    resizeMode: "contain",
    marginVertical: 20,
  },
  logo: {
    fontSize: 38,
    fontWeight: "900",
    fontStyle: "italic",
    color: COLORS.button,
    textShadowColor: COLORS.logoShadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontStyle: "italic",
    textAlign: "center",
    color: COLORS.textDark,
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: COLORS.textMuted,
    lineHeight: 24,
    marginHorizontal: 16,
  },
  buttonArea: {
    width: "100%",
    marginBottom: 32,
  },
  buttonSpacing: {
    height: 16,
  },
  buttonArea: {
  width: "100%",
  paddingHorizontal: 24,
  marginBottom: 32,
},
});


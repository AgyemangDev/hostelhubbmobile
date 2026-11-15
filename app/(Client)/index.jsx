import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedLoader from "../../components/ui/animation/AnimatedLoader";
import AnimatedText from "../../components/ui/animation/AnimatedText";
import BackgroundIcons from "../../components/ui/animation/BackgroundIcons";
import { UserContext } from "../../context/UserContext";
import { useNavigation, useRouter } from "expo-router";

const Index = () => {
  const { user, isLoading } = useContext(UserContext);
  const router = useRouter();
  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false); // Ensures delay + loading are both done

  useEffect(() => {
    // Wait 3 seconds to allow Firebase/UserContext time to settle
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

useEffect(() => {
  // When the app is opened from a link, the linked screen sits above this
  // splash; don't replace it.
  if (!navigation.isFocused()) return;
  if (isReady && !isLoading) {
    if (user) {
      if (user.emailVerified) {
        router.replace("/(tabs)/(index)");
      } else {
        router.replace("/EmailVerificationScreen"); // screen prompting verification
      }
    } else {
      router.replace("/FirstWelcomeScreen");
    }
  }
}, [isReady, isLoading, user, navigation]);


  // Always show splash while waiting
  return (
    <LinearGradient
      colors={["#ffffff", "#f6f6f8", "#f0f0f4"]}
      style={styles.container}
    >
      <BackgroundIcons />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <AnimatedLoader />
          <AnimatedText
            appName="Hostel Hubb"
            tagline="Campus Life Just Got Easier"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});

export default Index;

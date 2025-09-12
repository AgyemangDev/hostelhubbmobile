import React, { useContext, useState, useEffect, useRef } from "react";
import {View,Text,TouchableOpacity,StyleSheet,SafeAreaView,Share,ScrollView,Animated } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../../../constants/Colors";
import { UserContext } from "../../../context/UserContext";

const ReferralProgram = () => {
  const { userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [accordionVisible, setAccordionVisible] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      Alert.alert("Error", "User information not found");
    }
  }, [userInfo]);

  // Share referral code function
  const shareReferralCode = async () => {
    try {
      await Share.share({
        message: `🏡 Book hostels easily with Hostelhubb!
      
      Use my referral code: ${userInfo.referralCode} to sign up and enjoy exclusive benefits. We both earn GHS 5 for every successful booking! 🎉
      
      Download the app on app or play store or visit https://hostelhubb.com`,
      });
    } catch (error) {
      console.error("Error sharing referral code:", error);
      Alert.alert("Error", "Unable to share the referral code");
    }
  };

  // Toggle accordion visibility
  const toggleAccordion = () => {
    setAccordionVisible(!accordionVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Refer a friend</Text>
          <Text style={styles.subtitle}>
            Enjoy Our Remarkable Referral Bonus{" "}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total Referrals</Text>
            <Text style={styles.statValue}>{userInfo.totalReferal || 0}</Text>
          </View>
        </View>
        <View style={styles.stepsContainer}>
          <Step
            number={1}
            title="Invite your friends"
            subtitle="Just share your link using the refer button below"
          />
          <Step
            number={2}
            title="Earn with a successful booking"
            subtitle="Get 5 cedis per referral for every successful booking by your referral"
          />
          <Step
            number={3}
            title="You can withdraw your bonus!"
            subtitle="All referral bonuses are withdrawable into your account "
          />
        </View>
        <View style={styles.referralLinkContainer}>
          <TouchableOpacity
            style={styles.referButton}
            onPress={shareReferralCode}
          >
            <Icon name="link" color="white" size={20} />
            <Text style={styles.referButtonText}>Refer Now</Text>
          </TouchableOpacity>
        </View>
        {/* Accordion Button */}
        <TouchableOpacity
          style={styles.accordionButton}
          onPress={toggleAccordion}
        >
          <Text style={styles.accordionButtonText}>
            {accordionVisible ? "Hide Details" : "Show Details"}
          </Text>
          <Icon
            name={accordionVisible ? "chevron-up" : "chevron-down"}
            size={20}
            color={COLORS.background}
          />
        </TouchableOpacity>
        {/* Accordion Content */}
        {accordionVisible && (
          <View style={styles.accordionContent}>
            <Text style={styles.accordionText}>
              The Hostelhubb Referral Program is designed to reward you for
              spreading the word about the platform and bringing new users into
              our community. By sharing your unique referral code, you can
              invite your friends, family, and colleagues to sign up with
              Hostelhubb, making it easier for them to find great deals on their
              next hostel stay. Not only will your referrals benefit from
              exclusive offers and deals, but you’ll also be rewarded for every
              successful booking they make through Hostelhubb! For every person
              who successfully completes a booking with your referral code, you
              will earn 5 cedis! The more people you share with, the more you
              earn—there’s no limit to how much you can make! So start sharing
              your referral code today, and let’s grow the Hostelhubb community
              together. Start inviting your friends and watch your rewards grow
              as you help others experience the best hostel platform out there!
              Together, we can make booking hostels easier, cheaper, and more
              fun for everyone!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Step = ({ number, title, subtitle }) => {
  const animatedLineHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedLineHeight, {
      toValue: 40,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <Animated.View
        style={[styles.animatedLine, { height: animatedLineHeight }]}
      />
      <View style={styles.stepTextContainer}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.background,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  stepsContainer: {
    marginBottom: 60,
    gap: 30,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  animatedLine: {
    width: 2,
    backgroundColor: COLORS.background,
    marginHorizontal: 8,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  stepSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  accordionButton: {
    backgroundColor: "transparent",
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 16,
  },
  accordionButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  accordionContent: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 24,
  },
  accordionText: {
    color: "#333",
    fontSize: 15,
    lineHeight: 20,
    textAlign:'justify'
  },
  referralLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  referButton: {
    backgroundColor: COLORS.background,
    padding: 10,
    width: "60%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  referButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light gray background
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  statTitle: {
    fontSize: 14,
    color: COLORS.background,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default ReferralProgram;

import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  Text,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HostelDetailsHeader = ({ hostel, hostelId, scrollY }) => {
  const navigation = useNavigation();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${hostel?.accommodation_name}`,
      });
    } catch (error) {
      Alert.alert("Sharing failed", error.message);
    }
  };

  // Header background animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [80, 140],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Title animation
  const titleOpacity = scrollY.interpolate({
    inputRange: [100, 160],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const titleTranslate = scrollY.interpolate({
    inputRange: [100, 160],
    outputRange: [10, 0],
    extrapolate: "clamp",
  });

  // Icon color animation trigger
  const darkMode = scrollY.interpolate({
    inputRange: [90, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.wrapper}>
      {/* Animated background */}
      <Animated.View
        style={[
          styles.background,
          {
            opacity: headerOpacity,
          },
        ]}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          
          {/* Back */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#222"
            />
          </TouchableOpacity>

          {/* Animated title */}
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslate }],
            }}
          >
            <Text numberOfLines={1} style={styles.title}>
              {hostel?.accommodation_name}
            </Text>
          </Animated.View>

          {/* Share */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
          >
            <Feather
              name="share"
              size={20}
              color="#222"
            />
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
  },

  safeArea: {
    paddingTop: Platform.OS === "android"
      ? StatusBar.currentHeight
      : 0,
  },

  header: {
    height: 56,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    maxWidth: 180,
  },
});

export default HostelDetailsHeader;
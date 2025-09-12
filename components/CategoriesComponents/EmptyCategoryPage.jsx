import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../../constants/Colors";

const EmptyCategoryPage = ({ category }) => {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(20));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  // Enhanced animation sequence on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Get emoji based on category type with modern styling
  const getCategoryEmoji = (categoryType) => {
    switch (categoryType.toLowerCase()) {
      case "hotels":
        return "🏨";
      case "guest houses":
        return "🏠";
      case "homstels":
        return "🏡";
      default:
        return "🏘️";
    }
  };

  const emoji = getCategoryEmoji(category);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="auto" />
      
      <View style={styles.main}>
        {/* Emoji with modern circular background */}
        <Animated.View 
          style={[
            styles.emojiContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY }, { scale: scaleAnim }] 
            }
          ]}
        >
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
        </Animated.View>

        {/* Title with modern typography */}
        <Animated.View 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY }],
            marginBottom: 16,
            width: "100%"
          }}
        >
          <Text style={styles.title}>Coming Soon</Text>
          <Text style={styles.categoryTitle}>{category}</Text>
        </Animated.View>
        
        {/* Description with improved typography */}
        <Animated.View 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY }],
            marginBottom: 32,
            width: "90%"
          }}
        >
          <Text style={styles.description}>
            We're partnering with the best {category.toLowerCase()} near campus.
            More affordable student housing options coming soon!
          </Text>
        </Animated.View>
        
        {/* Modern notification box */}
        <Animated.View 
          style={[
            styles.notificationBox,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }] 
            }
          ]}
        >
          <View style={styles.notificationContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.notificationIcon}>📚</Text>
            </View>
            <Text style={styles.notificationText}>
              Check out our available campus hostels with student discounts!
            </Text>
          </View>
        </Animated.View>
        
        {/* Modern button with gradient */}
        <Animated.View 
          style={{ 
            width: "100%", 
            opacity: fadeAnim,
            transform: [{ translateY }],
            marginTop: 24
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("(categories)/(hostels)")}
            style={styles.buttonContainer}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B0000', '#B22222']} 
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Browse Available Hostels</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF"
  },
  main: {
    alignItems: "center",
    justifyContent: "center",
  },
  emojiContainer: {
    alignItems: "center", 
    marginBottom: 32,
  },
  emojiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F7F9FC",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    color: "#1F2937",
  },
  categoryTitle: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.background,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "400",
  },
  notificationBox: {
    backgroundColor: "#F5F8FF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    elevation: 2,
    shadowColor: "#4361EE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(116, 7, 7, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationText: {
    flex: 1,
    fontSize: 15,
    color: "#4B5563",
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#4361EE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  }
});

export default EmptyCategoryPage;
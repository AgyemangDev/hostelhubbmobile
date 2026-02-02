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
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HostelDetailsHeader = ({ hostel, hostelId, scrolled }) => {
  const navigation = useNavigation();

  const handleShare = async () => {
    try {
      const shareLink = `https://hostelhubb.com/hostel/${hostelId}`;
      await Share.share({
        message: `Check out this hostel: ${hostel?.accommodation_name} on Hostelhubb!`,
        url: shareLink,
      });
    } catch (error) {
      Alert.alert("Sharing failed", error.message);
    }
  };

  return (
    <View
      style={[
        styles.headerContainer,
        scrolled && styles.headerScrolled,
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="arrow-back" 
              size={22} 
              color={scrolled ? "#333" : "#fff"} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Feather 
              name="share-2" 
              size={20} 
              color={scrolled ? "#333" : "#fff"} 
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "transparent",
    transition: "all 0.3s ease",
  },
  headerScrolled: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    height: Platform.OS === "ios" ? 45 : 54,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HostelDetailsHeader;
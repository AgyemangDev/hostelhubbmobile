import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert, SafeAreaView, Platform, StatusBar } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import COLORS from '../../constants/Colors';

const HostelDetailsHeader = ({ hostel, hostelId }) => {
  const navigation = useNavigation();

  const handleShare = async () => {
    try {
      const shareLink = `https://hostelhubb.com/hostel/${hostelId}`;
      const result = await Share.share({
        message: `Yo, check out this hostel: ${hostel?.hostelName} on Hostelhubb! Looks like a solid spot. 😊`,
        url: shareLink,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert("Sharing failed", error.message);
    }
  };

  return (
    <View style={[styles.headerContainer]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {hostel?.hostelName || "Hostel Details"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Feather name="share-2" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.button, 
    overflow: 'hidden', 
  },
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10, 
    paddingHorizontal: 16,
    height: Platform.OS === 'ios' ? 45 : 54, 
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    maxWidth: '100%',
  },
  iconButton: {
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HostelDetailsHeader;
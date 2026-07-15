import React, { useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  ScrollView,
  Modal,
  Share,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../../context/UserContext";
import { useNavigation } from "expo-router";
import LogoutButton from "../../../components/LogoutButton";
import DeleteAccountButton from "../../../components/ButtonComponents/DeleteButton";
import styles from "../../../assets/Styles/ProfileStyles";
import ProfileLinkItem from "../../../components/ProfileComponent/ProfileLinkItem";
import * as Updates from "expo-updates";
import Constants from "expo-constants";
import NoAccountPrompt from "../../../components/Authentication/NoAccountPrompt";

const Profile = () => {
  const { userInfo } = useContext(UserContext);
  const navigation = useNavigation();

  if (!userInfo) {
    return (
      <View style={{ flex: 1 }}>
        <NoAccountPrompt />
      </View>
    );
  }

  const formattedTimestamp = userInfo?.created_at
    ? `Joined Hostelhubb on ${new Date(userInfo.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
    : "Loading timestamp...";

  const myReferralCode = userInfo?.referral_code || "—";

  const handleShareReferral = async () => {
    try {
      const referralUrl = `https://hostelhubb.com/refer/${encodeURIComponent(myReferralCode)}`;

      await Share.share({
        message: `Use my referral code ${myReferralCode} to book for storage on hostelhubb, and share yours with someone to earn.`,
        url: referralUrl,
      });
    } catch (e) {
      console.warn("Failed to open share sheet:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[styles.profileName, { flex: 1 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userInfo
                    ? `${userInfo.first_name ?? ""} ${userInfo.surname ?? ""}`.trim()
                    : "Loading..."}
                </Text>

              </View>

              <Text style={styles.profileSub}>{userInfo?.email ?? "Loading..."}</Text>

              {/* Text link below name/email */}
              <Pressable onPress={handleShareReferral} hitSlop={8} style={{ marginTop: 8 }}>
                <Text style={{ color: "#0F7A5C", fontSize: 13, fontWeight: "600" }}>
                  Click to share your referral code to earn 
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Advertisement Section */}
          <View style={styles.adContainer}>
            <View style={styles.adContent}>
              <Image
                source={require("../../../assets/images/Shopping.gif")}
                style={styles.adImage}
                resizeMode="cover"
              />
              <View style={styles.adTextContainer}>
                <Text style={styles.adTitle}>HostelHubb Your Stay</Text>
                <Text style={styles.adDescription}>
                  Accommodation, storage and transport reservation made easy, right on your campus.
                </Text>
              </View>
            </View>
          </View>

          {/* Links Section */}
          <View style={styles.linksContainer}>
            {[
              { icon: "account-circle", label: "Personal Info", route: "personalInfo" },
              { icon: "money", label: "Deposits & Transaction", route: "transactions" },
              { icon: "work", label: "How Hostelhubb Works", route: "howHostelHubbWorks" },
              { icon: "diversity-1", label: "Our Referral Program", route: "referralInfo" },
              // { icon: "report", label: "Report A Concern", route: "reportAConcern" },
              { icon: "contact-support", label: "About Us", link: "https://hostelhubb.com" },
            ].map((item, index) => (
              <ProfileLinkItem
                key={index}
                {...item}
                style={styles.linkItem}
                onNavigate={navigation.navigate}
              />
            ))}

            <Text style={styles.time}>{formattedTimestamp}</Text>

            {/* Version Info */}
            <Text style={{ textAlign: "center", color: "#aaa", fontSize: 11, marginTop: 4 }}>
              App v{Constants.expoConfig?.version ?? "—"}
              {" · "}
              {Updates.isEmbeddedLaunch
                ? "Built-in bundle"
                : `OTA ${Updates.updateId?.slice(0, 8) ?? "unknown"}`}
            </Text>
            <Text style={{ textAlign: "center", color: "#ccc", fontSize: 10, marginBottom: 8 }}>
              {/* Runtime: {Updates.runtimeVersion ?? "—"} · Channel: {channel} */}
            </Text>

            <View style={styles.buttonRow}>
              <LogoutButton />
              {userInfo && <DeleteAccountButton userId={userInfo.id} />}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
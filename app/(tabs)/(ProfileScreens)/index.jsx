import React, { useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import { UserContext } from "../../../context/UserContext";
import { useNavigation } from "expo-router";
import LogoutButton from "../../../components/LogoutButton";
import DeleteAccountButton from "../../../components/ButtonComponents/DeleteButton"
import styles from "../../../assets/Styles/ProfileStyles";
import ProfileLinkItem from "../../../components/ProfileComponent/ProfileLinkItem";
import * as Updates from "expo-updates";
import Constants from "expo-constants";

const Profile = () => {
  const { userInfo } = useContext(UserContext);
  const navigation = useNavigation();

  const channel = Updates.channel 
  ?? Constants.expoConfig?.extra?.updates?.channel  
  ?? Constants.manifest2?.extra?.expoClient?.extra?.updates?.channel
  ?? "production";
  
const formattedTimestamp = userInfo?.created_at
  ? `Joined Hostelhubb on ${new Date(userInfo.created_at).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`
  : "Loading timestamp...";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {/* Profile Section */}
<View style={styles.profileSection}>
  <View style={styles.profileDetails}>
    {/* Circular Avatar */}
    {userInfo ? (
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarLetter}>
          {userInfo.first_name?.[0]?.toUpperCase() ?? "?"}
        </Text>
      </View>
    ) : null}

    {/* Name & Email */}
    <View>
      <Text style={styles.profileName}>
        {userInfo
          ? `${userInfo.first_name ?? ""} ${userInfo.surname ?? ""}`.trim()
          : "Loading..."}
      </Text>
      <Text style={styles.profileSub}>
        {userInfo?.email ?? "Loading..."}
      </Text>
    </View>
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
                  Accommodation, storage reservations, transport and student life made easy, right on your campus.
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

            {/* Logout and Delete Buttons */}
            <LogoutButton />

            {/* Show Delete button only when userInfo is loaded */}
            {userInfo && <DeleteAccountButton userId={userInfo.id} />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

import React, { useContext } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { UserContext } from "../../../context/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";
import { useNavigation } from "expo-router";
import LogoutButton from "../../../components/LogoutButton";
import DeleteAccountButton from "../../../components/DeleteButton";
import styles from "../../../assets/Styles/ProfileStyles";

const Profile = () => {
  const { userInfo } = useContext(UserContext);
  const navigation = useNavigation();

  const formattedTimestamp = userInfo?.Timestamp
    ? typeof userInfo.Timestamp === "object" && userInfo.Timestamp.toDate
      ? `Joined Hostelhubb on ${userInfo.Timestamp.toDate().toLocaleDateString(
          "en-US",
          { day: "numeric", month: "long", year: "numeric" }
        )}`
      : `Joined Hostelhubb on ${new Date(
          userInfo.Timestamp * 1000
        ).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`
    : "Loading timestamp...";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>PROFILE</Text>
        <View style={styles.gridContainer}>
          <View>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profileDetails}>
                <View>
                  <Text style={styles.profileName}>
                    {userInfo
                      ? `${userInfo.firstName ?? ""} ${
                          userInfo.surname ?? ""
                        }`.trim()
                      : "Loading..."}
                  </Text>
                  <Text style={styles.profileSub}>
                    {userInfo ? userInfo.email : "Loading..."}
                  </Text>
                </View>
              </View>
            </View>

            {/* Advertisement Section */}
            <View style={styles.adContainer}>
              <View style={styles.adContent}>
                <Image
                  source={require("../../../assets/images/studentsignin_up.gif")}
                  style={styles.adImage}
                  resizeMode="cover"
                />
                <View style={styles.adTextContainer}>
                  <Text style={styles.adTitle}>HostelHubb Your Stay</Text>
                  <Text style={styles.adDescription}>
                Hostel,accommodation and storage reservations made easy, right on your campus.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.linksContainer}>
            {/* Links Section */}
            {[
              {
                icon: "account-circle",
                label: "Personal Info",
                route: "personalInfo",
              },
              { icon: "money", label: "Transactions & Subscriptions", route: "transactions" },
                {
                icon: "work",
                label: "How Hostelhubb Works",
                route: "howHostelHubbWorks",
              },

              {
                icon: "diversity-1",
                label: "Our Referral Program",
                route: "referralInfo",
              },
              {
                icon: "report",
                label: "Report A Concern",
                route: "reportAConcern",
              },

              {
                icon: "contact-support",
                label: "Contact Us",
                route: "contactHostel",
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.linkItem}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={styles.linkDetails}>
                  <MaterialIcons
                    name={item.icon}
                    size={24}
                    color={COLORS.background}
                  />
                  <Text style={styles.linkLabel}>{item.label}</Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={COLORS.background}
                />
              </TouchableOpacity>
            ))}

            <Text style={styles.time}>{formattedTimestamp}</Text>
            <LogoutButton />
            <DeleteAccountButton />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

import React, { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import * as Updates from "expo-updates";
import { UserContext } from "../../../context/UserContext";
import { WalletContext } from "../../../context/WalletContext";
import LogoutButton from "../../../components/buttons/profile/LogoutButton";
import DeleteAccountButton from "../../../components/buttons/profile/DeleteAccountButton";
import ProfileLinkItem from "../../../components/lists/profile/ProfileLinkItem";
import ReferralShareCard from "../../../components/cards/referral/ReferralShareCard";
import NoAccountPrompt from "../../../components/feedback/auth/NoAccountPrompt";
import { Button, Card, Icon, PressableScale, Text } from "../../../components/ui";
import { money } from "../../../utils/formatMoney";
import { versionLabel } from "../../../utils/appStore";
import { colors, radius, space } from "../../../constants/theme";

const ACCOUNT_LINKS = [
  { icon: "person-circle-outline", label: "Personal info", route: "personalInfo" },
  { icon: "cash-outline", label: "Transactions & rewards", route: "transactions" },
  { icon: "notifications-outline", label: "Notifications", href: "/NotificationScreen" },
  { icon: "construct-outline", label: "Problems I've reported", href: "/complaints" },
];

const LEARN_LINKS = [
  { icon: "people-outline", label: "Our referral program", route: "referralInfo" },
  { icon: "briefcase-outline", label: "How HostelHubb works", route: "howHostelHubbWorks" },
  { icon: "help-circle-outline", label: "About us", link: "https://hostelhubb.com" },
];

const initials = (first, last) =>
  [first, last].map((s) => s?.trim()?.[0]).filter(Boolean).join("").toUpperCase() || "?";

function LinkGroup({ title, items, onNavigate }) {
  return (
    <View style={{ gap: space.xs }}>
      <Text variant="caption" tone="secondary" style={styles.groupTitle}>{title}</Text>
      <Card style={styles.group}>
        {items.map((item, i) => (
          <ProfileLinkItem key={item.label} {...item} last={i === items.length - 1} onNavigate={onNavigate} />
        ))}
      </Card>
    </View>
  );
}

const Profile = () => {
  const { userInfo } = useContext(UserContext);
  const { balance } = useContext(WalletContext) || {};
  const navigation = useNavigation();
  const router = useRouter();

  if (!userInfo) {
    return (
      <View style={{ flex: 1 }}>
        <NoAccountPrompt />
      </View>
    );
  }

  const name = `${userInfo.first_name ?? ""} ${userInfo.surname ?? ""}`.trim() || "Your profile";
  const joined = userInfo.created_at
    ? new Date(userInfo.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    // Bottom edge is left to the tab bar.
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle} accessibilityRole="header">Profile</Text>

        {/* Who you are */}
        <PressableScale
          onPress={() => navigation.navigate("personalInfo")}
          accessibilityRole="button"
          accessibilityLabel={`${name}, edit personal info`}
          style={styles.identity}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(userInfo.first_name, userInfo.surname)}</Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="heading" numberOfLines={1}>{name}</Text>
            {userInfo.email ? <Text variant="caption" tone="secondary" numberOfLines={1}>{userInfo.email}</Text> : null}
            {joined ? <Text variant="caption" tone="secondary">Member since {joined}</Text> : null}
          </View>
          <Icon name="chevron-forward" size={18} tone="secondary" />
        </PressableScale>

        {/* Invite friends */}
        <ReferralShareCard code={userInfo.referral_code} onLearnMore={() => navigation.navigate("referralInfo")} />

        {/* Earnings */}
        <Card style={styles.wallet}>
          <View style={styles.walletIcon}>
            <Icon name="wallet-outline" size={20} tone="brand" />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="caption" tone="secondary">Referral earnings</Text>
            <Text style={styles.walletAmount}>{money(Number(balance) || 0)}</Text>
          </View>
          <Button title="Withdraw" variant="secondary" size="sm" onPress={() => router.push("/wallet")} />
        </Card>

        <LinkGroup title="ACCOUNT" items={ACCOUNT_LINKS} onNavigate={navigation.navigate} />
        <LinkGroup title="LEARN MORE" items={LEARN_LINKS} onNavigate={navigation.navigate} />

        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            <LogoutButton />
            <DeleteAccountButton userId={userInfo.id} />
          </View>
          <Text variant="caption" tone="secondary" style={styles.version}>
            App v{versionLabel() ?? "—"}
            {" · "}
            {Updates.isEmbeddedLaunch ? "Built-in bundle" : `OTA ${Updates.updateId?.slice(0, 8) ?? "unknown"}`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: space.lg, paddingTop: space.xs, paddingBottom: space.xxxl, gap: space.lg },
  screenTitle: { fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: -0.3, color: colors.text },
  identity: { flexDirection: "row", alignItems: "center", gap: space.md },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.brandSoft, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 22, fontWeight: "800", color: colors.brand },
  wallet: { flexDirection: "row", alignItems: "center", gap: space.md },
  walletIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.brandSoft, alignItems: "center", justifyContent: "center" },
  walletAmount: { fontSize: 20, lineHeight: 26, fontWeight: "800", color: colors.text },
  groupTitle: { fontWeight: "700", letterSpacing: 1, paddingHorizontal: 2 },
  group: { paddingVertical: 0 },
  footer: { gap: space.sm, paddingTop: space.sm },
  footerButtons: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  version: { textAlign: "center", fontSize: 11, marginTop: space.xs },
});

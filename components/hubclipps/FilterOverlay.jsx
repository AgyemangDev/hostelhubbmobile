import React, { useContext, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import ClientLogIn from "../../app/(Client)/ClientLogIn";
import { auth } from "../../lib/firebase/FirebaseConfig";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { institutions, roomTypes, buildingTypes } from "../../assets/data/data";
import { UserContext } from "../../context/UserContext";
import { Button, Chip, IconButton, PillTabs, Sheet } from "../ui/ds";
import { onVideo, space, type } from "../../constants/theme";

/**
 * Top of the Hubclips feed: "For you / Near <your school>" tabs and a filter
 * button, plus the filter sheet itself.
 *
 * Filters are drafted locally while the sheet is open, so tapping chips
 * doesn't refetch on every tap; Apply pushes them to the context.
 */
export default function FilterOverlay({ visible, onClose, filters, onApplyFilters, onClearFilters, onToggle }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userInfo } = useContext(UserContext);
  const [showAuth, setShowAuth] = useState(false);

  // Posting a room needs an account; ask signed-out students to log in first.
  const startPosting = () => {
    if (!auth.currentUser) return setShowAuth(true);
    router.push("/IntroductionScreen");
  };
  const [draft, setDraft] = useState(filters);
  const school = userInfo?.institution;

  const activeCount = ["institution", "accommodationType", "roomType", "priceRange"].filter((k) => filters?.[k]).length;
  // "Near <school>" uses the school saved on the student's profile
  // (userInfo.institution). With no school filter set, the feed already
  // defaults to that school, so that state counts as "near" too.
  // "For you" sends an empty school, which the feed reads as all schools.
  const tab = school && (filters?.institution === school || filters?.institution == null) ? "near" : "all";

  const setTab = (next) => onApplyFilters({ ...filters, institution: next === "near" ? school : "" });

  const toggle = (key, value) => setDraft((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));

  const Section = ({ title, data, k, useLabel }) => (
    <View style={{ gap: space.sm }}>
      <Text style={type.heading}>{title}</Text>
      <View style={styles.chips}>
        {data.map((item) => {
          const v = useLabel ? item.label : item.value;
          return <Chip key={v} label={item.label} selected={draft?.[k] === v} onPress={() => toggle(k, v)} />;
        })}
      </View>
    </View>
  );

  return (
    <>
      <View style={[styles.top, { top: insets.top + space.xs }]} pointerEvents="box-none">
        <PillTabs
          tone="dark"
          value={tab}
          onChange={setTab}
          options={[{ value: "all", label: "For you" }, ...(school ? [{ value: "near", label: `Near ${school}` }] : [])]}
        />
        <View style={{ flexDirection: "row", gap: space.xs }}>
          <IconButton
            icon="add"
            color="#1C1917"
            accessibilityLabel="Post a room as a clip"
            onPress={startPosting}
            style={styles.addBtn}
          />
          <View>
          <IconButton
            icon="options-outline"
            color="#FFFFFF"
            iconStyle={onVideo.text}
            accessibilityLabel={activeCount ? `Filters, ${activeCount} on` : "Filters"}
            onPress={() => {
              setDraft(filters);
              onToggle();
            }}
            style={styles.filterBtn}
          />
          {activeCount ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeCount}</Text>
            </View>
          ) : null}
          </View>
        </View>
      </View>

      <Sheet
        visible={visible}
        onClose={onClose}
        title="Filter clips"
        footer={
          <View style={{ flexDirection: "row", gap: space.sm }}>
            <Button
              title="Clear"
              variant="secondary"
              style={{ flex: 1 }}
              onPress={() => {
                onClearFilters();
                setDraft({ institution: null, accommodationType: null, priceRange: null, roomType: null });
              }}
            />
            <Button
              title="Show clips"
              style={{ flex: 1.4 }}
              onPress={() => {
                onApplyFilters(draft);
                onClose();
              }}
            />
          </View>
        }
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: space.xl, paddingBottom: space.xs }}>
          <Section title="School" data={institutions} k="institution" />
          <Section title="Type of place" data={buildingTypes} k="accommodationType" />
          <Section title="Room" data={roomTypes} k="roomType" useLabel />
        </ScrollView>
      </Sheet>

      <Modal visible={showAuth} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAuth(false)}>
        <ClientLogIn
          onClose={() => {
            setShowAuth(false);
            if (auth.currentUser) router.push("/IntroductionScreen");
          }}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  top: { position: "absolute", left: space.md, right: space.sm, flexDirection: "row", alignItems: "center", justifyContent: "space-between", zIndex: 10 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: space.xs },
  filterBtn: { ...onVideo.button, borderWidth: 1, borderColor: "rgba(255,255,255,0.7)" },
  // White with a shadow so it shows on dark and on white frames alike.
  addBtn: { backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  badge: { position: "absolute", top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", paddingHorizontal: 4 },
  badgeText: { fontSize: 11, fontWeight: "800", color: "#1C1917" },
});

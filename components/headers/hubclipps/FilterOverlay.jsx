import React, { useContext, useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import ClientLogIn from "../../../app/(Client)/ClientLogIn";
import { auth } from "../../../lib/firebase/FirebaseConfig";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { institutions, roomTypes, buildingTypes } from "../../../assets/data/data";
import { UserContext } from "../../../context/UserContext";
import { Button, Chip, ChipGroup, CountBadge, IconButton, Sheet, Tabs } from "../../ui";
import { onVideo, space, type } from "../../../constants/theme";

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

  // Chip options for one filter. Rooms are matched by label, the rest by value.
  const options = (data, useLabel) => data.map((item) => ({ value: useLabel ? item.label : item.value, label: item.label }));

  return (
    <>
      <View style={[styles.top, { top: insets.top + space.xs }]} pointerEvents="box-none">
        <Tabs variant="pill"
          tone="dark"
          value={tab}
          onChange={setTab}
          options={[{ value: "all", label: "For you" }, ...(school ? [{ value: "near", label: `Near ${school}` }] : [])]}
        />
        <View style={{ flexDirection: "row", gap: space.xs }}>
          <IconButton
            icon="add"
            variant="floating"
            accessibilityLabel="Post a room as a clip"
            onPress={startPosting}
          />
          <View>
          <IconButton
            icon="options-outline"
            variant="onVideo"
            accessibilityLabel={activeCount ? `Filters, ${activeCount} on` : "Filters"}
            onPress={() => {
              setDraft(filters);
              onToggle();
            }}
            style={styles.filterBtn}
          />
          <CountBadge count={activeCount} tone="light" />
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
          <ChipGroup title="School" options={options(institutions)} value={draft?.institution} onToggle={(v) => toggle("institution", v)} />
          <ChipGroup title="Type of place" options={options(buildingTypes)} value={draft?.accommodationType} onToggle={(v) => toggle("accommodationType", v)} />
          <ChipGroup title="Room" options={options(roomTypes, true)} value={draft?.roomType} onToggle={(v) => toggle("roomType", v)} />
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
  filterBtn: { borderWidth: 1, borderColor: "rgba(255,255,255,0.7)" },
});

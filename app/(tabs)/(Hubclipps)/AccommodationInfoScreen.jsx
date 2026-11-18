import React, { useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AddHubclippsContext } from "../../../context/AddHubclippsContext";
import { ValidateHubclippsInfo } from "../../../utils/ValidationUtils/hubbclipsValidation";
import { institutions, roomTypes, amenitiesOptions, buildingTypes } from "../../../assets/data/data";
import { Button, Chip, PriceBar, SelectField, StepHeader, TextField } from "../../../components/ui";
import { money } from "../../../utils/formatMoney";
import { colors, space, type } from "../../../constants/theme";

const FEE_RATE = 0.05;
const AMENITIES_SHOWN = 8;

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

export default function AccommodationInfoScreen() {
  const router = useRouter();
  const { draft, setDraft } = useContext(AddHubclippsContext);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const set = (key, value) => setDraft({ ...draft, [key]: value });
  const toggleAmenity = (value) => {
    const current = draft.amenities || [];
    set("amenities", current.includes(value) ? current.filter((a) => a !== value) : [...current, value]);
  };

  const price = Number(String(draft.price || "").replace(/[^0-9.]/g, "")) || 0;
  const amenities = showAllAmenities ? amenitiesOptions : amenitiesOptions.slice(0, AMENITIES_SHOWN);

  const handleContinue = () => {
    const errors = ValidateHubclippsInfo(draft);
    if (errors.length > 0) {
      Alert.alert("A few details missing", errors[0]);
      return;
    }
    router.push("/ManagerInfoScreen");
  };

  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <StepHeader step={1} total={4} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={type.display} accessibilityRole="header">Tell us about the room</Text>

        <TextField
          label="Hostel or house name"
          value={draft.hostel_name}
          onChangeText={(v) => set("hostel_name", v)}
          placeholder="e.g. Nana Ama Hostel"
          autoCapitalize="words"
        />

        <View style={styles.group}>
          <Text style={styles.label}>Type of place</Text>
          <View style={styles.chips}>
            {buildingTypes.map((b) => (
              <Chip key={b.value} label={b.label} selected={draft.category === b.value} onPress={() => set("category", b.value)} />
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Room</Text>
          <View style={styles.chips}>
            {roomTypes.map((r) => (
              <Chip key={r.label} label={r.label} selected={draft.room_type === r.label} onPress={() => set("room_type", r.label)} />
            ))}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: space.sm }}>
          <View style={{ flex: 1 }}>
            <TextField
              label="Price per year (GH₵)"
              value={String(draft.price ?? "")}
              onChangeText={(v) => set("price", v.replace(/[^0-9]/g, ""))}
              keyboardType="number-pad"
              placeholder="0"
            />
          </View>
          <View style={{ flex: 1 }}>
            <SelectField
              label="School"
              sheetTitle="Which school is it near?"
              value={draft.institution}
              options={institutions.map((i) => i.label)}
              onChange={(v) => set("institution", v)}
            />
          </View>
        </View>
        {price ? (
          <Text style={[type.caption, { color: colors.textSecondary, marginTop: -space.sm }]}>
            Students see {money(price * (1 + FEE_RATE), { decimals: 0 })}: your price plus HostelHubb's 5% fee.
          </Text>
        ) : null}

        <TextField
          label="Area"
          value={draft.location}
          onChangeText={(v) => set("location", v)}
          placeholder="e.g. Ayeduase"
          autoCapitalize="words"
        />

        <View style={styles.group}>
          <Text style={styles.label}>What's included</Text>
          <View style={styles.chips}>
            {amenities.map((a) => (
              <Chip
                key={a.label}
                label={a.label}
                selected={(draft.amenities || []).includes(a.label)}
                onPress={() => toggleAmenity(a.label)}
              />
            ))}
            {amenitiesOptions.length > AMENITIES_SHOWN ? (
              <Chip
                label={showAllAmenities ? "Show fewer" : `+ ${amenitiesOptions.length - AMENITIES_SHOWN} more`}
                onPress={() => setShowAllAmenities((v) => !v)}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
      <PriceBar action={<Button title="Continue" onPress={handleContinue} />} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
  group: { gap: space.xs },
  label: { ...type.caption, fontWeight: "700", color: colors.text },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: space.xs },
});

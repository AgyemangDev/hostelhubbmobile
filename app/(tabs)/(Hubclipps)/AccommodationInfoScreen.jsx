import React, { useContext, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AddHubclippsContext } from "../../../context/AddHubclippsContext";
import { ValidateHubclippsInfo } from "../../../utils/ValidationUtils/hubbclipsValidation";

import FloatingLabelInput from "../../../components/InputFields/FormInput";
import CustomDropdown from "../../../components/Dropdowns/CustomDropdown";
import MultiSelectDropdown from "../../../components/Dropdowns/MultiSelectDropdown";
import Button from "../../../components/ButtonComponents/ButtonComponent";

import { institutions, roomTypes, amenitiesOptions, buildingTypes } from "../../../assets/data/data";

export default function AccofmmodationInfoScreen() {
  const router = useRouter();
  const { draft, setDraft } = useContext(AddHubclippsContext);

  // Dropdown visibility states
  const [institutionDropdown, setInstitutionDropdown] = useState(false);
  const [roomTypeDropdown, setRoomTypeDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [amenitiesDropdown, setAmenitiesDropdown] = useState(false);

  // Generic dropdown handler
  const handleSelect = (key, value) => {
    setDraft({ ...draft, [key]: value });
  };

  // Amenities multi-select toggle
  const toggleAmenity = (value) => {
    const current = draft.amenities || [];
    if (current.includes(value)) {
      setDraft({ ...draft, amenities: current.filter((a) => a !== value) });
    } else {
      setDraft({ ...draft, amenities: [...current, value] });
    }
  };

  // Continue button handler with validation
  const handleContinue = () => {
    const errors = ValidateHubclippsInfo(draft);
    if (errors.length > 0) {
      Alert.alert("Incomplete Form", errors[0]); // show only the first error
      return;
    }
    router.push("/ManagerInfoScreen");
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Tell us about the room you're offering. Accurate details help students find the right fit.
          </Text>
        </View>

        <View style={styles.formSection}>
          <FloatingLabelInput
            placeholder="Hostel Name"
            value={draft.hostel_name}
            onChangeText={(val) => setDraft({ ...draft, hostel_name: val })}
          />

          <CustomDropdown
            placeholder="Category"
            visible={categoryDropdown}
            onPress={() => setCategoryDropdown(!categoryDropdown)}
            data={buildingTypes.map((b) => b.value)}
            selectedValue={draft.category}
            onSelect={(val) => handleSelect("category", val)}
          />

          <CustomDropdown
            placeholder="Room Type"
            visible={roomTypeDropdown}
            onPress={() => setRoomTypeDropdown(!roomTypeDropdown)}
            data={roomTypes.map((r) => r.label)}
            selectedValue={draft.room_type}
            onSelect={(val) => handleSelect("room_type", val)}
          />

          <FloatingLabelInput
            placeholder="Price"
            value={draft.price}
            onChangeText={(val) => setDraft({ ...draft, price: val })}
            keyboardType="numeric"
          />

          <FloatingLabelInput
            placeholder="Location"
            value={draft.location}
            onChangeText={(val) => setDraft({ ...draft, location: val })}
          />

          <CustomDropdown
            placeholder="Institution"
            visible={institutionDropdown}
            onPress={() => setInstitutionDropdown(!institutionDropdown)}
            data={institutions.map((i) => i.label)}
            selectedValue={draft.institution}
            onSelect={(val) => handleSelect("institution", val)}
          />

          <MultiSelectDropdown
            placeholder="Amenities"
            visible={amenitiesDropdown}
            onPress={() => setAmenitiesDropdown(!amenitiesDropdown)}
            data={amenitiesOptions.map((a) => a.label)}
            selectedValues={draft.amenities || []}
            onToggle={toggleAmenity}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Continue Button */}
      <View style={styles.stickyButton}>
        <Button buttonText="Continue" onPressFunction={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  contentContainer: { padding: 24, paddingTop: 32 },
  header: { marginBottom: 32 },
  subtitle: { fontSize: 16, lineHeight: 24, color: "#717171" },
  formSection: { gap: 16 },
  stickyButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
});
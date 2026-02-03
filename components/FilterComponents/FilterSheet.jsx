import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import { AccommodationContext } from "../../context/AccommodationContext";
import ChipSelector from "./ChipSelector";
import PriceSlider from "./PriceSlider";
import CustomDropdown from "../Dropdowns/CustomDropdown";
import CloseButton from "../ButtonComponents/CloseButton";
import Button from "../ButtonComponents/ButtonComponent";
import { UserContext } from "../../context/UserContext";

import {
  institutions,
  roomTypes,
  amenitiesOptions,
  buildingTypes,
} from "../../assets/data/data";

const FilterSheet = ({ visible, onClose }) => {
  const { filters, setFilters, clearFilters } =
    useContext(AccommodationContext);

  const {patchUserData} = useContext(UserContext);

  const [schoolOpen, setSchoolOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const toggle = (key, value) => {
    const current = filters[key];
    setFilters({
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    });
  };

  return (
<Modal
  visible={visible}
  transparent
  animationType="fade"
  onRequestClose={onClose}
>
  <TouchableWithoutFeedback onPress={onClose}>
    <View style={styles.overlay}>
      {/* Sheet */}
      <TouchableWithoutFeedback>
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>Find Your Space</Text>
              <CloseButton onPress={onClose} />
            </View>

            {/* SCHOOL */}
            <CustomDropdown
              data={institutions.map((i) => i.label)}
              selectedValue={selectedSchool}
              placeholder="Select School"
              visible={schoolOpen}
              onPress={() => setSchoolOpen(!schoolOpen)}
 onSelect={async (label) => {
   setSelectedSchool(label);
   try {
     await patchUserData({ institution: label });
   } catch (err) {
     console.error("Failed to update school:", err);
   }
 }}
            />

            <PriceSlider />

            <Text style={styles.section}>Room Type</Text>
            <ChipSelector
              options={roomTypes}
              selected={filters.roomTypes}
              onToggle={(v) => toggle("roomTypes", v)}
            />

            <Text style={styles.section}>Accommodation Type</Text>
            <ChipSelector
              options={buildingTypes}
              selected={filters.buildingTypes}
              onToggle={(v) => toggle("buildingTypes", v)}
            />

            <Text style={styles.section}>Amenities</Text>
            <ChipSelector
              options={amenitiesOptions}
              selected={filters.amenities}
              onToggle={(v) => toggle("amenities", v)}
            />

            <Button
              buttonText="Clear selections"
              variant="inverted"
              onPressFunction={() => {
                clearFilters();
                onClose();
              }}
              customStyle={{ marginTop: 20 }}
            />

          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>
  );
};

export default FilterSheet;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  section: { marginTop: 16, fontWeight: "600" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },

  header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
},
title: {
  fontSize: 20,
  fontWeight: "700",
},
});
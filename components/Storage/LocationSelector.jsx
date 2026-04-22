"use client";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomDropdown from "../Dropdowns/CustomDropdown";
import COLORS from "../../constants/Colors";
import FloatingLabelInput from "../InputFields/FormInput";

const ON_CAMPUS = [
  "Gaza",
  "Republic Hall",
  "Katanga Hall",
  "Africa Hall",
  "Queens Hall",
  "Independence Hall",
  "SRC",
  "Unity Hall",
  "Hall 7",
  "Brunei",
];

const OFF_CAMPUS_AREAS = ["Ayeduase", "Kotei", "Bomso", "New Site"];

export default function LocationSelector({
  placeholder,
  value,
  onSelectLocation,
  selectedType = "pickup",
}) {
  const [mainDropdownVisible, setMainDropdownVisible] = useState(false);
  const [offCampusDropdownVisible, setOffCampusDropdownVisible] = useState(false);

  const [selectedArea, setSelectedArea] = useState(value?.area || null);
  const [selectedOffCampusArea, setSelectedOffCampusArea] = useState(value?.offCampusArea || null);
  const [hostelName, setHostelName] = useState(value?.hostel || "");

  // Update hostel name in real-time
  useEffect(() => {
    if (selectedArea === "Off Campus" && selectedOffCampusArea && hostelName) {
      onSelectLocation({
        area: selectedArea,
        offCampusArea: selectedOffCampusArea,
        hostel: hostelName,
      });
    }
  }, [hostelName]);

  // When main area selected
  const handleSelectArea = (area) => {
    setSelectedArea(area);
    setSelectedOffCampusArea(null);
    setHostelName("");

    if (area !== "Off Campus") {
      onSelectLocation({ area, offCampusArea: null, hostel: null });
    }
  };

  // When off-campus area selected
  const handleSelectOffCampusArea = (area) => {
    setSelectedOffCampusArea(area);
    onSelectLocation({ 
      area: selectedArea, 
      offCampusArea: area, 
      hostel: hostelName || null 
    });
  };

  // When hostel name changes
  const handleHostelChange = (text) => {
    setHostelName(text);
  };

  const mainDropdownData = [...ON_CAMPUS, "Off Campus"];

  return (
    <View style={styles.wrapper}>
      {/* Main area dropdown */}
      <CustomDropdown
        data={mainDropdownData}
        selectedValue={selectedArea}
        placeholder={placeholder}
        visible={mainDropdownVisible}
        onPress={() => setMainDropdownVisible(!mainDropdownVisible)}
        onSelect={handleSelectArea}
      />

      {/* If Off Campus selected, show off-campus area dropdown */}
      {selectedArea === "Off Campus" && (
        <>
          <CustomDropdown
            data={OFF_CAMPUS_AREAS}
            selectedValue={selectedOffCampusArea}
            placeholder="Select off-campus area"
            visible={offCampusDropdownVisible}
            onPress={() => setOffCampusDropdownVisible(!offCampusDropdownVisible)}
            onSelect={handleSelectOffCampusArea}
          />

          {/* Hostel name input */}
          {selectedOffCampusArea && (
            <FloatingLabelInput
              placeholder="Type your hostel name"
              value={hostelName}
              onChangeText={handleHostelChange}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
"use client";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomDropdown from "../Dropdowns/CustomDropdown";
import COLORS from "../../constants/Colors";
import FloatingLabelInput from "../InputFields/FormInput";

const ON_CAMPUS = [
  "Gaza",
  "Wilkado",
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
  const [room, setRoom] = useState(value?.room || "");

  // Keep local state in sync if the parent resets this field externally
  // (e.g. clearing delivery info when "decide later" is enabled).
  useEffect(() => {
    setSelectedArea(value?.area || null);
    setSelectedOffCampusArea(value?.offCampusArea || null);
    setHostelName(value?.hostel || "");
    setRoom(value?.room || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.area, value?.offCampusArea, value?.hostel, value?.room]);

  // Update hostel name in real-time
  useEffect(() => {
    if (selectedArea === "Off Campus" && selectedOffCampusArea && hostelName) {
      onSelectLocation({
        area: selectedArea,
        offCampusArea: selectedOffCampusArea,
        hostel: hostelName,
        room,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostelName]);

  // Update room number in real-time — applies whether on-campus or off-campus,
  // as long as an area has been chosen.
  useEffect(() => {
    if (!selectedArea) return;

    onSelectLocation({
      area: selectedArea,
      offCampusArea: selectedOffCampusArea,
      hostel: hostelName || null,
      room,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  // When main area selected
  const handleSelectArea = (area) => {
    setSelectedArea(area);
    setSelectedOffCampusArea(null);
    setHostelName("");

    if (area !== "Off Campus") {
      onSelectLocation({ area, offCampusArea: null, hostel: null, room });
    }
  };

  // When off-campus area selected
  const handleSelectOffCampusArea = (area) => {
    setSelectedOffCampusArea(area);
    onSelectLocation({
      area: selectedArea,
      offCampusArea: area,
      hostel: hostelName || null,
      room,
    });
  };

  // When hostel name changes
  const handleHostelChange = (text) => {
    setHostelName(text);
  };

  // off campus pickup allowed
  const mainDropdownData = [...ON_CAMPUS, "Off Campus"];

  // //off ccampus pickup not allowed
  // const mainDropdownData =
  //   selectedType === "pickup" ? ON_CAMPUS : [...ON_CAMPUS, "Off Campus"];


  // Room number applies once we know where — on-campus (hall picked) or
  // off-campus (hostel name entered). Grouped right under location so it
  // reads as one "where exactly" block instead of a separate section.
  const showRoomInput =
    selectedArea && selectedArea !== "Off Campus"
      ? true
      : selectedArea === "Off Campus" && selectedOffCampusArea && hostelName;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.fieldLabel}>
        {selectedType === "pickup" ? "Pickup location" : "Delivery location"}
      </Text>

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
        <View style={styles.nestedGroup}>
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
              placeholder="Hostel name"
              value={hostelName}
              onChangeText={handleHostelChange}
            />
          )}
        </View>
      )}

      {/* Room number — grouped with location, shows once area (and hostel,
          if off-campus) is known */}
      {showRoomInput && (
        <View style={styles.nestedGroup}>
          <FloatingLabelInput
            placeholder="Room number (e.g. B12)"
            value={room}
            onChangeText={setRoom}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: "600",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  nestedGroup: {
    gap: 12,
  },
});
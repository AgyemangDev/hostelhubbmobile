import React, { useState, useContext, useEffect, useMemo } from "react";
import {
  View, Text, Modal, ScrollView,
  Pressable, StyleSheet, TouchableWithoutFeedback, Switch
} from "react-native";
import { AccommodationContext } from "../../context/AccommodationContext";
import ChipSelector from "./ChipSelector";
import PriceSlider from "./PriceSlider";
import CustomDropdown from "../Dropdowns/CustomDropdown";
import CloseButton from "../ButtonComponents/CloseButton";
import Button from "../ButtonComponents/ButtonComponent";
import { roomTypes, amenitiesOptions, buildingTypes } from "../../assets/data/data";
import API_BASE_URL from "../../utils/api/api";

const FilterSheet = ({ visible, onClose }) => {
  const { filters, setFilters, clearFilters, rawAccommodations = [] } = useContext(AccommodationContext);

  const [schoolOpen, setSchoolOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const selectedSchool = schools.find(
    (school) => school.code === filters.institution || school.id === filters.schoolId
  );
  const locations = useMemo(() => {
    if (!selectedSchool) return [];
    return [...new Set(
      rawAccommodations
        .filter((item) =>
          String(item.school_id || "").toLowerCase() === String(selectedSchool.id).toLowerCase() ||
          String(item.institution || "").toLowerCase() === String(selectedSchool.code || "").toLowerCase() ||
          String(item.institution || "").toLowerCase() === String(selectedSchool.name || "").toLowerCase()
        )
        .map((item) => item.location)
        .filter(Boolean)
    )].sort();
  }, [rawAccommodations, selectedSchool]);

  useEffect(() => {
    if (!visible || schools.length) return;
    const loadSchools = async () => {
      setSchoolsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/storage-schools/public`);
        if (!response.ok) throw new Error("Unable to load schools");
        const data = await response.json();
        setSchools(data.schools || []);
      } catch (error) {
        console.error("Accommodation filter schools error:", error);
      } finally {
        setSchoolsLoading(false);
      }
    };
    loadSchools();
  }, [visible, schools.length]);
  const ruleOptions = [
    { value: "visitors_allowed", label: "Visitors allowed" },
    { value: "cooking_allowed", label: "Cooking allowed" },
    { value: "internet_available", label: "Internet" },
    { value: "water_available", label: "Water supply" },
    { value: "laundry_available", label: "Laundry" },
    { value: "caretaker_available", label: "Caretaker" },
    { value: "pets_not_allowed", label: "No pets" },
    { value: "smoking_not_allowed", label: "No smoking" },
    { value: "alcohol_not_allowed", label: "No alcohol" },
  ];

  const toggle = (key, value) => {
    const current = filters[key];
    setFilters({
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                  <Text style={styles.title}>Find Your Space</Text>
                  <CloseButton onPress={onClose} />
                </View>

                <Text style={styles.section}>Start with your school</Text>
                <Text style={styles.helper}>
                  Choose a school to see the areas where hostels are available.
                </Text>
                <CustomDropdown
                  data={schools.map((school) => `${school.code} · ${school.name}`)}
                  selectedValue={selectedSchool ? `${selectedSchool.code} · ${selectedSchool.name}` : null}
                  placeholder={schoolsLoading ? "Loading schools..." : "Select your school"}
                  visible={schoolOpen}
                  onPress={() => setSchoolOpen(!schoolOpen)}
                  onSelect={(label) => {
                    const match = schools.find((school) => `${school.code} · ${school.name}` === label);
                    if (match) setFilters({ institution: match.code, schoolId: match.id, locations: [] });
                  }}
                />

                {!selectedSchool ? (
                  <View style={styles.schoolPrompt}>
                    <Text style={styles.schoolPromptTitle}>Select a school to continue</Text>
                    <Text style={styles.schoolPromptText}>
                      We will show the available hostel areas for that school.
                    </Text>
                  </View>
                ) : (
                  <>
                <Text style={styles.selectedSchool}>Hostel areas for {selectedSchool.code}</Text>

                {locations.length > 0 && (
                  <>
                    <Text style={styles.section}>Choose an area</Text>
                    <ChipSelector
                      options={locations.map((value) => ({ value, label: value }))}
                      selected={filters.locations}
                      onToggle={(v) => toggle("locations", v)}
                    />
                  </>
                )}

                <PriceSlider />

                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.switchTitle}>Available rooms only</Text>
                    <Text style={styles.switchHint}>Hide hostels that are currently full</Text>
                  </View>
                  <Switch
                    value={filters.availableOnly}
                    onValueChange={(value) => setFilters({ availableOnly: value })}
                    trackColor={{ false: "#D9DDE3", true: "#BCA1A2" }}
                    thumbColor={filters.availableOnly ? "#610b0c" : "#fff"}
                  />
                </View>

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

                <Text style={styles.section}>Rules and facilities</Text>
                <ChipSelector
                  options={ruleOptions}
                  selected={filters.rules}
                  onToggle={(v) => toggle("rules", v)}
                />
                  </>
                )}

                <View style={styles.footerActions}>
                  <Button
                    buttonText="Clear all"
                    variant="inverted"
                    onPressFunction={() => {
                      clearFilters();
                    }}
                    customStyle={{ flex: 1 }}
                  />
                  <Button
                    buttonText="Show results"
                    onPressFunction={onClose}
                    customStyle={{ flex: 1 }}
                  />
                </View>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "700" },
  section: { marginTop: 16, fontWeight: "600" },
  helper: { color: "#777", fontSize: 13, lineHeight: 19, marginTop: 4, marginBottom: 12 },
  selectedSchool: { marginTop: 8, color: "#610b0c", fontSize: 13, fontWeight: "700" },
  schoolPrompt: { marginTop: 24, padding: 18, borderRadius: 16, backgroundColor: "#F8F5F4" },
  schoolPromptTitle: { fontSize: 15, fontWeight: "700", color: "#222" },
  schoolPromptText: { marginTop: 5, color: "#777", fontSize: 13, lineHeight: 19 },
  switchRow: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#F8F5F4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTitle: { fontSize: 14, fontWeight: "700", color: "#222" },
  switchHint: { marginTop: 3, color: "#777", fontSize: 12 },
  footerActions: { flexDirection: "row", gap: 10, marginTop: 22, marginBottom: 12 },
});
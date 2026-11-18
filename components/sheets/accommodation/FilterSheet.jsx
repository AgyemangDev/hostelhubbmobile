import React, { useState, useContext, useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AccommodationContext } from "../../../context/AccommodationContext";
import PriceSlider from "../../forms/accommodation/PriceSlider";
import { roomTypes, amenitiesOptions, buildingTypes } from "../../../assets/data/data";
import API_BASE_URL from "../../../utils/api/api";
import { Button, ChipGroup, Notice, SelectField, Sheet, ToggleRow } from "../../ui";
import { space } from "../../../constants/theme";

const FilterSheet = ({ visible, onClose }) => {
  const { filters, setFilters, clearFilters, rawAccommodations = [] } = useContext(AccommodationContext);

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
    <Sheet
      visible={visible}
      onClose={onClose}
      title="Find your space"
      footer={
        <View style={styles.footer}>
          <Button title="Clear all" variant="secondary" onPress={clearFilters} style={{ flex: 1 }} />
          <Button title="Show results" onPress={onClose} style={{ flex: 1 }} />
        </View>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <SelectField
          label="Start with your school"
          hint="Choose a school to see the areas where hostels are available."
          sheetTitle="Your school"
          options={schools.map((school) => `${school.code} · ${school.name}`)}
          value={selectedSchool ? `${selectedSchool.code} · ${selectedSchool.name}` : null}
          placeholder={schoolsLoading ? "Loading schools..." : "Select your school"}
          onChange={(label) => {
            const match = schools.find((school) => `${school.code} · ${school.name}` === label);
            if (match) setFilters({ institution: match.code, schoolId: match.id, locations: [] });
          }}
        />

        {!selectedSchool ? (
          <Notice title="Select a school to continue">We will show the available hostel areas for that school.</Notice>
        ) : (
          <>
            {locations.length > 0 ? (
              <ChipGroup
                multiple
                title={`Areas near ${selectedSchool.code}`}
                options={locations}
                value={filters.locations}
                onToggle={(v) => toggle("locations", v)}
              />
            ) : null}

            <PriceSlider />

            <ToggleRow
              label="Available rooms only"
              description="Hide hostels that are currently full"
              value={filters.availableOnly}
              onValueChange={(value) => setFilters({ availableOnly: value })}
            />

            <ChipGroup multiple title="Room type" options={roomTypes} value={filters.roomTypes} onToggle={(v) => toggle("roomTypes", v)} />
            <ChipGroup multiple title="Accommodation type" options={buildingTypes} value={filters.buildingTypes} onToggle={(v) => toggle("buildingTypes", v)} />
            <ChipGroup multiple title="Amenities" options={amenitiesOptions} value={filters.amenities} onToggle={(v) => toggle("amenities", v)} />
            <ChipGroup multiple title="Rules and facilities" options={ruleOptions} value={filters.rules} onToggle={(v) => toggle("rules", v)} />
          </>
        )}
      </ScrollView>
    </Sheet>
  );
};

export default FilterSheet;

const styles = StyleSheet.create({
  body: { gap: space.xl, paddingBottom: space.sm },
  footer: { flexDirection: "row", gap: space.sm },
});

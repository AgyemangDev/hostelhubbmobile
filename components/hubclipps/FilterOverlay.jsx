import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { institutions, roomTypes, buildingTypes } from "../../assets/data/data";

/**
 * FilterOverlay
 *
 * Props
 * ─────
 * visible         boolean
 * onClose         () => void
 * filters         current filter object from context  { institution, accommodationType, priceRange, roomType }
 * onApplyFilters  (filters) => void   — context.applyFilters, triggers API refetch
 * onClearFilters  () => void          — context.clearFilters,  resets + refetches
 * onToggle        () => void          — opens / closes the sheet
 *
 * Strategy
 * ────────
 * We keep a LOCAL copy of filters only while the sheet is open so the user
 * can tap chips without firing a fetch on every tap.  When they press
 * "Apply Filters" we push the local copy to the context (which fires the
 * fetch).  "Clear All" calls onClearFilters directly and also resets local
 * state.
 */
export default function FilterOverlay({
  visible,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
  onToggle,
}) {
  // Local draft — synced from props when the modal opens
  const [draft, setDraft] = useState(filters);

  // Keep draft in sync if the sheet is re-opened after an external change
  // (e.g. institution switched via EmptyFeedState)
  const handleOpen = () => setDraft(filters);

  const applyFilters = () => {
    onApplyFilters(draft);
    onClose();
  };

  const clearFilters = () => {
    onClearFilters();           // resets context + triggers fetch
    setDraft({                  // also reset local draft
      institution: null,
      accommodationType: null,
      priceRange: null,
      roomType: null,
    });
  };

  // ── Chip renderer ──────────────────────────────────────────────────────────
  const renderChips = (data, selectedKey, useLabel = false) => (
    <View style={styles.chipContainer}>
      {data.map((item) => {
        const filterValue = useLabel ? item.label : item.value;
        const isSelected  = draft[selectedKey] === filterValue;

        return (
          <TouchableOpacity
            key={filterValue}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() =>
              setDraft((prev) => ({
                ...prev,
                [selectedKey]: isSelected ? null : filterValue,
              }))
            }
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <>
      {/* Filter toggle button (always visible over the feed) */}
      <TouchableOpacity style={styles.filterButton} onPress={onToggle}>
        <Ionicons name="filter" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
        onShow={handleOpen}       // sync draft every time sheet opens
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Choose Your Space</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterList} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Institution</Text>
              {renderChips(institutions, "institution")}

              <Text style={styles.sectionTitle}>Accommodation Type</Text>
              {renderChips(buildingTypes, "accommodationType")}

              <Text style={styles.sectionTitle}>Room Type</Text>
              {renderChips(roomTypes, "roomType", true)}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 25,
    zIndex: 1000,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 22, fontWeight: "bold" },
  filterList: { paddingHorizontal: 20, paddingTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  chipSelected: { backgroundColor: "#ff385c" },
  chipText: { fontSize: 14, color: "#333" },
  chipTextSelected: { color: "white", fontWeight: "600" },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    marginTop: 10,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff385c",
    alignItems: "center",
    marginRight: 10,
  },
  clearText: { color: "#ff385c", fontWeight: "600" },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#ff385c",
    alignItems: "center",
    marginLeft: 10,
  },
  applyText: { color: "white", fontWeight: "600" },
});
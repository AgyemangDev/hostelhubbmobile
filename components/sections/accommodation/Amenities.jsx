import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatAmenities, renderAmenityIcon } from "../../../utils/amenityHelpers";
import { Button } from "../../ui";
import { colors } from "../../../constants/theme";

const INITIAL_COUNT = 6;

const Amenities = ({ amenities }) => {
  console.log(amenities)
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const amenityData = formatAmenities(amenities);
  const preview = amenityData.slice(0, INITIAL_COUNT);

  const renderItem = (item) => (
    <View key={item.key} style={styles.row}>
      {renderAmenityIcon(item.key)}
      <Text style={styles.text}>{item.label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What this place offers</Text>

      {preview.length ? preview.map(renderItem) : (
        <Text style={styles.emptyText}>The manager has not provided amenity information yet.</Text>
      )}

      {amenityData.length > INITIAL_COUNT ? (
        <Button title={`Show all ${amenityData.length} amenities`} variant="secondary" onPress={() => setVisible(true)} style={styles.button} />
      ) : null}

      <Modal visible={visible} animationType="slide">
        <View style={[styles.modal, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.modalTitle}>What this place offers</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {amenityData.map(renderItem)}
          </ScrollView>

          {/* sits above home indicator / nav bar */}
          <Button title="Close" variant="secondary" onPress={() => setVisible(false)} style={{ marginHorizontal: 16, marginBottom: insets.bottom + 12 }} />
        </View>
      </Modal>
    </View>
  );
};

export default Amenities;

const styles = StyleSheet.create({
  container: { marginVertical: 25 },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: colors.text,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  text: { marginLeft: 18, fontSize: 15, color: colors.text },
  emptyText: { fontSize: 14, color: colors.textSecondary, lineHeight: 21, paddingVertical: 8 },

  button: { marginTop: 18 },

  modal: {
    flex: 1,
    paddingHorizontal: 22,
    backgroundColor: colors.surface,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 25,
  },

  close: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center",
    paddingTop: 16,
  },

  closeText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
  },
});
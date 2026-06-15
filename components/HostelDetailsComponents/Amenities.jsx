import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatAmenities, renderAmenityIcon } from "../../utils/amenityHelpers";

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

      {preview.map(renderItem)}

      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>
          Show all {amenityData.length} amenities
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide">
        <View style={[styles.modal, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.modalTitle}>What this place offers</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {amenityData.map(renderItem)}
          </ScrollView>

          {/* sits above home indicator / nav bar */}
          <TouchableOpacity
            style={[styles.close, { paddingBottom: insets.bottom + 12 }]}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
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
    color: "#222",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
  },

  text: { marginLeft: 18, fontSize: 15, color: "#222" },

  button: {
    borderWidth: 1,
    borderColor: "#222",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 18,
    alignItems: "center",
  },

  buttonText: { fontWeight: "500", color: "#222" },

  modal: {
    flex: 1,
    paddingHorizontal: 22,
    backgroundColor: "#fff",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 25,
  },

  close: {
    borderTopWidth: 1,
    borderTopColor: "#EBEBEB",
    alignItems: "center",
    paddingTop: 16,
  },

  closeText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
});
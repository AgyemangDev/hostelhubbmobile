import React from "react";
import { View, Text, StyleSheet } from "react-native";

const OwnerInfoCard = ({ owner }) => {
  if (!owner) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Hosted by</Text>

      <View style={styles.row}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {owner.firstname?.[0]}
            {owner.surname?.[0]}
          </Text>
        </View>

        {/* Host Info */}
        <View style={styles.info}>
          <Text style={styles.name}>
            {owner.firstname} {owner.surname}
          </Text>
          <Text style={styles.email}>{owner.email}</Text>
        </View>
      </View>
    </View>
  );
};

export default OwnerInfoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
});

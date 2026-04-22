// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// function normalizeNetwork(netprovider) {
//   const n = (netprovider || "").toUpperCase();
//   if (n.includes("MTN"))     return "mtn";
//   if (n.includes("TELECEL")) return "telecel";
//   if (n.includes("AT PREMIUM") || n === "AT" || n === "AIRTELTIGO") return "at";
//   return "default";
// }

// const NETWORK_STYLES = {
//   mtn:     { bg: "#FACC15", border: "#FBBF24", textColor: "#111", label: "MTN"     },
//   telecel: { bg: "#EF4444", border: "#F87150", textColor: "#fff", label: "Telecel" },
//   at:      { bg: "#3B82F6", border: "#2563EB", textColor: "#fff", label: "AT"      },
//   default: { bg: "#E5E7EB", border: "#D1D5DB", textColor: "#111", label: "--"      },
// };

// const PackageCard = ({ data_volume, price, validity, netprovider, onPress }) => {
//   const key   = normalizeNetwork(netprovider);
//   const theme = NETWORK_STYLES[key];
//   const validityLabel = validity || "No Expiry";

//   return (
//     <TouchableOpacity
//       style={[styles.card, { backgroundColor: theme.bg, borderColor: theme.border }]}
//       onPress={onPress}
//       activeOpacity={0.8}
//     >
//       <View style={styles.header}>
//         <Text style={[styles.headerTitle, { color: theme.textColor }]}>Data Bundle</Text>
//         <View style={styles.headerRight}>
//           <View style={styles.networkBadge}>
//             <Text style={styles.networkBadgeText}>{theme.label}</Text>
//           </View>
//           <View style={styles.label}>
//             <Text style={styles.labelText}>{validityLabel}</Text>
//           </View>
//         </View>
//       </View>
//       <View style={styles.body}>
//         <View style={styles.bodyRow}>
//           <View style={styles.bodyItem}>
//             <Text style={styles.bodyLabel}>Data</Text>
//             <Text style={styles.bodyValue}>{data_volume} GB</Text>
//           </View>
//           <View style={styles.bodyItem}>
//             <Text style={styles.bodyLabel}>Cost</Text>
//             <Text style={styles.bodyValue}>GHS {price}</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default PackageCard;

// const styles = StyleSheet.create({
//   card: { borderRadius: 20, borderWidth: 1, marginBottom: 5, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
//   header: { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
//   headerTitle: { fontSize: 16, fontWeight: "500" },
//   headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
//   networkBadge: { backgroundColor: "rgba(0,0,0,0.15)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
//   networkBadgeText: { fontSize: 10, fontWeight: "700", color: "#fff", textTransform: "uppercase" },
//   label: { backgroundColor: "rgba(255,255,255,0.85)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
//   labelText: { fontSize: 10, fontWeight: "500", textTransform: "uppercase", color: "#111" },
//   body: { backgroundColor: "rgba(255,255,255,0.85)", paddingHorizontal: 16, paddingVertical: 10 },
//   bodyRow: { flexDirection: "row", justifyContent: "space-between" },
//   bodyItem: {},
//   bodyLabel: { fontSize: 10, fontWeight: "500", color: "#6B7280", marginBottom: 2 },
//   bodyValue: { fontSize: 16, fontWeight: "500", color: "#111" },
// });

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ExternalLink } from "@/components/ExternalLink";

function normalizeNetwork(netprovider) {
  const n = (netprovider || "").toUpperCase();
  if (n.includes("MTN"))     return "mtn";
  if (n.includes("TELECEL")) return "telecel";
  if (n.includes("AT PREMIUM") || n === "AT" || n === "AIRTELTIGO") return "at";
  return "default";
}

const NETWORK_STYLES = {
  mtn:     { bg: "#FACC15", border: "#FBBF24", textColor: "#111", label: "MTN"     },
  telecel: { bg: "#EF4444", border: "#F87150", textColor: "#fff", label: "Telecel" },
  at:      { bg: "#3B82F6", border: "#2563EB", textColor: "#fff", label: "AT"      },
  default: { bg: "#E5E7EB", border: "#D1D5DB", textColor: "#111", label: "--"      },
};

const SIGNUP_URL = "https://affordabledatagh.com/signup/customer?ref=HOSTov4n8h41";

const PackageCard = ({ data_volume, price, validity, netprovider, onPress }) => {
  const key   = normalizeNetwork(netprovider);
  const theme = NETWORK_STYLES[key];
  const validityLabel = validity || "No Expiry";

  const CardContent = (
    <View style={[styles.card, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Data Bundle</Text>
        <View style={styles.headerRight}>
          <View style={styles.networkBadge}>
            <Text style={styles.networkBadgeText}>{theme.label}</Text>
          </View>
          <View style={styles.label}>
            <Text style={styles.labelText}>{validityLabel}</Text>
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyRow}>
          <View style={styles.bodyItem}>
            <Text style={styles.bodyLabel}>Data</Text>
            <Text style={styles.bodyValue}>{data_volume} GB</Text>
          </View>
          <View style={styles.bodyItem}>
            <Text style={styles.bodyLabel}>Cost</Text>
            <Text style={styles.bodyValue}>GHS {price}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ExternalLink href={SIGNUP_URL} asChild>
      <TouchableOpacity
        // onPress={onPress}
        activeOpacity={0.8}
      >
        {CardContent}
      </TouchableOpacity>
    </ExternalLink>
  );
};

export default PackageCard;

const styles = StyleSheet.create({
  card: { borderRadius: 20, borderWidth: 1, marginBottom: 5, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  header: { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
  headerTitle: { fontSize: 16, fontWeight: "500" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  networkBadge: { backgroundColor: "rgba(0,0,0,0.15)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  networkBadgeText: { fontSize: 10, fontWeight: "700", color: "#fff", textTransform: "uppercase" },
  label: { backgroundColor: "rgba(255,255,255,0.85)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  labelText: { fontSize: 10, fontWeight: "500", textTransform: "uppercase", color: "#111" },
  body: { backgroundColor: "rgba(255,255,255,0.85)", paddingHorizontal: 16, paddingVertical: 10 },
  bodyRow: { flexDirection: "row", justifyContent: "space-between" },
  bodyItem: {},
  bodyLabel: { fontSize: 10, fontWeight: "500", color: "#6B7280", marginBottom: 2 },
  bodyValue: { fontSize: 16, fontWeight: "500", color: "#111" },
});
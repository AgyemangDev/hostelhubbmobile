import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView, StyleSheet, View, Text,
  TouchableOpacity, ActivityIndicator,
} from "react-native";
import EmptyState from "../../../../components/BookingsComponent/EmptyState";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import PackageCard from "../../../../components/Cards/PackageCard";
import DataPurchasingModal from "../../../../components/modals/DataPurchasingModal";
import API_BASE_URL from "../../../../utils/api/api";

// All networks available — driven by your backend
const NETWORKS = [
  { key: "MTN",       label: "Yello",     color: "#FACC15", textColor: "#111" },
  { key: "TELECEL",   label: "Telecel", color: "#EF4444", textColor: "#fff" },
  { key: "AT PREMIUM",label: "AT",      color: "#3B82F6", textColor: "#fff" },
]

const CampusData = () => {
  const insets  = useSafeAreaInsets()
  const router  = useRouter()

  const [activeNetwork, setActiveNetwork] = useState("MTN")
  const [packages,      setPackages]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [isModalVisible, setModalVisible] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)

  const fetchBundles = useCallback(async (network) => {
    setLoading(true)
    setPackages([])
    try {
      const res  = await fetch(`${API_BASE_URL}/api/display-prices/${network}`)
      const data = await res.json()

      if (!data.success) return

      // data.bundles = { "1": 5.70, "10": 43.50, ... }
      // We also need validity — fetch the full package list for this network
      const pkgRes  = await fetch(`${API_BASE_URL}/api/display-prices/${network}/details`)
      const pkgData = await pkgRes.json().catch(() => null)

      // Build formatted packages — merge price with validity if details endpoint exists
      const formatted = Object.entries(data.bundles || {}).map(([volume, price]) => {
        const detail = pkgData?.packages?.find(
          p => String(parseFloat(p.data_size)) === String(volume)
        )
        return {
          data_volume: volume,
          price,
          validity:    detail?.validity ?? null,
          netprovider: network,
        }
      })

      // Sort ascending by GB
      formatted.sort((a, b) => parseFloat(a.data_volume) - parseFloat(b.data_volume))
      setPackages(formatted)
    } catch (err) {
      console.error("Failed to fetch bundles:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBundles(activeNetwork) }, [activeNetwork])

  const handleCardPress = (pkg) => {
    setSelectedPackage(pkg)
    setModalVisible(true)
  }

  const activeNet = NETWORKS.find(n => n.key === activeNetwork)

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Bundles</Text>
        <TouchableOpacity
          style={styles.ordersBtn}
          onPress={() => router.push("(shop)/NetworkServices/DataOrders")}
        >
          <Text style={styles.ordersText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      {/* NETWORK TABS */}
      <View style={styles.tabsContainer}>
        {NETWORKS.map(net => {
          const active = activeNetwork === net.key
          return (
            <TouchableOpacity
              key={net.key}
              style={[
                styles.tab,
                active
                  ? { backgroundColor: net.color, borderColor: net.color }
                  : styles.tabInactive,
              ]}
              onPress={() => setActiveNetwork(net.key)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.tabText,
                { color: active ? net.textColor : "#6B7280" },
              ]}>
                {net.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {packages.length > 0 && (
        <Text style={styles.disclaimer}>
          ⚡️Fastest Delivery. Settle airtime debts before purchasing
        </Text>
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#111" />
          <Text style={{ marginTop: 10, color: "#555" }}>Loading bundles...</Text>
        </View>
      ) : packages.length === 0 ? (
        <EmptyState message="No bundles available at the moment." />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {packages.map(pkg => (
            <View key={`${pkg.netprovider}-${pkg.data_volume}`} style={styles.cardWrapper}>
              <PackageCard
                data_volume={pkg.data_volume}
                price={pkg.price}
                validity={pkg.validity}
                netprovider={pkg.netprovider}
                onPress={() => handleCardPress(pkg)}
              />
            </View>
          ))}
        </ScrollView>
      )}

      <DataPurchasingModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        selectedPackage={selectedPackage}
      />
    </View>
  )
}

export default CampusData

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 16, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: "#e0e0e0",
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#111" },
  ordersBtn:   { backgroundColor: "#111", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  ordersText:  { color: "#fff", fontWeight: "700", fontSize: 13 },

  // Tabs
  tabsContainer: {
    flexDirection: "row", gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1, paddingVertical: 9, borderRadius: 10,
    borderWidth: 1.5, alignItems: "center",
  },
  tabInactive: {
    backgroundColor: "#F9FAFB", borderColor: "#E5E7EB",
  },
  tabText:  { fontSize: 13, fontWeight: "700" },

  disclaimer: { marginVertical: 10, fontSize: 12, color: "#770505ff", textAlign: "center" },
  scrollView: { flex: 1 },
  content:    { padding: 16 },
  cardWrapper:{ marginBottom: 12 },
  centered:   { flex: 1, justifyContent: "center", alignItems: "center" },
})
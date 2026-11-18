import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import PackageCard from "../../../../components/cards/shop/PackageCard";
import DataPurchasingModal from "../../../../components/sheets/shop/DataPurchaseModal";
import API_BASE_URL from "../../../../utils/api/api";
import { Button, EmptyState, Tabs } from "../../../../components/ui";
import { colors } from "../../../../constants/theme";

// All networks available — driven by your backend
const NETWORKS = [
  { key: "MTN",       label: "Yello",     color: "#FACC15", textColor: colors.text },
  { key: "TELECEL",   label: "Telecel", color: colors.danger, textColor: colors.textInverse },
  { key: "AT PREMIUM",label: "AT",      color: colors.brand, textColor: colors.textInverse },
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
        <Button title="My Orders" variant="secondary" size="sm" compact onPress={() => router.push("(shop)/NetworkServices/DataOrders")} />
      </View>

      {/* NETWORK TABS */}
      <Tabs
        variant="pill"
        stretch
        options={NETWORKS.map((n) => ({ value: n.key, label: n.label }))}
        value={activeNetwork}
        onChange={setActiveNetwork}
        style={styles.tabsContainer}
      />

      {packages.length > 0 && (
        <Text style={styles.disclaimer}>
          ⚡️Fastest Delivery. Settle airtime debts before purchasing
        </Text>
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.text} />
          <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading bundles...</Text>
        </View>
      ) : packages.length === 0 ? (
        <EmptyState illustration="empty" title="No bundles available at the moment." />
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
  container:   { flex: 1, backgroundColor: colors.surface },
  header: {
    backgroundColor: colors.surface,
    paddingVertical: 16, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: colors.text },
  ordersBtn:   { backgroundColor: colors.text, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  ordersText:  { color: colors.textInverse, fontWeight: "700", fontSize: 13 },

  // Tabs
  tabsContainer: {
    flexDirection: "row", gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tab: {
    flex: 1, paddingVertical: 9, borderRadius: 10,
    borderWidth: 1.5, alignItems: "center",
  },
  tabInactive: {
    backgroundColor: colors.surfaceSunken, borderColor: colors.border,
  },
  tabText:  { fontSize: 13, fontWeight: "700" },

  disclaimer: { marginVertical: 10, fontSize: 12, color: colors.brand, textAlign: "center" },
  scrollView: { flex: 1 },
  content:    { padding: 16 },
  cardWrapper:{ marginBottom: 12 },
  centered:   { flex: 1, justifyContent: "center", alignItems: "center" },
})
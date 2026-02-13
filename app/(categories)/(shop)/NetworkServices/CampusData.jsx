import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import PackageCard from "../../../../components/Cards/PackageCard";
import DataPurchasingModal from "../../../../components/modals/DataPurchasingModal";
import API_BASE_URL from "../../../../utils/api/api";

const CampusData = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { network } = useLocalSearchParams();

  const [packages, setPackages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

useEffect(() => {
  if (!network) return;

  const fetchBundles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/display-prices/${network}`);
      const data = await response.json();

      if (!data.success) {
        router.back();
        return;
      }

      const formattedPackages = Object.entries(data.bundles).map(([volume, price]) => ({
        data_volume: volume,
        price,
        netprovider: network.toUpperCase(),
      }));

      setPackages(formattedPackages);
    } catch (err) {
      console.error("Failed to fetch bundles:", err);
      router.back();
    }
  };

  fetchBundles();
}, [network]);

  const handleCardPress = (pkg) => {
    setSelectedPackage(pkg);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}> Student Bundles </Text>

        <TouchableOpacity
          style={styles.ordersBtn}
          onPress={() => router.push("(shop)/NetworkServices/DataOrders")}
        >
          <Text style={styles.ordersText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        ⚠️ Delivery is not instant. It may take some time.
      </Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {packages.map((pkg) => (
          <View
            key={`${pkg.netprovider}-${pkg.data_volume}`}
            style={styles.cardWrapper}
          >
            <PackageCard
              data_volume={pkg.data_volume}
              price={pkg.price}
              netprovider={pkg.netprovider}
              onPress={() => handleCardPress(pkg)}
            />
          </View>
        ))}
      </ScrollView>

      <DataPurchasingModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        selectedPackage={selectedPackage}
      />
    </View>
  );
};

export default CampusData;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#111" },
  ordersBtn: {
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ordersText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  disclaimer: {
    marginVertical: 10,
    fontSize: 12,
    color: "#770505ff",
    textAlign: "center",
  },
  scrollView: { flex: 1 },
  content: { padding: 16 },
  cardWrapper: { marginBottom: 12 },
});
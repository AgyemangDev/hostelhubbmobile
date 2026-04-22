import { StyleSheet, Text, View, ActivityIndicator, FlatList, SafeAreaView, StatusBar } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../context/UserContext';
import DataOrderCard from '../../../../components/Cards/DataOrderCard';
import API_BASE_URL from '../../../../utils/api/api';

const DataOrders = () => {
  const { user, isLoading } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await fetch(
        `${API_BASE_URL}/api/data-orders/${user.uid}`
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to load orders");
      setOrders(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user?.uid) fetchOrders();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getBundleDisplay = (bundle) => `${bundle}GB Bundle`;

  if (isLoading || loadingOrders) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.infoText}>Loading orders...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </SafeAreaView>
    );
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>No orders yet</Text>
        <Text style={styles.infoText}>Your data bundle orders will appear here</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Orders</Text>
        <Text style={styles.headerSubtitle}>{orders.length} orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
renderItem={({ item }) => (
  <DataOrderCard
    bundle={item.bundle}
    orderStatus={item.orderStatus}  
    customer_phone={item.customer_phone}
  />
)}
      />
    </SafeAreaView>
  );
};

export default DataOrders;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  listContent: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bundleText: { fontWeight: '700', fontSize: 16, color: '#111827' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  delivered: { backgroundColor: '#D1FAE5' },
  processing: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 12, fontWeight: '600' },
  deliveredText: { color: '#10B981' },
  processingText: { color: '#F59E0B' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 6 },
  cardDetails: { },
  detailRow: { fontSize: 13, color: '#111827', marginBottom: 4 },
  label: { fontWeight: '600', color: '#6B7280' },
  infoText: { fontSize: 15, color: '#6B7280', marginTop: 8 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center' },
});

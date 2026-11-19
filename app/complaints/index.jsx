import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Button, EmptyState, Notice, ScreenHeader, Skeleton } from "../../components/ui";
import ComplaintListItem from "../../components/lists/complaints/ComplaintListItem";
import studentHub from "../../services/studentHub";
import { colors, space } from "../../constants/theme";

/** The student's complaints to their hostels, newest activity first. */
export default function Complaints() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await studentHub.complaints();
      setData(res.complaints);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="Problems reported" onBack={() => router.back()} />
      {data === null && !error ? (
        <View style={styles.list}>{[0, 1, 2].map((i) => <Skeleton key={i} height={84} radius={16} />)}</View>
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => <ComplaintListItem complaint={item} onPress={() => router.push(`/complaints/${item.id}`)} />}
          ItemSeparatorComponent={() => <View style={{ height: space.sm }} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.brand} />}
          ListHeaderComponent={<Notice tone="info">To report a new problem, open your paid booking and tap "Report a problem".</Notice>}
          ListEmptyComponent={error ? (
            <EmptyState illustration="error" title="Couldn't load your complaints" body={error} action={<Button title="Try again" onPress={load} />} />
          ) : (
            <EmptyState icon="construct-outline" title="No problems reported" body="If something breaks at your hostel, report it from your booking. The hostel is notified straight away." action={<Button title="Go to my bookings" variant="secondary" onPress={() => router.push("/(tabs)/(bookings)")} />} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceSunken },
  list: { padding: space.md, gap: space.sm, paddingBottom: space.xxl },
});

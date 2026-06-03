import React, { useContext, useCallback, useState } from "react";
import { View, SafeAreaView } from "react-native";
import { useFocusEffect } from "expo-router";
import ReusableTabs from "../../../components/Tabs/ReusableTabs";
import AllBookings from "./AllBookings";
import PaidBookings from "./PaidBookings";
import { UserContext } from "../../../context/UserContext";
import { useBookingsContext } from "../../../context/BookingsContext";
import NoAccountPrompt from "../../../components/Authentication/NoAccountPrompt";

const Index = ({ navigation }) => {
  const { userInfo } = useContext(UserContext);
  const { refetch } = useBookingsContext();
  const [refreshing, setRefreshing] = useState(false);

  // Silent background refresh on focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (!userInfo) {
    return (
      <View style={{ flex: 1 }}>
        <NoAccountPrompt message="Sign in to view your bookings" />
      </View>
    );
  }

  const tabs = [
    {
      id: "all",
      label: "All Bookings",
      content: <AllBookings navigation={navigation} refreshing={refreshing} onRefresh={onRefresh} />,
    },
    {
      id: "paid",
      label: "Paid Bookings",
      content: <PaidBookings navigation={navigation} refreshing={refreshing} onRefresh={onRefresh} />,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ReusableTabs tabs={tabs} initialTab="all" />
    </View>
  );
};

export default Index;
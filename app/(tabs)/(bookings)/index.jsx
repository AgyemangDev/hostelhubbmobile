import React from "react";
import { View } from "react-native";
import ReusableTabs from "../../../components/Tabs/ReusableTabs";
import AllBookings from "./AllBookings"; 
import PaidBookings from "./PaidBookings"; 

const Index = ({ navigation }) => {
  const tabs = [
    {
      id: "all",
      label: "All Bookings",
      content: <AllBookings navigation={navigation} />,
    },
    {
      id: "paid",
      label: "Paid Bookings",
      content: <PaidBookings navigation={navigation} />,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ReusableTabs tabs={tabs} initialTab="all" />
    </View>
  );
};

export default Index;
import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext";
import { useHostels } from "../../context/HostelsContext";
import SkeletonCards from "../SkeletonCard";
import Header from "./Header";
import EmptyState from "./EmptyState";
import HostelList from "./HostelList";

const ShortListCardList = () => {
  const router = useRouter();
  const { shortlist, isLoading: userLoading } = useContext(UserContext);
  const { hostels, loading: hostelsLoading } = useHostels();

  const filteredHostels = hostels.filter((hostel) =>
    shortlist?.some((item) => item.hostelId === hostel.id)
  );

  if (userLoading || hostelsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonCards />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header count={filteredHostels.length} />
      {filteredHostels.length > 0 ? (
        <HostelList data={filteredHostels} navigation={router} />
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

export default ShortListCardList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

import React, { useContext } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import ShortListCardList from "../components/ShortlistComponents/ShortListCardList";
import { UserContext } from "../context/UserContext";
import NoAccountPrompt from "../components/Authentication/NoAccountPrompt";

const Shortlist = () => {
  const { userInfo } = useContext(UserContext);

  if (!userInfo) {
    return (
      <View style={{ flex: 1 }}>
        <NoAccountPrompt message="Sign in to view your shortlist" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ShortListCardList />
    </View>
  );
};

export default Shortlist;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
});
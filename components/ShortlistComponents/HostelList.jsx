import React from "react";
import { FlatList, StyleSheet } from "react-native";
import Cads from "../Cards/VerticalScroll/Cads"

const HostelList = ({ data, navigation }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => (
<Cads
  id={item.id}  // this is important for all tracking
  accommodation_name={item.accommodation_name}
  institution={item.institution}
  ImageUrl={item.front_image}
  location={item.location}
  views={item.views}
  availability={item.accommodation_availability}
  isLastItem={index === data.length - 1}
  onCardPress={() =>
    navigation.push({
      pathname: "/(Details)/[id]",
      params: { hostelId: item.id }
    })
  }
  transactionScreen={() => navigation.navigate("(ProfileScreens)")}
 />
      )}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default HostelList;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

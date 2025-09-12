import React from "react";
import { FlatList, StyleSheet } from "react-native";
import Cads from "../Cards/VerticalScroll/Cads"

const HostelList = ({ data, navigation }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => (
        <Cads
          hostelId={item.id}
          hostelName={item.hostelName}
          institution={item.institution}
          ImageUrl={{ uri: item?.frontImage }}
          location={item.location}
          views={item.views}
          availability={item.hostelAvailability}
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

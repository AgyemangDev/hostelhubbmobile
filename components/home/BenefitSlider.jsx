import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { benefits } from "../../assets/data/SlideData";
import BenefitCard from "./BenefitCard";

const BenefitSlider = ({ title = "Why HostelHubb?" }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={benefits}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <BenefitCard
            icon={item.icon}
            title={item.title}
            description={item.description}
            index={index}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 8, 
  },
});

export default BenefitSlider;

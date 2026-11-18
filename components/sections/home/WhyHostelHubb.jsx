import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "../../ui";
import BenefitCard from "../../cards/home/BenefitCard";
import { WHY_HOSTELHUBB } from "../../../constants/whyHostelHubb";
import { colors } from "../../../constants/theme";

/** "Why HostelHubb?" at the bottom of Home: a horizontal slider of benefit cards. Copy lives in constants/whyHostelHubb.js. */
export default function WhyHostelHubb() {
  const { title, benefits } = WHY_HOSTELHUBB;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={benefits}
        keyExtractor={(b) => b.title}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        renderItem={({ item, index }) => <BenefitCard icon={item.icon} title={item.title} body={item.body} index={index} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24, marginTop: 16 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: "bold", color: colors.text, marginBottom: 5, paddingHorizontal: 16 },
  row: { paddingHorizontal: 8 },
});

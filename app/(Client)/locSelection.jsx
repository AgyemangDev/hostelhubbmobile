import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { institutions } from "../../assets/data/data";
import COLORS from "../../constants/Colors";
import Button from "../../components/ButtonComponents/ButtonComponent";

const UniversitySelection = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 👇 data coming from previous screen
  const { email, password } = route.params;

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredInstitutions = institutions.filter(
    (institution) => institution.value !== "all"
  );

  const handleSubmit = () => {
    if (!selectedUniversity) {
      setErrorMessage("Please select a university to continue.");
      return;
    }

    navigation.navigate("PersonalInfo", {
      email,
      password,
      selectedUniversity: selectedUniversity,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>University Selection</Text>
      <Text style={styles.instruction}>
        Please select your institution to proceed.
      </Text>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <FlatList
        data={filteredInstitutions}
        keyExtractor={(item) => item.value}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const isSelected = selectedUniversity === item.value;

          return (
            <TouchableOpacity
              style={[
                styles.universityCard,
                isSelected && styles.selectedCard,
              ]}
              onPress={() => {
                setErrorMessage("");
                setSelectedUniversity(item.value);
              }}
            >
              <Image source={item.logo} style={styles.universityLogo} />
              <Text
                style={[
                  styles.universityName,
                  isSelected && styles.selectedText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <Button
        buttonText="Continue"
        onPressFunction={handleSubmit}
        customStyle={{ marginTop: 20 }}
      />
    </View>
  );
};

export default UniversitySelection;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.background,
    marginBottom: 8,
  },

  instruction: {
    fontSize: 14,
    textAlign: "center",
    color: COLORS.textMuted,
    marginBottom: 12,
    lineHeight: 20,
  },

  errorText: {
    fontSize: 14,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 10,
  },

  row: {
    justifyContent: "space-between",
  },

  universityCard: {
    flex: 1,
    margin: 8,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  selectedCard: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.background,
  },

  universityLogo: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    marginBottom: 10,
  },

  universityName: {
    fontSize: 14,
    textAlign: "center",
    color: COLORS.textDark,
    fontWeight: "500",
  },

  selectedText: {
    color: COLORS.white,
  },
});

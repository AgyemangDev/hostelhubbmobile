import React, { useState } from "react";
import {View,Text,StyleSheet,TouchableOpacity,FlatList,Image,} from "react-native";
import { institutions } from "../../assets/data/data";
import COLORS from "../../constants/Colors";
import { useNavigation } from "expo-router";
import { UserContext } from "../../context/UserContext";
import { auth,db } from "../firebase/FirebaseConfig";

const UniversitySelection = () => {
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const filteredInstitutions = institutions.filter(
    (institution) => institution.value !== "all"
  );

  const toggleSelection = (universityValue) => {
    setErrorMessage(""); 

    setSelectedUniversities((prev) => {
      if (prev.includes(universityValue)) {
        return prev.filter((value) => value !== universityValue); // Deselect
      } else if (prev.length < 1) {
        return [...prev, universityValue]; // Select if under max limit
      } else {
        setErrorMessage("You can only select 1 institution.");
        return prev;
      }
    });
  };

  // Handle submission
  const handleSubmit = () => {
    if (selectedUniversities.length < 1) {
      setErrorMessage("You must select at most 1 university.");
    } else {
      navigation.navigate("PersonalInfo", { selectedUniversities });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>University Selection</Text>
      <Text style={styles.instruction}>
        Please select your institution to proceed. Note you would get majority of your hostel listings based on your selection.
      </Text>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <FlatList
        data={filteredInstitutions} // Use filtered institutions array
        keyExtractor={(item) => item.value}
        showsVerticalScrollIndicator={false}
        numColumns={2} 
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.universityCard,
              selectedUniversities.includes(item.value) && styles.selectedCard,
            ]}
            onPress={() => toggleSelection(item.value)}
          >
            <Image source={item.logo} style={styles.universityLogo} />
            <Text
              style={[
                styles.universityName,
                selectedUniversities.includes(item.value) &&
                  styles.selectedText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop:70
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#610b0c",
  },
  instruction: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
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
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCard: {
    backgroundColor: COLORS.background,
    borderColor: "#610b0c",
  },
  universityLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 10,
  },
  universityName: {
    fontSize: 14,
    textAlign: "center",
    color: "#000",
  },
  selectedText: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#9a0b0d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UniversitySelection;

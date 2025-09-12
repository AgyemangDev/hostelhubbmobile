import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Linking, Alert } from "react-native";
import COLORS from "../../../constants/Colors";
import { ExternalLink } from "@/components/ExternalLink";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../../../assets/Styles/ReportAConcernStyles";

const ReportAConcern = () => {
  const [concern, setConcern] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleInputChange = (text) => {
    setConcern(text);

    // Update the button state based on the word count
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length; // Filter to count only non-empty words
    setIsButtonEnabled(wordCount >= 5); // Enable button if 5 or more words are present
  };

  const handleSubmit = () => {
    if (!concern.trim()) {
      Alert.alert("Error", "Please provide details for your concern.");
      return;
    }

    const subject = encodeURIComponent("Concern Report for HostelHubb");
    const body = encodeURIComponent(
      `Hello HostelHubb Team,\n\nI would like to report the following concern:\n\n${concern}\n\nBest regards,`
    );
    const email = `mailto:hostelhubbofficial@gmail.com?subject=${subject}&body=${body}`;

    Linking.openURL(email)
      .then(() => {
        Alert.alert(
          "Thank you!",
          "We would reach out to you if email was sent successfully. For immediate and urgent response, kindly connect with our customer care"
        );
        setConcern("");
        setIsButtonEnabled(false);
      })
      .catch((error) => {
        console.error("Error opening email client:", error);
        Alert.alert("Error", "Unable to open email client. Please try again.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report A Concern</Text>
      <Text style={styles.instruction}>
        Please provide detailed information about the concern or problem you are
        facing with using this application. We promise to reach out to you within the shortest possible
        time. If concern is personal to your hostel, visit your booked hostel and report to manager.
      </Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Describe your concern here..."
        placeholderTextColor={COLORS.backgroundColor}
        value={concern}
        onChangeText={handleInputChange}
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isButtonEnabled ? "#A52A2A" : "#E0B2B2" }, // Brown color when active, light brown when disabled
        ]}
        onPress={handleSubmit}
        disabled={!isButtonEnabled}
      >
        <Text style={styles.buttonText}>Send a Report</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <Text style={styles.infoText}>
          Not getting responses from our developers? Our customer service and AI are on standby 24/7. Reach out to us anytime!
        </Text>
        <ExternalLink href="https://tawk.to/chat/671fd5354304e3196ad9a21d/1iba5hmlc">
          <View style={styles.linkDetailsButton}>
            <MaterialIcons name="support-agent" size={24} color="#fff" />
            <Text style={styles.linkText}>Connect with Customer Care & AI Assistance for immediate response</Text>
          </View>
        </ExternalLink>
      </View>
    </View>
  );
};

export default ReportAConcern;

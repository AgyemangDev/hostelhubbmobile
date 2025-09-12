import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

const DepositInstruction = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.noticeText}>
        If the transaction takes a while, please <Text style={styles.bold}>wait patiently</Text>. Do <Text style={styles.bold}>not initiate another payment</Text>. This may happen due to high traffic and usually resolves within <Text style={styles.bold}>2 minutes</Text>.
      </Text>

      <View style={styles.innerContainer}>
        <Text style={styles.header}>How to Make a Payment</Text>

        <Text style={styles.sectionTitle}>🔑 For Hostel Bookings:</Text>
        <View style={styles.bulletContainer}>
          <FontAwesome name="circle" size={10} color="#610b0c" style={styles.bulletIcon} />
          <Text style={styles.instructionText}>
            First, <Text style={styles.bold}>deposit at least 30 cedis</Text> into your Hostelhubb account.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <FontAwesome name="circle" size={10} color="#610b0c" style={styles.bulletIcon} />
          <Text style={styles.instructionText}>
            Then, click the <Text style={styles.bold}>“Subscribe To Hostelhubb”</Text> button to complete your subscription.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>📦 For Storage Reservations:</Text>
        <View style={styles.bulletContainer}>
          <FontAwesome name="circle" size={10} color="#610b0c" style={styles.bulletIcon} />
          <Text style={styles.instructionText}>
            No subscription needed. Simply <Text style={styles.bold}>top up your balance</Text> and pay for the storage service directly.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>💳 How to Top Up Your Balance:</Text>
        <View style={styles.bulletContainer}>
          <FontAwesome name="circle" size={10} color="#610b0c" style={styles.bulletIcon} />
          <Text style={styles.instructionText}>
            Enter the amount you wish to deposit into your Hostelhubb account.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <FontAwesome name="circle" size={10} color="#610b0c" style={styles.bulletIcon} />
          <Text style={styles.instructionText}>
            Tap the <Text style={styles.bold}>“Deposit”</Text> button. This will open a secure browser window.
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <FontAwesome name="circle" size={10} color="#610b0c" style={styles.bulletIcon} />
          <Text style={styles.instructionText}>
            Once payment is complete, return to the app. Your <Text style={styles.bold}>balance will update automatically</Text>.
          </Text>
        </View>

        <Text style={styles.finalNote}>
          🎉 You're now ready to <Text style={styles.bold}>book a hostel or reserve storage</Text> using your balance. Thank you for supporting Hostelhubb!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingTop: 15,
  },
  innerContainer: {
    paddingTop: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#610b0c",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginVertical: 10,
    color: "#444",
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletIcon: {
    marginTop: 5,
    marginRight: 8,
  },
  instructionText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    flex: 1,
  },
  noticeText: {
    marginTop: 10,
    fontSize: 14,
    color: "darkred",
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  finalNote: {
    fontSize: 15,
    marginTop: 20,
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default DepositInstruction;

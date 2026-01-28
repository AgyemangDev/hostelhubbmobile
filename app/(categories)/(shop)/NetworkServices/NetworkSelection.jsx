import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const NetworkSelection = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSelectNetwork = (network) => {
    router.push({
      pathname: "(shop)/NetworkServices/CampusData",
      params: { network },
    });
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <Text style={styles.title}>Buy Affordable Student Data</Text>
      <Text style={styles.subtitle}>
        We support your academic life with reliable, student-friendly data
        bundles.
      </Text>

      {/* NETWORK CARDS */}
      <View style={styles.cardsContainer}>
        {/* MTN */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleSelectNetwork("MTN")}
        >
          <ImageBackground
            source={{
              uri: "https://img.freepik.com/premium-photo/freckled-ginger-student-using-phone-yellow-background-sms-chat-educational-concept_129180-6280.jpg",
            }}
            style={styles.card}
            imageStyle={styles.image}
          >
            <View style={styles.overlay} />

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Campus Data</Text>
              <Text style={styles.cardDesc}>
                Reliable bundles for lectures, research, and online classes.
              </Text>

              <View style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Continue with MTN</Text>
                <Feather name="arrow-right" size={14} color="#fff" />
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* TELECEL */}
        {/* <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleSelectNetwork("TELECEL")}
        >
          <ImageBackground
            source={{
              uri: "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/9B1D/production/_120690793_phones.jpg",
            }}
            style={styles.card}
            imageStyle={styles.image}
          >
            <View style={styles.overlay} />

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Campus Data</Text>
              <Text style={styles.cardDesc}>
                Affordable long-validity data designed for students.
              </Text>

              <View style={styles.cardButton}>
                <Text style={styles.cardButtonText}>
                  Continue with Telecel
                </Text>
                <Feather name="arrow-right" size={14} color="#fff" />
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

export default NetworkSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 18,
  },

  cardsContainer: {
    gap: 18,
  },

  card: {
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  image: {
    borderRadius: 18,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)", // neutral dark overlay
  },

  cardContent: {
    padding: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 13,
    color: "#eaeaea",
    lineHeight: 18,
    marginBottom: 12,
  },

  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  cardButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginRight: 6,
  },
});

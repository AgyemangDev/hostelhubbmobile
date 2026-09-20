import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import BottomButton from "../../components/ButtonComponents/BottomButton";
import API_BASE_URL from "../../utils/api/api";

export default function SchoolSelection() {
  const router = useRouter();
  const { reservation, updateReservation } = useStorageReservation();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failedLogos, setFailedLogos] = useState({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/storage-schools/public`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load schools");
        return response.json();
      })
      .then((data) => {
        const availableSchools = data.schools || [];
        setSchools(availableSchools);

        // Replace any cached school snapshot with the current server record,
        // or clear it if the school is no longer accepting bookings.
        if (reservation.school?.id) {
          const currentSchool = availableSchools.find(
            (school) => school.id === reservation.school.id
          );
          updateReservation({ school: currentSchool || null });
        }
      })
      .catch((error) => Alert.alert("Unable to load schools", error.message))
      .finally(() => setLoading(false));
  }, []);

  const proceed = () => {
    if (!reservation.school) {
      Alert.alert("Select your school", "Choose the institution for this storage booking.");
      return;
    }
    router.push("ItemsSelection");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Which school are you from?</Text>
        <Text style={styles.subtitle}>
          Your pickup and delivery dates depend on the storage cycle for your school.
        </Text>
        {loading ? <ActivityIndicator size="large" color="#0B7A6F" /> : schools.map((school) => {
          const selected = reservation.school?.id === school.id;
          return (
            <TouchableOpacity
              key={school.id}
              onPress={() => updateReservation({ school })}
              style={[styles.card, selected && styles.selected]}
            >
              <View style={styles.radio}>{selected ? <View style={styles.radioFill} /> : null}</View>
              {school.logo_url?.trim() && !failedLogos[school.id] ? (
                <Image
                  source={{ uri: school.logo_url.trim() }}
                  style={styles.logo}
                  resizeMode="contain"
                  onError={() => setFailedLogos((current) => ({ ...current, [school.id]: true }))}
                />
              ) : (
                <View style={styles.logoFallback}><Text style={styles.logoFallbackText}>{school.code?.slice(0, 2)}</Text></View>
              )}
              <View style={styles.cardText}>
                <Text style={styles.schoolName}>{school.name}</Text>
                <Text style={styles.schoolCode}>{school.code}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        {!loading && schools.length === 0 && <Text style={styles.empty}>No schools are currently accepting storage bookings.</Text>}
      </ScrollView>
      <View style={styles.footer}>
        <BottomButton buttonText="Continue" onPressFunction={proceed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },
  content: { padding: 20, paddingBottom: 120, gap: 14 },
  title: { fontSize: 24, fontWeight: "700", color: "#17202a" },
  subtitle: { fontSize: 15, color: "#68727d", lineHeight: 22, marginBottom: 8 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  selected: { borderColor: "#0B7A6F", backgroundColor: "#f0fdfa" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#0B7A6F", alignItems: "center", justifyContent: "center", marginRight: 12 },
  radioFill: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#0B7A6F" },
  logo: { width: 48, height: 48, borderRadius: 12, marginRight: 12, backgroundColor: "#eef7f5" },
  logoFallback: { width: 48, height: 48, borderRadius: 12, marginRight: 12, backgroundColor: "#d9f2ed", alignItems: "center", justifyContent: "center" },
  logoFallbackText: { color: "#0B7A6F", fontWeight: "800" },
  cardText: { flex: 1 },
  schoolName: { fontSize: 16, fontWeight: "600", color: "#17202a" },
  schoolCode: { marginTop: 4, color: "#0B7A6F", fontWeight: "700", fontSize: 12 },
  empty: { color: "#68727d", textAlign: "center", marginTop: 30 },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

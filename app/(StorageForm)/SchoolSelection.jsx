import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useStorageReservation } from "../../context/StorageReservationContext";
import API_BASE_URL from "../../utils/api/api";
import SchoolListSkeleton from "../../components/skeletons/storage/SchoolListSkeleton";
import { Button, EmptyState, FadeIn, ListRow, PriceBar, StepHeader } from "../../components/ui";
import { colors, radius, space, type } from "../../constants/theme";
import { STORAGE_TOTAL_STEPS, stepOf } from "../../constants/storageSteps";

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

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
          const currentSchool = availableSchools.find((school) => school.id === reservation.school.id);
          updateReservation({ school: currentSchool || null });
        }
      })
      .catch((error) => Alert.alert("Unable to load schools", error.message))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const proceed = () => {
    if (!reservation.school) {
      Alert.alert("Select your school", "Choose the institution for this storage booking.");
      return;
    }
    router.push("ItemsSelection");
  };

  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <StepHeader step={stepOf("SchoolSelection")} total={STORAGE_TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ gap: space.xs }}>
          <Text style={type.display} accessibilityRole="header">Which school are you at?</Text>
          <Text style={[type.body, { color: colors.textSecondary }]}>
            Pickup and delivery dates follow your school's storage window.
          </Text>
        </View>

        {loading ? (
          <SchoolListSkeleton />
        ) : schools.length === 0 ? (
          <EmptyState icon="school-outline" title="No schools open right now" body="Storage bookings open again before the next break." />
        ) : (
          <FadeIn>
            {schools.map((school, i) => {
              const showLogo = school.logo_url?.trim() && !failedLogos[school.id];
              return (
                <ListRow
                  key={school.id}
                  title={school.name}
                  subtitle={school.code}
                  last={i === schools.length - 1}
                  selected={reservation.school?.id === school.id}
                  onPress={() => updateReservation({ school })}
                  leading={
                    showLogo ? (
                      <Image
                        source={{ uri: school.logo_url.trim() }}
                        style={styles.logo}
                        resizeMode="contain"
                        onError={() => setFailedLogos((c) => ({ ...c, [school.id]: true }))}
                      />
                    ) : (
                      <View style={[styles.logo, styles.logoFallback]}>
                        <Text style={[type.caption, { fontWeight: "800" }]}>{school.code?.slice(0, 2)}</Text>
                      </View>
                    )
                  }
                />
              );
            })}
          </FadeIn>
        )}
      </ScrollView>
      <PriceBar action={<Button title="Continue" onPress={proceed} disabled={!reservation.school} />} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: space.lg, gap: space.xl, paddingBottom: space.xxl },
  logo: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.fill },
  logoFallback: { alignItems: "center", justifyContent: "center" },
});

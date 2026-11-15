import React, { useContext, useRef, useState } from "react";
import { ActivityIndicator, Alert, Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AddHubclippsContext } from "../../../context/AddHubclippsContext";
import { validateManager } from "../../../utils/ValidationUtils/hubbclipsValidation";
import { Button, PressableScale, PriceBar, StepHeader, TextField } from "../../../components/ui/ds";
import { colors, elevation, radius, space, type } from "../../../constants/theme";

// Map opens on KNUST until the poster shares their location or moves the map.
const DEFAULT_REGION = { latitude: 6.6745, longitude: -1.5716, latitudeDelta: 0.012, longitudeDelta: 0.012 };

export default function ManagerInfoScreen() {
  const router = useRouter();
  const { draft, setDraft } = useContext(AddHubclippsContext);
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const mapRef = useRef(null);
  const touchedRef = useRef(false);
  const [locating, setLocating] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [searchNote, setSearchNote] = useState("");

  const hasPin = Number.isFinite(Number(draft.latitude)) && draft.latitude !== null && draft.latitude !== "";
  const initialRegion = hasPin
    ? { ...DEFAULT_REGION, latitude: Number(draft.latitude), longitude: Number(draft.longitude) }
    : DEFAULT_REGION;

  const set = (key, value) => setDraft({ ...draftRef.current, [key]: value });
  // The pin is fixed in the centre; moving the map moves the building under it.
  const setPin = ({ latitude, longitude }) =>
    setDraft({ ...draftRef.current, latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) });

  const useMyLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location needed", "Allow location in Settings, or drag the map to the building instead.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const region = { ...DEFAULT_REGION, latitude: pos.coords.latitude, longitude: pos.coords.longitude, latitudeDelta: 0.004, longitudeDelta: 0.004 };
      mapRef.current?.animateToRegion(region, 280);
      setPin(pos.coords);
    } catch {
      Alert.alert("Couldn't find you", "Drag the map so the pin sits on the building.");
    } finally {
      setLocating(false);
    }
  };

  const goTo = ({ latitude, longitude }) => {
    mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.004, longitudeDelta: 0.004 }, 280);
    setPin({ latitude, longitude });
  };

  // Place search: free, on-device geocoding (Apple Maps on iOS, Google on
  // Android). Results are biased to Ghana unless the poster names a country.
  const searchPlace = async () => {
    const q = query.trim();
    if (q.length < 3) return;
    Keyboard.dismiss();
    setSearching(true);
    setResults([]);
    setSearchNote("");
    try {
      const text = /ghana/i.test(q) ? q : `${q}, Ghana`;
      const found = (await Location.geocodeAsync(text)).slice(0, 4);
      if (found.length === 0) {
        setSearchNote("No match. Try the area or a nearby landmark, e.g. \"Ayeduase Gate\".");
        return;
      }
      const named = await Promise.all(
        found.map(async (f) => {
          try {
            const [a] = await Location.reverseGeocodeAsync({ latitude: f.latitude, longitude: f.longitude });
            const label = [a?.name, a?.street, a?.district || a?.subregion, a?.city].filter(Boolean);
            return { ...f, label: [...new Set(label)].slice(0, 3).join(", ") || q };
          } catch {
            return { ...f, label: q };
          }
        })
      );
      goTo(named[0]);
      setSearchNote(`Showing ${named[0].label}. Drag the map to fine-tune.`);
      if (named.length > 1) setResults(named);
    } catch {
      setSearchNote("Search isn't available right now. Drag the map or use your current location.");
    } finally {
      setSearching(false);
    }
  };

  const handleContinue = () => {
    const errors = validateManager(draft);
    if (errors.length > 0) {
      Alert.alert("A few details missing", errors[0]);
      return;
    }
    router.push("/MediaScreen");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StepHeader step={2} total={4} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={{ gap: space.xs }}>
          <Text style={type.display} accessibilityRole="header">Who shows the room, and where is it?</Text>
          <Text style={[type.caption, { color: colors.textSecondary }]}>
            Only HostelHubb sees these details. Students never get the number directly.
          </Text>
        </View>

        <TextField
          label="Manager or porter's name"
          value={draft.manager_or_porter_name}
          onChangeText={(v) => set("manager_or_porter_name", v)}
          autoCapitalize="words"
          placeholder="e.g. Mr. Owusu"
        />
        <TextField
          label="Their phone number"
          value={draft.manager_or_porter_contact}
          onChangeText={(v) => set("manager_or_porter_contact", v)}
          keyboardType="phone-pad"
          placeholder="024 000 0000"
        />

        <View style={{ gap: space.xs }}>
          <Text style={[type.caption, { fontWeight: "700" }]}>Pin the building</Text>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.text} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={searchPlace}
              placeholder="Search area, street or landmark"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="search"
              autoCorrect={false}
              style={styles.searchInput}
              accessibilityLabel="Search for the building's location"
            />
            {searching ? (
              <ActivityIndicator color={colors.text} />
            ) : query ? (
              <PressableScale onPress={searchPlace} accessibilityRole="button" accessibilityLabel="Search" style={styles.searchGo}>
                <Ionicons name="arrow-forward" size={18} color={colors.textInverse} />
              </PressableScale>
            ) : null}
          </View>
          {results.length > 1 ? (
            <View style={styles.results}>
              {results.map((r, i) => (
                <PressableScale
                  key={`${r.latitude},${r.longitude}`}
                  onPress={() => {
                    goTo(r);
                    setResults([]);
                    setSearchNote(`Showing ${r.label}. Drag the map to fine-tune.`);
                  }}
                  accessibilityRole="button"
                  style={[styles.result, i > 0 && styles.resultDivider]}
                >
                  <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
                  <Text style={[type.body, { flex: 1 }]} numberOfLines={1}>{r.label}</Text>
                </PressableScale>
              ))}
            </View>
          ) : null}
          {searchNote ? <Text style={[type.caption, { color: colors.textSecondary }]}>{searchNote}</Text> : null}
          <View style={styles.mapWrap}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFill}
              initialRegion={initialRegion}
              // Only a drag by the poster moves the pin; the map's own first
              // render (which also fires this) must not save a default spot.
              // (`details.isGesture` would say this, but only on Google Maps.)
              onTouchStart={() => {
                touchedRef.current = true;
              }}
              onRegionChangeComplete={(region) => {
                if (touchedRef.current) setPin(region);
              }}
              showsUserLocation
              accessibilityLabel="Map. Drag to place the building under the pin."
            />
            <View pointerEvents="none" style={styles.pinWrap}>
              <Ionicons name="location" size={40} color={colors.text} />
            </View>
            <PressableScale onPress={useMyLocation} accessibilityRole="button" style={styles.locate}>
              {locating ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <Ionicons name="locate-outline" size={18} color={colors.text} />
                  <Text style={[type.caption, { fontWeight: "700" }]}>Use my current location</Text>
                </>
              )}
            </PressableScale>
          </View>
          <Text style={[type.caption, { color: hasPin ? colors.success : colors.textSecondary, fontWeight: hasPin ? "700" : "500" }]}>
            {hasPin
              ? "Pin saved. Drag again to adjust."
              : "Drag the map so the pin sits on the building. Standing at the room gives the best result."}
          </Text>
        </View>
      </ScrollView>
      <PriceBar action={<Button title="Continue" onPress={handleContinue} />} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
  search: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingLeft: space.md,
    paddingRight: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...elevation.card,
  },
  searchInput: { flex: 1, ...type.body, color: colors.text, paddingVertical: 12 },
  searchGo: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.text, alignItems: "center", justifyContent: "center" },
  results: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: "hidden" },
  result: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: space.xs, paddingHorizontal: space.md },
  resultDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  mapWrap: { height: 280, borderRadius: radius.lg, overflow: "hidden", backgroundColor: colors.fill },
  // Offset up by half the icon so its tip, not its middle, marks the spot.
  pinWrap: { position: "absolute", left: 0, right: 0, top: 0, bottom: 40, alignItems: "center", justifyContent: "center" },
  locate: {
    position: "absolute",
    left: space.sm,
    right: space.sm,
    bottom: space.sm,
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    borderRadius: 10,
    backgroundColor: colors.surface,
    ...elevation.card,
  },
});

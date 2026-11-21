import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Modal, StyleSheet, useWindowDimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { UserContext } from "../../context/UserContext";
import ClientLogIn from "../(Client)/ClientLogIn";
import PlaceMarker from "../../components/markers/map/PlaceMarker";
import MapPlaceCard from "../../components/cards/map/MapPlaceCard";
import MapHeader from "../../components/sections/map/MapHeader";
import MapResultsSheet from "../../components/sheets/map/MapResultsSheet";
import { IconButton } from "../../components/ui";
import useMapPins from "../../hooks/map/useMapPins";
import { distanceKm } from "../../utils/mapFormat";
import { colors, space } from "../../constants/theme";

const GHANA_REGION = { latitude: 7.9465, longitude: -1.0232, latitudeDelta: 6.5, longitudeDelta: 6.5 };
const NEAR_DELTA = 0.035;
// Zoomed out past this, price pills become dots so the map stays readable.
const COMPACT_DELTA = 0.25;
const PEEK = 96;
const CARD_GAP = 12;

const isInsideGhana = ({ latitude, longitude }) => latitude >= 4.5 && latitude <= 11.5 && longitude >= -3.5 && longitude <= 1.5;
const inRegion = (p, r) =>
  Math.abs(p.latitude - r.latitude) <= r.latitudeDelta / 2 && Math.abs(p.longitude - r.longitude) <= r.longitudeDelta / 2;
const keyOf = (item) => `${item.kind}-${item.place.id}`;

/**
 * The Maps tab, modelled on Airbnb's map: search and categories on top, price
 * pills on the map, a pull-up list of what's in view, and a swipeable card
 * row for the tapped pin. Shows hostels and pinned hubclips.
 */
const MapScreen = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user, userInfo } = useContext(UserContext);
  const { hostels, hubclips, loading } = useMapPins();

  const mapRef = useRef(null);
  const sheetRef = useRef(null);
  const carouselRef = useRef(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState(GHANA_REGION);
  const [headerHeight, setHeaderHeight] = useState(150);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [carousel, setCarousel] = useState([]); // frozen while browsing cards, so it doesn't reorder as the map pans
  const [visited, setVisited] = useState(() => new Set());
  const [showLogin, setShowLogin] = useState(false);

  const cardWidth = width - space.lg * 2;
  const signedIn = Boolean(user && userInfo);

  // One fix to centre the map and measure distances; the blue dot is native.
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).catch(() => null);
      if (!pos) return;
      const here = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setUserLocation(here);
      if (isInsideGhana(here)) mapRef.current?.animateToRegion({ ...here, latitudeDelta: NEAR_DELTA, longitudeDelta: NEAR_DELTA }, 600);
    })();
  }, []);

  // Everything matching the category and search, as [{ place, kind }].
  const matching = useMemo(() => {
    const q = query.trim().toLowerCase();
    const text = (p) => `${p.name || ""} ${p.location || ""} ${p.institution || ""}`.toLowerCase();
    const keep = (p) => !q || text(p).includes(q);
    const showHostels = category !== "hubclips";
    const showClips = category === "all" || category === "hubclips";
    const byCategory = (p) => ["all", "hubclips"].includes(category) || p.category === category;
    return [
      ...(showHostels ? hostels.filter((p) => byCategory(p) && keep(p)).map((place) => ({ place, kind: "hostel" })) : []),
      ...(showClips ? hubclips.filter(keep).map((place) => ({ place, kind: "hubclip" })) : []),
    ];
  }, [hostels, hubclips, category, query]);

  // What's in the current view, nearest the middle first: the sheet's list.
  const inView = useMemo(() => {
    const centre = { latitude: region.latitude, longitude: region.longitude };
    return matching
      .filter((item) => inRegion(item.place, region))
      .sort((a, b) => distanceKm(centre, a.place) - distanceKm(centre, b.place));
  }, [matching, region]);

  // A search zooms the map to its results.
  useEffect(() => {
    if (!query.trim() || !matching.length) return undefined;
    const t = setTimeout(() => {
      mapRef.current?.fitToCoordinates(matching.slice(0, 200).map((m) => m.place), {
        edgePadding: { top: headerHeight + 40, bottom: PEEK + 40, left: 40, right: 40 },
        animated: true,
      });
    }, 450);
    return () => clearTimeout(t);
  }, [query, matching]); // eslint-disable-line react-hooks/exhaustive-deps

  const focus = (place) => {
    const d = Math.min(region.latitudeDelta, NEAR_DELTA * 2);
    mapRef.current?.animateToRegion({ latitude: place.latitude, longitude: place.longitude, latitudeDelta: d, longitudeDelta: d }, 300);
  };

  const markVisited = (key) => setVisited((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));

  const select = (place, kind) => {
    if (!signedIn) { setShowLogin(true); return; }
    const key = keyOf({ place, kind });
    const list = carousel.length && carousel.some((i) => keyOf(i) === key) ? carousel : (inView.some((i) => keyOf(i) === key) ? inView : [{ place, kind }, ...inView]);
    setCarousel(list);
    setSelectedKey(key);
    markVisited(key);
    sheetRef.current?.close();
    const index = list.findIndex((i) => keyOf(i) === key);
    requestAnimationFrame(() => carouselRef.current?.scrollToOffset({ offset: Math.max(0, index) * (cardWidth + CARD_GAP), animated: false }));
  };

  const clear = () => {
    if (!selectedKey) return;
    setSelectedKey(null);
    setCarousel([]);
    sheetRef.current?.snapToIndex(0);
  };

  const open = ({ place, kind }) => {
    if (!signedIn) { setShowLogin(true); return; }
    markVisited(keyOf({ place, kind }));
    if (kind === "hubclip") router.push({ pathname: "/(tabs)/(Hubclipps)", params: { clip: place.id } });
    else router.push({ pathname: "/hostel/[id]", params: { id: place.id } });
  };

  // Swiping the card row selects that place and moves the map to it.
  const onCardSettled = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (cardWidth + CARD_GAP));
    const item = carousel[index];
    if (!item || keyOf(item) === selectedKey) return;
    setSelectedKey(keyOf(item));
    markVisited(keyOf(item));
    focus(item.place);
  };

  const recenter = () => {
    const target = userLocation && isInsideGhana(userLocation) ? { ...userLocation, latitudeDelta: NEAR_DELTA, longitudeDelta: NEAR_DELTA } : GHANA_REGION;
    mapRef.current?.animateToRegion(target, 450);
  };

  const compact = region.latitudeDelta > COMPACT_DELTA;
  const showingCards = Boolean(selectedKey && carousel.length);

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={GHANA_REGION}
        mapPadding={{ top: headerHeight, bottom: PEEK, left: 0, right: 0 }}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        showsPointsOfInterest={false}
        toolbarEnabled={false}
        onPress={clear}
        onRegionChangeComplete={setRegion}
      >
        {matching.map((item) => {
          const key = keyOf(item);
          return (
            <PlaceMarker
              key={key}
              place={item.place}
              kind={item.kind}
              compact={compact}
              selected={key === selectedKey}
              visited={visited.has(key)}
              onPress={select}
            />
          );
        })}
      </MapView>

      <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)} style={styles.headerSlot} pointerEvents="box-none">
        <MapHeader query={query} onQuery={setQuery} category={category} onCategory={(v) => { setCategory(v); clear(); }} />
      </View>

      <View style={[styles.floating, { bottom: showingCards ? 168 : PEEK + space.sm }]} pointerEvents="box-none">
        <IconButton icon="locate" variant="floating" onPress={recenter} accessibilityLabel="Show my location" />
      </View>

      {showingCards ? (
        <FlatList
          ref={carouselRef}
          data={carousel}
          keyExtractor={keyOf}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + CARD_GAP}
          decelerationRate="fast"
          disableIntervalMomentum
          onMomentumScrollEnd={onCardSettled}
          getItemLayout={(_, index) => ({ length: cardWidth + CARD_GAP, offset: (cardWidth + CARD_GAP) * index, index })}
          contentContainerStyle={styles.carousel}
          style={styles.carouselWrap}
          renderItem={({ item }) => (
            <MapPlaceCard place={item.place} kind={item.kind} from={userLocation} width={cardWidth} onOpen={() => open(item)} />
          )}
        />
      ) : null}

      <MapResultsSheet ref={sheetRef} places={inView} from={userLocation} loading={loading} onOpen={open} />

      <Modal visible={showLogin} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowLogin(false)}>
        <ClientLogIn onClose={() => setShowLogin(false)} />
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  headerSlot: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 },
  floating: { position: "absolute", right: space.md, zIndex: 5 },
  carouselWrap: { position: "absolute", left: 0, right: 0, bottom: space.lg, zIndex: 6 },
  carousel: { paddingHorizontal: space.lg, gap: CARD_GAP },
});

export default MapScreen;

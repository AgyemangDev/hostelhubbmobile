import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import ListingRail from "./ListingRail";
import { space } from "../../../constants/theme";

const shuffle = (list) => [...list].sort(() => 0.5 - Math.random());

/** The three listing rails on Home: popular, last-minute and recently added. */
export default function HorizontalScrollCardList({ accommodations }) {
  const router = useRouter();

  const popular = useMemo(() => shuffle((accommodations || []).filter((a) => a.views > 3500)), [accommodations]);
  const lastMinute = useMemo(() => shuffle(accommodations || []).slice(0, 10), [accommodations]);
  const recent = useMemo(() => (accommodations || []).filter((a) => a.views < 2000).slice(0, 10), [accommodations]);

  const open = (item) => router.push({ pathname: "/hostel/[id]", params: { id: item.id } });
  const seeMore = (tab) => () => router.push({ pathname: "(hostels)", params: { tab } });

  return (
    <View style={styles.container}>
      <ListingRail title="Popular Hostels" list={popular} onPressItem={open} onSeeMore={seeMore("popular")} />
      <ListingRail title="Last Minute Ideas" list={lastMinute} onPressItem={open} onSeeMore={seeMore("lastminute")} />
      <ListingRail title="Recently Added Hostels" list={recent} onPressItem={open} onSeeMore={seeMore("justadded")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: space.xl },
});

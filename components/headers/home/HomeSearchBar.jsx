import React from "react";
import { Animated, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import SearchPill from "../../forms/home/SearchPill";
import { colors, space } from "../../../constants/theme";

/**
 * The search bar on Home. Rendered as a sticky header of the page's
 * ScrollView, so it scrolls up with the title row and then locks at the top.
 * A hairline fades in under it once it is pinned (`stickAt` = scroll offset
 * where that happens, i.e. the title row's height).
 */
export default function HomeSearchBar({ scrollY, stickAt = 0 }) {
  const router = useRouter();
  const hairline = scrollY
    ? scrollY.interpolate({ inputRange: [Math.max(stickAt - 1, 0), stickAt + 8], outputRange: [0, 1], extrapolate: "clamp" })
    : 0;

  return (
    <Animated.View style={styles.bar}>
      <SearchPill
        onPress={() => router.push("/SearchScreen")}
        onFilter={() => router.push({ pathname: "/SearchScreen", params: { filters: "1" } })}
      />
      <Animated.View style={[styles.hairline, { opacity: hairline }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.background, paddingHorizontal: space.md, paddingTop: space.xxs, paddingBottom: space.sm },
  hairline: { position: "absolute", left: 0, right: 0, bottom: 0, height: StyleSheet.hairlineWidth, backgroundColor: colors.borderStrong },
});

import React from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider, PriceBar, Skeleton } from "../../ui";
import RoomCardSkeleton from "./RoomCardSkeleton";
import { colors, space } from "../../../constants/theme";

const GALLERY_HEIGHT = 430; // matches HostelImageGallery


/**
 * Placeholder for the hostel page, laid out exactly like it: full-height photo
 * with floating buttons, title, move-in/out tiles, description, room prices,
 * amenities, and the reserve bar — so nothing jumps when the real page lands.
 */
export default function HostelDetailsSkeleton() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen} accessibilityLabel="Loading hostel details" accessibilityState={{ busy: true }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} scrollEnabled={false}>
        <View>
          <Skeleton height={GALLERY_HEIGHT} radius={0} />
          <View style={[styles.floating, { top: insets.top + space.xs }]}>
            <View style={styles.roundButton} />
            <View style={styles.roundButton} />
          </View>
          <View style={styles.counter}>
            <Skeleton variant="pill" width={44} height={22} tone="dark" />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.block}>
            <Skeleton variant="text" width="72%" height={24} />
            <Skeleton variant="text" width="48%" height={14} />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.tiles}>
            {[0, 1].map((i) => (
              <View key={i} style={styles.tile}>
                <View style={styles.row}>
                  <Skeleton width={26} height={26} />
                  <Skeleton variant="text" width="45%" />
                </View>
                <Skeleton variant="text" width="80%" height={15} />
                <Skeleton variant="text" width="55%" />
              </View>
            ))}
          </View>
          <Skeleton variant="text" width="30%" style={styles.stay} />

          <Divider style={styles.divider} />

          <View style={styles.block}>
            <Skeleton variant="text" width="100%" height={13} />
            <Skeleton variant="text" width="94%" height={13} />
            <Skeleton variant="text" width="60%" height={13} />
            <Skeleton variant="text" width={76} height={13} style={{ marginTop: space.xs }} />
          </View>

          <View style={[styles.block, styles.section]}>
            <Skeleton variant="text" width="55%" height={22} />
            <Skeleton variant="text" width="28%" />
          </View>
          <View style={styles.cards}>
            <RoomCardSkeleton rows={2} />
            <RoomCardSkeleton rows={1} />
          </View>

          <View style={[styles.block, styles.section]}>
            <Skeleton variant="text" width="62%" height={22} />
          </View>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.row, styles.amenity]}>
              <Skeleton width={24} height={24} radius={6} />
              <Skeleton variant="text" width={["50%", "38%", "56%", "44%"][i]} height={14} />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bar}>
        <PriceBar>
          <View style={styles.barPrice}>
            <Skeleton variant="text" width="60%" height={18} />
            <Skeleton variant="text" width="35%" />
          </View>
          <Skeleton width={112} height={52} radius={12} />
        </PriceBar>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 140 },
  floating: { position: "absolute", left: space.md, right: space.md, flexDirection: "row", justifyContent: "space-between" },
  roundButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, opacity: 0.9 },
  counter: { position: "absolute", right: space.md, bottom: space.md },
  content: { paddingHorizontal: space.md + 4, paddingTop: 14 },
  block: { gap: space.xs },
  divider: { marginVertical: 14 },
  row: { flexDirection: "row", alignItems: "center", gap: space.xs },
  tiles: { flexDirection: "row", gap: space.xs },
  tile: { flex: 1, gap: 6, padding: space.sm, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSunken },
  stay: { alignSelf: "center", marginTop: 10 },
  section: { marginTop: space.xl, marginBottom: space.sm },
  cards: { gap: space.sm },
  amenity: { paddingVertical: 14, gap: space.md },
  bar: { position: "absolute", left: 0, right: 0, bottom: 0 },
  barPrice: { flex: 1, gap: 6 },
});

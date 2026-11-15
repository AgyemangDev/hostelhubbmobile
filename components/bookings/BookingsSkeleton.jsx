// components/BookingsSkeleton.jsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

// Single shimmering placeholder bar.
const Bone = ({ width, height = 12, style }) => {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.bone,
        { width, height, opacity },
        style,
      ]}
    />
  );
};

// One skeleton "booking card" — mirrors the shape of a real booking row:
// avatar/thumbnail, name line, subtitle line, status pill.
const SkeletonCard = () => (
  <View style={styles.card}>
    <View style={styles.topRow}>
      <Bone width={48} height={48} style={styles.thumb} />
      <View style={styles.headerInfo}>
        <Bone width="70%" height={14} style={{ marginBottom: 8 }} />
        <Bone width="45%" height={11} />
      </View>
      <Bone width={60} height={20} style={styles.pill} />
    </View>

    <View style={styles.row}>
      <Bone width="55%" height={11} />
    </View>
    <View style={styles.row}>
      <Bone width="40%" height={11} />
    </View>

    <View style={styles.actionsRow}>
      <Bone width={64} height={26} style={styles.actionPill} />
      <Bone width={64} height={26} style={styles.actionPill} />
    </View>
  </View>
);

const BookingsSkeleton = ({ count = 5 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bone: {
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
  thumb: {
    borderRadius: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pill: {
    borderRadius: 999,
  },
  row: {
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  actionPill: {
    borderRadius: 8,
  },
});

export default BookingsSkeleton;
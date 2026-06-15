// SkeletonLoader.jsx
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

const Bone = ({ width = "100%", height = 16, radius = 8, style }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: "#E8E8E8" },
        { opacity },
        style,
      ]}
    />
  );
};

const SkeletonLoader = () => (
  <View style={styles.container}>
    {/* Title */}
    <Bone width="55%" height={13} radius={6} style={{ marginBottom: 6 }} />
    <Bone width="75%" height={22} radius={6} style={{ marginBottom: 24 }} />

    {/* Section label */}
    <Bone width="40%" height={11} radius={4} style={{ marginBottom: 6 }} />
    <Bone width="60%" height={13} radius={4} style={{ marginBottom: 16 }} />

    {/* Cards */}
    {[1, 2, 3].map((i) => (
      <View key={i} style={styles.card}>
        <View style={styles.cardHeader}>
          <Bone width={34} height={34} radius={8} />
          <Bone width="50%" height={14} radius={6} style={{ marginLeft: 10 }} />
        </View>
        <View style={styles.cardBody}>
          <Bone height={44} radius={8} style={{ marginBottom: 8 }} />
          <Bone height={44} radius={8} />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 24 },
  card: {
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  cardBody: { padding: 10 },
});

export default SkeletonLoader;
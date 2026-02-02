import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Skeleton = ({ style, width = "100%" }) => {
  const [offset, setOffset] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev >= 1 ? -1 : prev + 0.05));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.skeleton, style, { width }]}>
      <LinearGradient
        colors={[
          "rgba(255,255,255,0)",
          "rgba(255,255,255,0.4)",
          "rgba(255,255,255,0.8)",
          "rgba(255,255,255,0.4)",
          "rgba(255,255,255,0)",
        ]}
        start={{ x: offset, y: 0 }}
        end={{ x: offset + 1, y: 0 }}
        style={styles.shimmer}
      />
    </View>
  );
};

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        <View style={styles.header}>
          <Skeleton style={styles.icon} width={36} />
          <Skeleton style={styles.icon} width={36} />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <Skeleton style={styles.imageGallery} />

        <View style={styles.content}>
          <Skeleton style={styles.title} width="70%" />
          <Skeleton style={styles.subtitle} width="50%" />

          <Skeleton style={styles.blockLarge} />

          <Skeleton style={styles.sectionTitle} width="45%" />
          <View style={styles.cardContainer}>
            <Skeleton style={styles.card} />
            <Skeleton style={styles.card} />
            <Skeleton style={styles.card} />
          </View>

          <Skeleton style={styles.sectionTitle} width="40%" />
          <View style={styles.amenitiesRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} style={styles.amenity} width="30%" />
            ))}
          </View>

          <Skeleton style={styles.sectionTitle} width="35%" />
          <Skeleton style={styles.blockMedium} />
        </View>
      </ScrollView>

      {/* Fixed button */}
      <View style={styles.fixedButton}>
        <Skeleton style={styles.button} />
      </View>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  headerSafe: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#fff",
  },
  header: {
    height: Platform.OS === "ios" ? 45 : 54,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    height: 36,
    borderRadius: 18,
  },

  scrollContent: {
    paddingBottom: 140,
  },

  imageGallery: {
    height: 280,
    marginBottom: 16,
  },

  content: {
    paddingHorizontal: 16,
  },

  title: {
    height: 24,
    marginBottom: 8,
    borderRadius: 4,
  },
  subtitle: {
    height: 16,
    marginBottom: 20,
    borderRadius: 4,
  },

  blockLarge: {
    height: 100,
    marginBottom: 24,
    borderRadius: 8,
  },

  blockMedium: {
    height: 70,
    marginBottom: 20,
    borderRadius: 8,
  },

  sectionTitle: {
    height: 20,
    marginBottom: 12,
    borderRadius: 4,
  },

  cardContainer: {
    gap: 12,
    marginBottom: 24,
  },

  card: {
    height: 120,
    borderRadius: 12,
  },

  amenitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  amenity: {
    height: 44,
    borderRadius: 8,
  },

  fixedButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  button: {
    height: 52,
    borderRadius: 12,
  },

  /* Skeleton */
  skeleton: {
    backgroundColor: "#e8e8e8",
    borderRadius: 6,
    overflow: "hidden",
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
  },
});
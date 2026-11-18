import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { Icon, Text } from "../../ui";
import useReducedMotion from "../../../hooks/useReducedMotion";
import { colors } from "../../../constants/theme";

const SEA_LIGHT_BLUE = "#E5F2FE";

/** One card in the "Why HostelHubb?" slider: centred icon, title and description. Rises in after its turn. */
export default function BenefitCard({ icon, title, body, index = 0 }) {
  const { width } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    const config = { toValue: 0, duration: reduced ? 0 : 500, delay: reduced ? 0 : index * 150, useNativeDriver: true };
    Animated.parallel([Animated.timing(opacity, { ...config, toValue: 1 }), Animated.timing(translateY, config)]).start();
  }, [index, opacity, translateY, reduced]);

  return (
    <Animated.View style={[styles.card, { width: width * 0.55, opacity, transform: [{ translateY }] }]}>
      <View style={styles.icon}>
        <Icon name={icon} size={30} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text variant="caption" tone="secondary" style={styles.body}>{body}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 160,
    backgroundColor: SEA_LIGHT_BLUE,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  icon: { marginBottom: 6 },
  title: { fontSize: 15, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 4 },
  body: { textAlign: "center", lineHeight: 18 },
});

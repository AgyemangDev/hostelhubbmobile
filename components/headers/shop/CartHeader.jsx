import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useRouter } from "expo-router";
import { CountBadge, IconButton } from "../../ui";
import { useCart } from "../../../context/CartContext";
import useReducedMotion from "../../../hooks/useReducedMotion";

/** Bag button in the shop header; pops when the cart count changes and shows the count. */
export default function CartHeader() {
  const { cartCount } = useCart();
  const router = useRouter();
  const pop = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!cartCount || reduced) return;
    Animated.sequence([
      Animated.timing(pop, { toValue: 1.15, duration: 140, useNativeDriver: true }),
      Animated.timing(pop, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [cartCount, pop, reduced]);

  return (
    <Animated.View style={{ transform: [{ scale: pop }] }}>
      <IconButton
        icon="bag-handle-outline"
        variant="tonal"
        accessibilityLabel={cartCount ? `Cart, ${cartCount} items` : "Cart"}
        onPress={() => router.push("/Checkout")}
      />
      <CountBadge count={cartCount} />
    </Animated.View>
  );
}

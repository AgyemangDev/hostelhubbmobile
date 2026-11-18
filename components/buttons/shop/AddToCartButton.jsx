import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, PriceBar } from "../../ui";

/** "Add to cart" pinned to the bottom of a product page. */
export default function AddToCartButton({ onPress }) {
  return (
    <View style={styles.pinned}>
      <PriceBar action={<Button title="Add to cart" icon="cart-outline" onPress={onPress} />} />
    </View>
  );
}

const styles = StyleSheet.create({
  pinned: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

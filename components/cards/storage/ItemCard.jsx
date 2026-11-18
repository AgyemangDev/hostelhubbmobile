import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button, PressableScale, QuantityStepper, Sheet } from "../../ui";
import { money } from "../../../utils/formatMoney";
import { colors, radius, space, type } from "../../../constants/theme";

/** One storage item: photo, name, unit price, and Add or a quantity stepper. */
export default function ItemCard({ item, selectedItem, onSelect, onIncrease, onDecrease, last }) {
  const [preview, setPreview] = useState(false);
  const qty = selectedItem?.quantity || 0;
  const price = Number(item.price) || 0;

  return (
    <>
      <View style={[styles.row, !last && styles.border]}>
        <PressableScale onPress={() => setPreview(true)} accessibilityRole="imagebutton" accessibilityLabel={`See a photo of ${item.name}`}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </PressableScale>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.bodyStrong} numberOfLines={2}>{item.name}</Text>
          <Text style={[type.caption, { color: colors.textSecondary }]}>
            {money(price)} each{qty > 1 ? ` · ${money(price * qty)}` : ""}
          </Text>
        </View>
        {qty ? (
          <QuantityStepper value={qty} onIncrease={onIncrease} onDecrease={onDecrease} label={item.name} max={50} />
        ) : (
          <Button title="Add" variant="secondary" size="sm" onPress={onSelect} accessibilityLabel={`Add ${item.name}`} />
        )}
      </View>

      <Sheet
        visible={preview}
        onClose={() => setPreview(false)}
        title={item.name}
        footer={
          qty ? (
            <Button title="Done" variant="secondary" onPress={() => setPreview(false)} />
          ) : (
            <Button
              title={`Add for ${money(price)}`}
              onPress={() => {
                onSelect();
                setPreview(false);
              }}
            />
          )
        }
      >
        <Image source={{ uri: item.image }} style={styles.preview} resizeMode="cover" />
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.sm + 2, paddingVertical: space.sm },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  image: { width: 60, height: 60, borderRadius: radius.md, backgroundColor: colors.fill },
  preview: { width: "100%", aspectRatio: 4 / 3, borderRadius: radius.lg, backgroundColor: colors.fill },
});

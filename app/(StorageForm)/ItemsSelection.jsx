"use client";
import React from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { STORAGE_ITEMS } from "../../assets/data/storageItems";
import { useStorageReservation } from "../../context/StorageReservationContext";
import ItemCard from "../../components/Storage/ItemCard";
import BottomButton from "../../components/ButtonComponents/BottomButton";

export default function ItemsSelection() {
  const router = useRouter();
  const { reservation, upsertItem, removeItem } = useStorageReservation();

  const getSelectedItem = (id) =>
    reservation.items.find((i) => i.id === id);

  const toggleSelect = (item) => {
    const selected = getSelectedItem(item.id);

    if (selected) {
      removeItem(item.id);
    } else {
      upsertItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image, // comes from data
      });
    }
  };

  const proceed = () => {
    if (reservation.items.length === 0) {
      Alert.alert("Select at least one item");
      return;
    }

    router.push("PickupDeliveryInfo");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {STORAGE_ITEMS.map((item) => {
          const selectedItem = getSelectedItem(item.id);

          return (
            <ItemCard
              key={item.id}
              item={item}
              selectedItem={selectedItem}
              onSelect={() => toggleSelect(item)}
              onIncrease={() =>
                upsertItem({
                  ...selectedItem,
                  quantity: selectedItem.quantity + 1,
                })
              }
              onDecrease={() => {
                if (selectedItem.quantity === 1) {
                  removeItem(item.id);
                } else {
                  upsertItem({
                    ...selectedItem,
                    quantity: selectedItem.quantity - 1,
                  });
                }
              }}
            />
          );
        })}
      </ScrollView>

      {/* Sticky but lifted button */}
      <View style={styles.stickyButton}>
        <BottomButton
          buttonText="Continue"
          onPressFunction={proceed}
          disabled={reservation.items.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },

  scroll: {
    padding: 16,
    paddingBottom: 160, // space so content scrolls under button
  },

  stickyButton: {
    position: "absolute",
    bottom: 0, // 👈 not glued to bottom
    left: 0,
    right: 0,
  },
});
"use client";
import React, { useEffect, useState } from "react";
import { View, ScrollView, Alert, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { useStorageReservation } from "../../context/StorageReservationContext";
import ItemCard from "../../components/Storage/ItemCard";
import BottomButton from "../../components/ButtonComponents/BottomButton";

import { fetchStorageItems } from "../../utils/storageItems";

export default function ItemsSelection() {
  const router = useRouter();
  const { reservation, upsertItem, removeItem } = useStorageReservation();

  const [storageItems, setStorageItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch storage items from backend
  useEffect(() => {
    const getItems = async () => {
      const items = await fetchStorageItems();
      setStorageItems(items);
      setLoading(false);
    };
    getItems();
  }, []);

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
        image: item.image,
      });
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return reservation.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  };

  const totalAmount = calculateTotal();
  const hasItems = reservation.items.length > 0;

  const proceed = () => {
    if (!hasItems) {
      Alert.alert("No Items Selected", "Please select at least one item to continue.");
      return;
    }

    router.push("PickupDeliveryInfo");
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#b20000" />
        <Text style={{ marginTop: 10 }}>Loading items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {storageItems.map((item) => {
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

      {/* Sticky button with total price */}
      <View style={styles.stickyButton}>
        <BottomButton
          buttonText={hasItems ? `Continue - GH₵ ${totalAmount.toFixed(2)}` : "Continue"}
          onPressFunction={proceed}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },

  scroll: {
    padding: 16,
    paddingBottom: 160,
  },

  stickyButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
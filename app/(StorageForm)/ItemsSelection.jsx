"use client";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useStorageReservation } from "../../context/StorageReservationContext";
import StorageItemsSkeleton from "../../components/skeletons/storage/StorageItemsSkeleton";
import ItemCard from "../../components/cards/storage/ItemCard";
import { Button, EmptyState, FadeIn, PriceBar, StepHeader } from "../../components/ui";
import { money } from "../../utils/formatMoney";
import { colors, space, type } from "../../constants/theme";
import { STORAGE_TOTAL_STEPS, stepOf } from "../../constants/storageSteps";

import { fetchStorageItems } from "../../utils/storageItems";

// PriceBar pads the bottom inset itself; padding it here too doubled the gap on iOS.
const SCREEN_EDGES = ["top", "left", "right"];

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
      // Rehydrate only the selected ids and quantities with current catalog
      // metadata so stale prices/images cannot be submitted from the draft.
      reservation.items.forEach((selected) => {
        const currentItem = items.find((item) => item.id === selected.id);
        if (currentItem) {
          upsertItem({
            ...currentItem,
            quantity: selected.quantity,
          });
        } else {
          removeItem(selected.id);
        }
      });
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

  const count = reservation.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <SafeAreaView style={styles.screen} edges={SCREEN_EDGES}>
      <StepHeader step={stepOf("ItemsSelection")} total={STORAGE_TOTAL_STEPS} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ gap: space.xs }}>
          <Text style={type.display} accessibilityRole="header">What are you storing?</Text>
          <Text style={[type.body, { color: colors.textSecondary }]}>Tap a photo to see the size.</Text>
        </View>

        {loading ? (
          <StorageItemsSkeleton />
        ) : storageItems.length === 0 ? (
          <EmptyState icon="cube-outline" title="No items to show" body="We couldn't load storage items. Pull down or try again shortly." />
        ) : (
          <FadeIn>
            {storageItems.map((item, index) => {
              const selectedItem = getSelectedItem(item.id);
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  last={index === storageItems.length - 1}
                  selectedItem={selectedItem}
                  onSelect={() => toggleSelect(item)}
                  onIncrease={() => upsertItem({ ...selectedItem, quantity: selectedItem.quantity + 1 })}
                  onDecrease={() => {
                    if (selectedItem.quantity === 1) removeItem(item.id);
                    else upsertItem({ ...selectedItem, quantity: selectedItem.quantity - 1 });
                  }}
                />
              );
            })}
            <Text style={[type.caption, { color: colors.textSecondary, marginTop: space.md }]}>
              Prices are set by HostelHubb and checked again when you pay.
            </Text>
          </FadeIn>
        )}
      </ScrollView>

      <PriceBar
        amount={money(totalAmount)}
        caption={count ? `${count} item${count === 1 ? "" : "s"}` : "Nothing added yet"}
        action={<Button title="Continue" onPress={proceed} disabled={!hasItems} style={{ paddingHorizontal: space.xl }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl },
});

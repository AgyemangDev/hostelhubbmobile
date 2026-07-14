"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageReservationContext = createContext(null);
const STORAGE_KEY = "storage_reservation_draft";

const initialState = {
  items: [],
  pickupInfo: null,
  deliveryInfo: null,
  groupImage: null,
  // referral.status: 'pending' (not yet visited the referral step) |
  // 'confirmed' (a valid referrer was matched and picked) |
  // 'skipped' (user explicitly said "I wasn't referred")
  // ReviewPay should refuse to proceed while status is 'pending'.
  referral: { status: "pending", referrerId: null, code: null, firstname: null, surname: null },
};

export const StorageReservationProvider = ({ children }) => {
  const [reservation, setReservation] = useState(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setReservation({ ...initialState, ...JSON.parse(saved) });
      } catch (e) {
        console.log("Failed to load reservation", e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reservation));
  }, [reservation, hydrated]);

  const updateReservation = (updates) => {
    setReservation((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const upsertItem = (item) => {
    setReservation((prev) => {
      const exists = prev.items.find((i) => i.id === item.id);
      if (exists) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.id === item.id ? { ...i, ...item } : i
          ),
        };
      }
      return { ...prev, items: [...prev.items, item] };
    });
  };

  const removeItem = (id) => {
    setReservation((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const resetReservation = async () => {
    setReservation(initialState);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <StorageReservationContext.Provider
      value={{
        reservation,
        updateReservation,
        upsertItem,
        removeItem,
        resetReservation,
        hydrated,
      }}
    >
      {children}
    </StorageReservationContext.Provider>
  );
};

export const useStorageReservation = () => {
  const ctx = useContext(StorageReservationContext);
  if (!ctx) throw new Error("Wrap with StorageReservationProvider");
  return ctx;
};
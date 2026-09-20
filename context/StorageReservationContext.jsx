"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageReservationContext = createContext(null);
const STORAGE_KEY = "storage_reservation_draft";

const initialState = {
  items: [],
  school: null,
  pickupInfo: null,
  deliveryInfo: null,
  groupImage: null,
  // referral.status: 'pending' (not yet visited the referral step) |
  // 'confirmed' (a valid referrer was matched and picked) |
  // 'skipped' (user explicitly said "I wasn't referred")
  // ReviewPay should refuse to proceed while status is 'pending'.
  referral: { status: "pending", referrerId: null, code: null, firstname: null, surname: null },
};

const getPersistedReservation = (reservation) => ({
  school: reservation.school
    ? {
        id: reservation.school.id,
        name: reservation.school.name,
        code: reservation.school.code,
      }
    : null,
  // Persist only the user's choices. Names, prices, and catalog images are
  // refreshed from the current storage catalog when ItemsSelection loads.
  items: (reservation.items || []).map(({ id, quantity }) => ({ id, quantity })),
});

export const StorageReservationProvider = ({ children }) => {
  const [reservation, setReservation] = useState(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setReservation({
            ...initialState,
            school: parsed.school || null,
            items: Array.isArray(parsed.items) ? parsed.items : [],
          });
        }
      } catch (e) {
        console.log("Failed to load reservation", e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(getPersistedReservation(reservation)));
  }, [reservation, hydrated]);

  const updateReservation = (updates) => {
    setReservation((prev) => {
      if (Object.prototype.hasOwnProperty.call(updates, "school")) {
        const previousSchoolId = prev.school?.id;
        const nextSchoolId = updates.school?.id;

        if (previousSchoolId !== nextSchoolId) {
          return {
            ...prev,
            school: updates.school || null,
            pickupInfo: null,
            deliveryInfo: null,
            groupImage: null,
            referral: initialState.referral,
          };
        }
      }

      return {
        ...prev,
        ...updates,
      };
    });
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
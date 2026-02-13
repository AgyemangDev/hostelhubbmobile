// hooks/hubclippsContext/useCachedDraft.js
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DRAFT_STORAGE_KEY = "@hubclipps_draft";

export const useCachedDraft = (initialDraft) => {
  const [draft, setDraft] = useState(initialDraft);
  const [isLoading, setIsLoading] = useState(true);

  // Load draft from storage
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const savedDraft = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          setDraft(prev => ({ ...prev, ...JSON.parse(savedDraft) }));
        }
      } catch (err) {
        console.error("Error loading draft:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, []);

  // Auto-save draft whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const saveDraft = async () => {
        try {
          await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        } catch (err) {
          console.error("Error saving draft:", err);
        }
      };
      saveDraft();
    }
  }, [draft, isLoading]);

  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
      setDraft(initialDraft);
    } catch (err) {
      console.error("Error clearing draft:", err);
    }
  };

  return { draft, setDraft, clearDraft, isLoading };
};
// context/HubclippsContext.jsx
import React, { createContext, useMemo, useContext } from "react";
import { useHubclipps } from "../hooks/hubclippsContext/useHubclipps";
import { useHubclippsById } from "../hooks/hubclippsContext/useHubclippsById";
import { useHubclippsActions } from "../hooks/hubclippsContext/useHubclippsActions";
import { useCreateHubclipp } from "../hooks/hubclippsContext/useCreateHubclipp";
import { useCachedDraft } from "../hooks/hubclippsContext/useCachedDraft";
import { UserContext } from "./UserContext";

export const AddHubclippsContext = createContext();

const INITIAL_DRAFT = {
  poster_type: "student",
  student_id: null,
  hostel_name: "",
  category: "",
  room_type: "",
  price: "",
  institution: "",
  location: "",
  manager_or_porter_name: "",
  manager_or_porter_contact: "",
  latitude: null,
  longitude: null,
  amenities: [],
  description: "",
  video_url: "",
  front_image_url: "",
};

export const HubclippsProvider = ({ children }) => {
  const { userInfo } = useContext(UserContext);

  // --- Cached draft hook ---
  const { draft, setDraft, clearDraft, isLoading: isDraftLoading } = useCachedDraft({
    ...INITIAL_DRAFT,
    student_id: userInfo?.id || null,
  });

  // --- Hubclipps hooks ---
  const hubclippsState = useHubclipps();
  const byId = useHubclippsById();
  const actions = useHubclippsActions();
  const createHubclipp = useCreateHubclipp();

  const value = useMemo(() => ({
    draft,
    setDraft,
    clearDraft,
    isDraftLoading,
    createHubclipp, // exposed for components to call POST
    ...hubclippsState,
    ...byId,
    ...actions,
  }), [
    draft,
    isDraftLoading,
    hubclippsState,
    byId,
    actions,
    createHubclipp,
  ]);

  return (
    <AddHubclippsContext.Provider value={value}>
      {children}
    </AddHubclippsContext.Provider>
  );
};
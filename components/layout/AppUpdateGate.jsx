import React from "react";
import useAppUpdatePolicy from "../../hooks/useAppUpdatePolicy";
import UpdateRequiredScreen from "../feedback/update/UpdateRequiredScreen";
import UpdateAvailableSheet from "../sheets/update/UpdateAvailableSheet";

/**
 * Store-update prompts driven by the dashboard (Settings → App updates).
 * Separate from OTA updates in utils/update.js: those swap the JavaScript
 * silently; this asks for a new native build from the store.
 */
export default function AppUpdateGate() {
  const { status, message, dismiss } = useAppUpdatePolicy();
  return (
    <>
      <UpdateRequiredScreen visible={status === "required"} message={message} />
      <UpdateAvailableSheet visible={status === "available"} message={message} onDismiss={dismiss} />
    </>
  );
}

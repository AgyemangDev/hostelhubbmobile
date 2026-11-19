import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import useUniversityPrompt from "../../hooks/useUniversityPrompt";
import WhatsAppRequiredModal from "../feedback/profile/WhatsAppRequiredModal";
import UniversityPromptSheet from "../sheets/profile/UniversityPromptSheet";

/**
 * Asks signed-in students for missing details once their profile is
 * otherwise complete (new students give both on the Complete-your-profile
 * screen):
 *   - WhatsApp number: required, blocks the app until it's valid
 *   - University: optional, asked at most once a week until answered
 */
export default function ProfilePromptsGate() {
  const { user, userInfo, isProfileIncomplete, needsWhatsApp, patchUserData } = useContext(UserContext);
  const ready = Boolean(user && userInfo && !isProfileIncomplete);
  const university = useUniversityPrompt({
    enabled: ready && !userInfo?.institution?.trim(),
    blocked: needsWhatsApp,
  });

  if (!ready) return null;
  return (
    <>
      <WhatsAppRequiredModal
        visible={needsWhatsApp}
        currentNumber={userInfo.phone_number || ""}
        onSave={(phone_number) => patchUserData({ phone_number })}
      />
      <UniversityPromptSheet
        visible={university.visible}
        onSave={async (institution) => {
          await patchUserData({ institution });
          university.close();
        }}
        onDismiss={university.close}
      />
    </>
  );
}

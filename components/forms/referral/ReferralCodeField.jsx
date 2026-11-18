import React from "react";
import { View } from "react-native";
import { Button, FadeIn, Notice, TextField } from "../../ui";
import { space } from "../../../constants/theme";

/**
 * Enter a friend's referral code, check it, and show who gets the reward.
 * Used at payment for rooms, clips and storage.
 *
 * match:   { firstname, surname } once the code checks out
 * onClear: optional "Remove" action on the matched notice
 */
export default function ReferralCodeField({
  label = "Friend's referral code",
  placeholder = "e.g. KOFI26",
  code,
  onChangeCode,
  checking,
  match,
  error,
  onCheck,
  onClear,
  matchedBody = "Continue to confirm. You can still skip if this isn't right.",
}) {
  const name = match ? [match.firstname, match.surname].filter(Boolean).join(" ") : "";
  return (
    <View style={{ gap: space.sm }}>
      <TextField
        label={label}
        value={code}
        onChangeText={onChangeCode}
        autoCapitalize="characters"
        autoCorrect={false}
        placeholder={placeholder}
        returnKeyType="search"
        onSubmitEditing={onCheck}
        editable={!checking}
        error={error}
      />
      {match ? (
        <FadeIn>
          <Notice
            tone="success"
            title={`${name} will get the reward`}
            action={onClear ? <Button title="Remove" variant="ghost" size="sm" compact onPress={onClear} style={{ alignSelf: "flex-start" }} /> : null}
          >
            {matchedBody}
          </Notice>
        </FadeIn>
      ) : (
        <Button title="Check code" variant="secondary" onPress={onCheck} loading={checking} disabled={!code?.trim()} />
      )}
    </View>
  );
}

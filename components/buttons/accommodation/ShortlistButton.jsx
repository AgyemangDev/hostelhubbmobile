import React, { useContext } from "react";
import { View } from "react-native";
import { CountBadge, IconButton } from "../../ui";
import { UserContext } from "../../../context/UserContext";

/** Heart in the home header that opens the shortlist, with the saved count. */
export default function ShortlistButton({ onPress, variant = "tonal" }) {
  const { shortlist } = useContext(UserContext);
  const count = shortlist?.length || 0;
  return (
    <View>
      <IconButton icon="heart-outline" variant={variant} onPress={onPress} accessibilityLabel={count ? `Saved places, ${count}` : "Saved places"} />
      <CountBadge count={count} />
    </View>
  );
}

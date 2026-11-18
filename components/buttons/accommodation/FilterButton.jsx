import React from "react";
import { View } from "react-native";
import { CountBadge, IconButton } from "../../ui";
import { space } from "../../../constants/theme";

/** Round filter button beside the search bar, with the number of filters on. */
export default function FilterButton({ onPress, activeCount = 0 }) {
  return (
    <View style={{ marginLeft: space.xs }}>
      <IconButton
        icon="options-outline"
        variant="floating"
        onPress={onPress}
        accessibilityLabel={activeCount ? `Filters, ${activeCount} on` : "Filters"}
      />
      <CountBadge count={activeCount} tone="brand" max={9} />
    </View>
  );
}

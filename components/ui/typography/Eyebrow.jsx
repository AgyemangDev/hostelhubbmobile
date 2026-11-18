import React from "react";
import Text from "./Text";

/** Small uppercase label above a value ("PICKUP", "AVAILABLE BALANCE"). Same as <Text variant="eyebrow">. */
export default function Eyebrow({ children, style }) {
  return (
    <Text variant="eyebrow" style={style}>
      {children}
    </Text>
  );
}

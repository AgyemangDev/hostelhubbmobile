import React from "react";
import { Card, Skeleton } from "../../ui";
import { space } from "../../../constants/theme";

/** Placeholder shaped like a bus result while trips load. */
export default function BusCardSkeleton() {
  return (
    <Card style={{ gap: space.sm }} accessibilityLabel="Loading buses">
      <Skeleton variant="text" width="40%" height={22} />
      <Skeleton variant="text" width="75%" height={14} />
      <Skeleton variant="text" width="55%" height={14} />
    </Card>
  );
}

import React from "react";
import { EmptyState } from "../../ui";

/** No trips match the route or day the student searched. */
export default function BusEmptyState() {
  return <EmptyState icon="bus-outline" title="No buses on this route yet" body="Try another day or route. New trips are added close to the break." />;
}

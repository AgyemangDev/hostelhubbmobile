import React from "react";
import PillTabs from "./PillTabs";
import UnderlineTabs from "./UnderlineTabs";
import SegmentedTabs from "./SegmentedTabs";

const variants = { pill: PillTabs, underline: UnderlineTabs, segmented: SegmentedTabs };

/**
 * The one tab control for the app.
 *
 * options: [{ value, label, icon?, badge? }]
 * variant: pill (default; filters and screen-level switches)
 *          underline (sections of a page)
 *          segmented (2-4 choices inside a form)
 * tone:    light (default) | dark (over video or photos)   — pill, underline
 * stretch: tabs share the full width                       — pill, underline
 * scroll:  scroll sideways when tabs don't fit             — pill
 */
export default function Tabs({ variant = "pill", ...props }) {
  const Component = variants[variant] || PillTabs;
  return <Component {...props} />;
}

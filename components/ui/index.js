// components/ui
//
// HostelHubb's design system: React Native Paper components themed with
// constants/theme.js (see constants/paperTheme.js), each wrapped once here
// with a `variant` prop so every screen uses the same button, card, tab and
// field. Screens and feature components import from "components/ui" — never
// straight from react-native-paper, and never by re-styling a
// TouchableOpacity in a screen.
//
//   buttons/     Button, IconButton, PickerTile, LabeledIconButton
//   cards/       Card, StatCard, FeatureCard
//   chips/       Chip, ChipGroup
//   badges/      StatusPill, CountBadge, Rating
//   tabs/        Tabs (variant: pill | underline | segmented), TabPanels
//   inputs/      TextField, SelectField, QuantityStepper, ToggleRow, CheckboxRow, SearchField, RangeSlider
//   lists/       ListRow, DetailRow, MetaRow
//   headers/     ScreenHeader, StepHeader, SectionHeader, StackHeader
//   bars/        PriceBar
//   sheets/      Sheet
//   feedback/    Notice, EmptyState, LoadingOverlay
//   skeletons/   Skeleton
//   progress/    Timeline
//   layout/      Section, Divider
//   links/       ExternalLink, TermsLink
//   icons/       Icon
//   typography/  Text, Eyebrow
//   motion/      FadeIn, PressableScale
//   provider/    DesignSystemProvider (mounted once in utils/providers)
//
// Feature-specific pieces built from these live type-first in
// components/<type>/<feature>/ (e.g. components/cards/bookings/BookingCard).

export { default as Button } from "./buttons/Button";
export { default as IconButton } from "./buttons/IconButton";
export { default as PickerTile } from "./buttons/PickerTile";
export { default as LabeledIconButton } from "./buttons/LabeledIconButton";

export { default as Card } from "./cards/Card";
export { default as StatCard } from "./cards/StatCard";
export { default as FeatureCard } from "./cards/FeatureCard";

export { default as Chip } from "./chips/Chip";
export { default as ChipGroup } from "./chips/ChipGroup";

export { default as StatusPill } from "./badges/StatusPill";
export { default as CountBadge } from "./badges/CountBadge";
export { default as Rating } from "./badges/Rating";

export { default as Tabs } from "./tabs/Tabs";
export { default as TabPanels } from "./tabs/TabPanels";

export { default as TextField } from "./inputs/TextField";
export { default as SelectField } from "./inputs/SelectField";
export { default as QuantityStepper } from "./inputs/QuantityStepper";
export { default as ToggleRow } from "./inputs/ToggleRow";
export { default as CheckboxRow } from "./inputs/CheckboxRow";
export { default as SearchField } from "./inputs/SearchField";
export { default as RangeSlider } from "./inputs/RangeSlider";

export { default as ListRow } from "./lists/ListRow";
export { default as DetailRow } from "./lists/DetailRow";
export { default as MetaRow } from "./lists/MetaRow";

export { default as ScreenHeader } from "./headers/ScreenHeader";
export { default as StepHeader } from "./headers/StepHeader";
export { default as SectionHeader } from "./headers/SectionHeader";
export { default as StackHeader } from "./headers/StackHeader";

export { default as PriceBar } from "./bars/PriceBar";
export { default as Sheet } from "./sheets/Sheet";

export { default as Notice } from "./feedback/Notice";
export { default as EmptyState } from "./feedback/EmptyState";
export { default as LoadingOverlay } from "./feedback/LoadingOverlay";

export { default as Skeleton } from "./skeletons/Skeleton";
export { default as Timeline } from "./progress/Timeline";

export { default as Section } from "./layout/Section";
export { default as Divider } from "./layout/Divider";
export { default as KeyboardView } from "./layout/KeyboardView";

export { ExternalLink } from "./links/ExternalLink";
export { default as TermsLink } from "./links/TermsLink";

export { default as Icon } from "./icons/Icon";
export { default as Text } from "./typography/Text";
export { default as Eyebrow } from "./typography/Eyebrow";

export { default as FadeIn } from "./motion/FadeIn";
export { default as PressableScale } from "./motion/PressableScale";

export { default as DesignSystemProvider } from "./provider/DesignSystemProvider";

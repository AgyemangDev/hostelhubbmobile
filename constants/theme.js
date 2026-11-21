// constants/theme.js
//
// HostelHubb design tokens. One source for colour, type, spacing, radius and
// elevation so every screen reads as the same product. The website's
// tailwind.config.js uses the same brand values.
//
// Principles (see the "Design system" board on the design canvas):
//   - Photos and content carry the colour; the UI stays quiet (ink on white).
//   - One accent: brand green for the primary action on a screen, and for
//     "selected" states. Never two green buttons side by side.
//   - Status colours are for status only (amber = needs action, red = problem).
//   - Prices are always the full price the student pays, fees included.

export const palette = {
  green50: "#EFFAF7",
  green100: "#DAF6ED",
  green600: "#0F8A63",
  green700: "#0B6E4F", // brand
  green800: "#07543C",
  green900: "#053E2C",

  ink: "#1C1917",
  ink2: "#44403C",
  ink3: "#57534E", // smallest text colour that still passes contrast on white
  line: "#E7E5E4",
  lineStrong: "#D6D3D1",
  fill: "#F5F5F4",
  canvas: "#FAFAF9",
  white: "#FFFFFF",

  amber50: "#FEF6E0",
  amber800: "#5C4308",
  red50: "#FDECEC",
  red700: "#B42318",
  gold: "#C89116",
  whatsapp: "#25D366",
};

export const colors = {
  brand: palette.green700,
  brandPressed: palette.green800,
  brandSoft: palette.green50,
  onBrand: palette.white,

  text: palette.ink,
  textSecondary: palette.ink3,
  textMuted: palette.ink3,
  textInverse: palette.white,

  background: palette.white,
  surface: palette.white,
  surfaceSunken: palette.canvas,
  fill: palette.fill,
  border: palette.line,
  borderStrong: palette.lineStrong,

  warningBg: palette.amber50,
  warningText: palette.amber800,
  dangerBg: palette.red50,
  danger: palette.red700,
  successBg: palette.green50,
  success: palette.green800,
  rating: palette.ink,
  whatsapp: palette.whatsapp,
};

export const space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };

// System fonts by default. To ship the brand face, add Manrope with
// expo-font in app/_layout.jsx and set `family` below.
const family = undefined;
export const type = {
  display: { fontFamily: family, fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: -0.4 },
  title: { fontFamily: family, fontSize: 22, lineHeight: 28, fontWeight: "800", letterSpacing: -0.2 },
  heading: { fontFamily: family, fontSize: 17, lineHeight: 22, fontWeight: "700" },
  body: { fontFamily: family, fontSize: 15, lineHeight: 21, fontWeight: "500" },
  bodyStrong: { fontFamily: family, fontSize: 15, lineHeight: 21, fontWeight: "700" },
  caption: { fontFamily: family, fontSize: 13, lineHeight: 18, fontWeight: "500" },
  label: { fontFamily: family, fontSize: 12, lineHeight: 16, fontWeight: "700", letterSpacing: 0.3 },
  price: { fontFamily: family, fontSize: 17, lineHeight: 22, fontWeight: "800" },
};

export const elevation = {
  // Booking cards in a list (storage, paid rooms): a light lift on white.
  listCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    shadowColor: "#1C1917",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  floating: {
    shadowColor: "#1C1917",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
};

// Text and icons drawn straight on top of video. There is no dark band behind
// them (the video is full screen), so the shadow alone keeps them readable on
// bright or white frames.
export const onVideo = {
  text: { color: "#FFFFFF", textShadowColor: "rgba(0,0,0,0.75)", textShadowRadius: 6, textShadowOffset: { width: 0, height: 1 } },
  // Translucent backing for round icon buttons over video.
  button: { backgroundColor: "rgba(0,0,0,0.32)" },
};

export const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };
export const minTouch = 44;

const theme = { palette, colors, space, radius, type, elevation, hitSlop, minTouch };
export default theme;

// Motion (see the "Sheets, tabs and motion" board). Three durations, one
// curve, nothing bounces. Respect the OS reduce-motion setting.
export const motion = {
  fast: 120, // press, toggle, chip
  base: 200, // tabs, progress, fade
  slow: 280, // sheets, screen push
  pressScale: 0.97,
};

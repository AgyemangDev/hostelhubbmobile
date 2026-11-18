// constants/paperTheme.js
//
// Maps the HostelHubb tokens in constants/theme.js onto a React Native Paper
// (Material 3) theme, so every Paper component the app uses comes out in our
// colours: brand green for the main action, ink for "selected", quiet greys
// for everything else.
import { MD3LightTheme } from "react-native-paper";
import { colors, palette } from "./theme";

const flat = colors.surface;

export const paperTheme = {
  ...MD3LightTheme,
  // Paper multiplies this for each component (buttons x5, cards x3). Our
  // wrappers set exact radii from theme.radius, this is only the fallback.
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.brand,
    onPrimary: colors.onBrand,
    primaryContainer: palette.green100,
    onPrimaryContainer: palette.green900,

    // "Selected" is ink, never green, so green always means "go".
    secondary: colors.text,
    onSecondary: colors.textInverse,
    secondaryContainer: colors.text,
    onSecondaryContainer: colors.textInverse,

    tertiary: palette.gold,
    onTertiary: colors.textInverse,

    background: colors.background,
    onBackground: colors.text,
    surface: colors.surface,
    onSurface: colors.text,
    surfaceVariant: colors.fill,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.borderStrong,
    outlineVariant: colors.border,

    error: colors.danger,
    onError: colors.textInverse,
    errorContainer: colors.dangerBg,
    onErrorContainer: colors.danger,

    backdrop: "rgba(12,10,9,0.45)",

    // Material tints raised surfaces with the primary colour. We want white.
    elevation: { level0: "transparent", level1: flat, level2: flat, level3: flat, level4: flat, level5: flat },
  },
};

export default paperTheme;

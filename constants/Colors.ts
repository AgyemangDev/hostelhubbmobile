// `button`/`background`/`darkest`/`placeholder`/`logoShadow` were a
// maroon/dark-red brand palette (despite the confusing names — `background`
// in particular was actually used as the app's primary/brand accent in 135+
// places: tab bar active state, button fills and text, borders, icons — not
// literally a screen background). Rebranded to teal, keeping the same keys
// so every existing consumer picks up the new color automatically.
const COLORS = {
  light: "#3498db",
  Dark: "#048547",
  button: "#0D9488",
  background: "#0F6E56",
  placeholder: "#7FA8A0",
  primary: "#0364A5",

  darkest: "#0B5449",
  gold: "#f2c94c",
  teal: "#0F6E56",
  success: "#048547",
  link: "#0364A5",

  white: "#FFFFFF",
  textDark: "#333333",
  textMuted: "#555555",
  shadow: "rgba(0,0,0,0.1)",
  logoShadow: "rgba(13, 148, 136, 0.2)",
};

export default COLORS;
import { Platform } from "react-native";

// Shared vocabulary for every ticket-style card in the payment flow.
export const TICKET = {
  ink: "#161A2B",
  slate: "#6B7280",
  line: "#E4E7F0",
  amber: "#F5A524",
  amberDeep: "#B9770E",
  canvas: "#F3F4F8",
};

// Monospace for anything that's data — times, seat numbers, money — so it
// reads like it came off a ticket printer rather than a settings screen.
export const MONO = Platform.select({ ios: "Courier", android: "monospace", default: "monospace" });

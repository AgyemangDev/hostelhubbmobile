// styles.js

import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../../constants/Colors";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
heroBackground: {
  width: "100%",
  aspectRatio: 1,
  justifyContent: "flex-end", // keeps content at the bottom
},
  heroOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100%",
    justifyContent: "flex-end",
    padding: 20,
  },
  heroContent: {
    marginBottom: 40,
  },
  tagline: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 12,
    lineHeight: 42,
  },
  heroDescription: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
    maxWidth: "90%",
  },

  // Intro Section
  introSection: {
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.background,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
  },

  // Add these styles to your existing Styles.js file

guaranteeSection: {
  backgroundColor: '#f8f9fa',
  borderRadius: 12,
  marginTop: 20,
  marginBottom: 20,
    width: '100%',
  borderWidth: 1,
  borderColor: '#e9ecef',
},
guaranteeTitle: {
  paddingHorizontal:10,
  fontSize: 18,
  fontWeight: '700',
  color: '#2c3e50',
  textAlign: 'center',
  marginBottom: 15,
},
guaranteeItems: {
    paddingHorizontal:10,
  marginBottom: 15,
},
guaranteeItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
  paddingVertical: 4,
},
guaranteeEmoji: {
  fontSize: 20,
  marginRight: 12,
  width: 24,
  textAlign: 'center',
},
guaranteeText: {
  
  fontSize: 16,
  color: '#34495e',
  fontWeight: '600',
  flex: 1,
},
guaranteeSubtext: {
    paddingHorizontal:10,
  fontSize: 14,
  color: '#7f8c8d',
  textAlign: 'center',
  fontStyle: 'italic',
  lineHeight: 20,
},
  // Features Section
  featuresSection: {
    padding: 24,
    backgroundColor: "#f8f9fa",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24,
  },

  // How It Works Section
  howItWorksSection: {
    padding: 24,
    backgroundColor: "#ffffff",
  },
  stepsContainer: {
    marginTop: 8,
  },
  stepCard: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  stepNumberContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumber: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#666666",
  },
  // CTA Section
  ctaSection: {
    paddingHorizontal: 24,
    paddingTop:10,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.background,
    marginBottom: 12,
    textAlign: "center",
  },
  ctaDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  ctaButtonsContainer: {
    width: "100%",
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#0070f3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  secondaryButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "600",
  },

  // Footer
  footer: {
    padding: 24,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#999999",
  },
});

export default styles;

import { StyleSheet, Platform, Dimensions } from "react-native";
import COLORS from "../../constants/Colors";

const { height } = Dimensions.get("window");
const headerMarginTop = height * 0.05; // 5% of screen height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
    flexGrow: 1, // Ensures the scrollable content covers full height
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#9a0b0d",
    textAlign: "center",
    marginBottom: 24,
    marginTop: headerMarginTop, // Responsive top margin
  },
  gridContainer: {
    flexDirection: "column",
    marginHorizontal: 15,
  },
  profileSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.background,
  },
  profileSub: {
    fontSize: 14,
    color: COLORS.background,
    paddingTop: 2,
  },
  adContainer: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
    alignItems: "center", // Center items horizontally
  },
  adContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, // Space between content and link
    justifyContent: "space-between", // Distribute space evenly
    width: "100%", // Ensure it takes full width
  },
  adImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
  },
  adTextContainer: {
    flex: 1,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.background,
    marginBottom: 4,
  },
  adDescription: {
    fontSize: 14,
    color: "#555",
  },
  linksContainer: {
    justifyContent: "space-between",
  },
  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  linkDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkLabel: {
    fontSize: 18,
    marginLeft: 16,
    color: COLORS.background,
  },
  linkDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9a0b0d",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center",
  },
  linkButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
  },
  time: {
    textAlign: "center",
    paddingTop: 20,
    fontWeight: "bold",
    color: "#656565",
  },
  image: {
    width: Platform.OS === "ios" ? 60 : 55,
    height: Platform.OS === "ios" ? 60 : 55,
    borderRadius: 30,
    marginRight: 16,
  },
});

export default styles;

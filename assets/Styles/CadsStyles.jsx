// CadsStyles.js
import { StyleSheet } from "react-native";
import COLORS from "../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#d3d3d3",
    width: "100%",
    position: "absolute",
    top: 10,
  },
  img: {
    height: 120,
    width: 150,
    borderRadius: 10,
  },
  cardAlign: {
    flexDirection: "row",
    marginBottom: 10,
  },
  textAlign: {
    marginLeft: 12,
    marginTop: 8,
    flex: 1,
    justifyContent: "space-between",
  },
  txt: {
    fontSize: 16,
    fontWeight: "bold",
  },
  locText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  reviewAndViewsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  reviewCountText: {
    fontSize: 12,
    color: COLORS.grey,
  },
  viewsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  eyeIcon: {
    marginRight: 5,
  },
  viewsText: {
    fontSize: 12,
    color: COLORS.grey,
  },
  availabilityContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  available: {
    backgroundColor: "green",
  },
  full: {
    backgroundColor: COLORS.background,
    width: 75,
    alignItems: "center",
  },
  availabilityText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  availabilityAlignContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  starIcon: {
    marginBottom: 10,
  },
});

export default styles;

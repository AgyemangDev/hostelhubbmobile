import { StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.fill,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 15,
    lineHeight: 24,
  },
  input: {
    height: 150,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  linkDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  linkText: {
    color: colors.textInverse,
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    lineHeight: 22,
    backgroundColor: "#f1f5f8",
    borderRadius: 8,
    padding: 12,
  },
});

export default styles;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    lineHeight: 24,
  },
  input: {
    height: 150,
    borderColor: "#ccc",
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
    backgroundColor: "#9a0b0d",
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
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
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

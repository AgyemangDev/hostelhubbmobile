import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../constants/Colors";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#2c3e50",
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  progressText: {
    fontSize: 12,
    color: "#000",
  },
  activeProgressText: {
    color: COLORS.background,
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#ecf0f1",
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2c3e50",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: "#34495e",
  },
  helperText: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  datePickerButton: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  checkboxContainer: {
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.background,
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#34495e",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  termsContainer: {
    marginVertical: 20,
  },
  reviewSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    paddingBottom: 15,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  reviewRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f8c8d",
    width: "40%",
  },
  reviewValue: {
    fontSize: 14,
    color: "#34495e",
    flex: 1,
  },
  confirmationContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkmarkLarge: {
    color: "#fff",
    fontSize: 40,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2c3e50",
  },
  confirmationText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#34495e",
    lineHeight: 22,
  },
  confirmationDetails: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 30,
    color: "#7f8c8d",
  },
  newReservationButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    alignItems: "center",
  },
});

export default styles;

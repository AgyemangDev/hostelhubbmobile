export const validatePersonalInfoForm = ({
  firstName,
  surname,
  phoneNumber,
  gender,
}) => {
  if (!firstName?.trim()) {
    return "First name is required";
  }

  if (!surname?.trim()) {
    return "Surname is required";
  }

  if (!phoneNumber?.trim()) {
    return "Phone number is required";
  }

  if (!gender) {
    return "Please select a gender";
  }

  return null; // no errors
};

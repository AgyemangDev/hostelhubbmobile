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

  // Remove spaces just in case user pasted formatted number
  const cleanedPhone = phoneNumber.replace(/\s+/g, "");

  // Must be exactly 10 digits
  const phoneRegex = /^\d{10}$/;

  if (!phoneRegex.test(cleanedPhone)) {
    return "Phone number must be exactly 10 digits";
  }

  if (!gender) {
    return "Please select a gender";
  }

  return null;
};
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateForm = (email, password, confirmPassword) => {
  if (!email) {
    return "Email is required";
  }
  
  if (!validateEmail(email)) {
    return "Invalid email address";
  }
  
  if (!password) {
    return "Password is required";
  }
  
  if (confirmPassword !== undefined && !confirmPassword) {
    return "Confirm Password is required";
  }
  
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return "Passwords do not match";
  }
  
  return null; // No errors
};
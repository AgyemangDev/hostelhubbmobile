// utils/validationUtils.js

export const ValidateHubclippsInfo = (data) => {
  if (!data.hostel_name || data.hostel_name.trim() === "") {
    return ["Hostel Name is required"];
  }
  if (!data.category || data.category.trim() === "") {
    return ["Category is required"];
  }
  if (!data.room_type || data.room_type.trim() === "") {
    return ["Room Type is required"];
  }
  if (!data.price || data.price.trim() === "") {
    return ["Price is required"];
  }
  if (!/^\d+$/.test(data.price)) {
    return ["Price must be a number"];
  }
  if (!data.institution || data.institution.trim() === "") {
    return ["Institution is required"];
  }
  if (!data.location || data.location.trim() === "") {
    return ["Location is required"];
  }
  return []; // no errors
};

export const validateManager = (data) => {
  if (!data.manager_or_porter_name || data.manager_or_porter_name.trim() === "") {
    return ["Manager/Porter Name is required"];
  }
  if (!data.manager_or_porter_contact || data.manager_or_porter_contact.trim() === "") {
    return ["Manager/Porter Contact is required"];
  }
  if (!/^\d{10}$/.test(data.manager_or_porter_contact)) {
    return ["Manager/Porter Contact must be exactly 10 digits"];
  }
  if (!data.latitude || !data.longitude) {
    return ["Location coordinates are required"];
  }
  return [];
};


export const validateMedia = (data) => {
  if (!data.images || data.images.length === 0) {
    return ["At least one image is required"];
  }
  return [];
};

// validationFormStorage.js

export const validatePickupDeliveryForm = ({ pickupInfo, deliveryInfo }) => {
  // Validate pickup date
  if (!pickupInfo?.date) {
    return "Please select a pickup date";
  }

  // Validate delivery date
  if (!deliveryInfo?.date) {
    return "Please select a delivery date";
  }

  // Validate pickup location - must have area
  if (!pickupInfo?.area) {
    return "Please select a pickup location";
  }

  // If pickup is off-campus, validate off-campus details
  if (pickupInfo.area === "Off Campus") {
    if (!pickupInfo.offCampusArea) {
      return "Please select an off-campus area for pickup";
    }
    if (!pickupInfo.hostel?.trim()) {
      return "Please enter your hostel name for pickup";
    }
  }

  // Validate delivery location - must have area
  if (!deliveryInfo?.area) {
    return "Please select a delivery location";
  }

  // If delivery is off-campus, validate off-campus details
  if (deliveryInfo.area === "Off Campus") {
    if (!deliveryInfo.offCampusArea) {
      return "Please select an off-campus area for delivery";
    }
    if (!deliveryInfo.hostel?.trim()) {
      return "Please enter your hostel name for delivery";
    }
  }

  return null; // All validations passed
};
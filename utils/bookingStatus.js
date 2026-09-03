// utils/bookingStatus.js
export const getStatusMeta = (pickupStatus, deliveryStatus) => {
  const ps = pickupStatus?.toLowerCase() || "";
  const ds = deliveryStatus?.toLowerCase() || "";

  if (ds === "delivered") {
    return {
      label: "Delivered",
      bg: "#ECFDF5",
      border: "#A7F3D0",
      color: "#047857",
      icon: "check-circle-outline",
    };
  }

  if (ps === "picked_up" && ds === "pending") {
    return {
      label: "Items Picked Up",
      bg: "#EFF6FF",
      border: "#BFDBFE",
      color: "#1D4ED8",
      icon: "car-outline",
    };
  }

  if (ps === "pending") {
    return {
      label: "Awaiting Pickup",
      bg: "#FEF3C7",
      border: "#FDE68A",
      color: "#92400E",
      icon: "time-outline",
    };
  }

  // fallback
  return {
    label: "Processing",
    bg: "#F3F4F6",
    border: "#E5E7EB",
    color: "#374151",
    icon: "information-outline",
  };
};
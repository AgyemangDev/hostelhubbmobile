// utils/bookingStatus.js

/**
 * Get status metadata for booking status display
 * @param {string} status - The booking status
 * @returns {Object} Status metadata including label, colors, and icon
 */
export const getStatusMeta = (status) => {
  const normalizedStatus = status?.toLowerCase().trim();

  switch (normalizedStatus) {
    case "order_placed":
    case "pending":
      return {
        label: "Awaiting Pickup",
        bg: "#FEF3C7",
        border: "#FDE68A",
        color: "#92400E",
        icon: "clock-outline",
      };

    case "picked_up":
    case "in_transit":
      return {
        label: "Awaiting Delivery",
        bg: "#EFF6FF",
        border: "#BFDBFE",
        color: "#1D4ED8",
        icon: "truck-delivery-outline",
      };

    case "delivered":
    case "completed":
      return {
        label: "Delivered",
        bg: "#ECFDF5",
        border: "#A7F3D0",
        color: "#047857",
        icon: "check-circle-outline",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        bg: "#FEE2E2",
        border: "#FECACA",
        color: "#991B1B",
        icon: "close-circle-outline",
      };

    case "confirmed":
      return {
        label: "Confirmed",
        bg: "#D1FAE5",
        border: "#A7F3D0",
        color: "#065F46",
        icon: "check-circle-outline",
      };

    default:
      return {
        label: "Processing",
        bg: "#F3F4F6",
        border: "#E5E7EB",
        color: "#374151",
        icon: "information-outline",
      };
  }
};

/**
 * Get simple status color (for text or borders)
 * @param {string} status - The booking status
 * @returns {string} Hex color code
 */
export const getStatusColor = (status) => {
  const meta = getStatusMeta(status);
  return meta.color;
};

/**
 * Get status background color
 * @param {string} status - The booking status
 * @returns {string} Hex color code
 */
export const getStatusBackgroundColor = (status) => {
  const meta = getStatusMeta(status);
  return meta.bg;
};

/**
 * Get status border color
 * @param {string} status - The booking status
 * @returns {string} Hex color code
 */
export const getStatusBorderColor = (status) => {
  const meta = getStatusMeta(status);
  return meta.border;
};

/**
 * Get status label
 * @param {string} status - The booking status
 * @returns {string} Human-readable label
 */
export const getStatusLabel = (status) => {
  const meta = getStatusMeta(status);
  return meta.label;
};

/**
 * Get status icon name (for MaterialCommunityIcons)
 * @param {string} status - The booking status
 * @returns {string} Icon name
 */
export const getStatusIcon = (status) => {
  const meta = getStatusMeta(status);
  return meta.icon;
};
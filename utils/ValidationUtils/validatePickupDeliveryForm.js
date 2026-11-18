// validatePickupDeliveryForm.js
//
// getPickupDeliveryIssues returns EVERY missing field, in screen order, as
// { key, label }. `key` is "<pickup|delivery>.<field>" so the screen can
// highlight that field and scroll to it; `label` is the human wording used
// in the alert ("Pickup room number").

const locationIssues = (info, prefix, noun) => {
  const issues = [];
  if (!info?.area) {
    issues.push({ key: `${prefix}.area`, label: `${noun} spot` });
    return issues;
  }
  if (info.area === "Off Campus") {
    if (!info.offCampusArea) issues.push({ key: `${prefix}.offCampusArea`, label: `${noun} off-campus area` });
    if (!info.hostel?.trim()) issues.push({ key: `${prefix}.hostel`, label: `${noun} hostel name` });
  }
  if (!info.room?.trim()) issues.push({ key: `${prefix}.room`, label: `${noun} room number` });
  return issues;
};

export const getPickupDeliveryIssues = ({ pickupInfo, deliveryInfo }) => {
  const issues = [];

  if (!pickupInfo?.date) issues.push({ key: "pickup.date", label: "Pickup day" });
  issues.push(...locationIssues(pickupInfo, "pickup", "Pickup"));

  if (!deliveryInfo?.date) issues.push({ key: "delivery.date", label: "Delivery day" });
  // Delivery location can be deferred if the user doesn't know their next
  // hostel yet — skip location/room checks when decideLater is set.
  if (!deliveryInfo?.decideLater) issues.push(...locationIssues(deliveryInfo, "delivery", "Delivery"));

  return issues;
};

/** Legacy single-message form (used by StorageEdit). Null when valid. */
export const validatePickupDeliveryForm = (form) => {
  const [first] = getPickupDeliveryIssues(form);
  return first ? `Please add your ${first.label.toLowerCase()}` : null;
};

// Complaint categories and statuses (same keys as the backend).
export const COMPLAINT_CATEGORIES = [
  { value: "maintenance", label: "Repairs", icon: "construct-outline" },
  { value: "water", label: "Water", icon: "water-outline" },
  { value: "electricity", label: "Electricity", icon: "flash-outline" },
  { value: "security", label: "Security", icon: "shield-outline" },
  { value: "cleanliness", label: "Cleanliness", icon: "sparkles-outline" },
  { value: "noise", label: "Noise", icon: "volume-high-outline" },
  { value: "internet", label: "Internet", icon: "wifi-outline" },
  { value: "billing", label: "Billing", icon: "receipt-outline" },
  { value: "staff", label: "Staff", icon: "people-outline" },
  { value: "other", label: "Other", icon: "help-circle-outline" },
];

export const COMPLAINT_STATUS = {
  open: { label: "Sent", tone: "warning", hint: "The hostel has been told." },
  in_progress: { label: "Being fixed", tone: "brand", hint: "The hostel is working on it." },
  resolved: { label: "Resolved", tone: "success", hint: "Marked fixed. Reply if it isn't." },
  dismissed: { label: "Closed", tone: "neutral", hint: "Closed by the hostel. Reply to reopen." },
};

// Order of the storage booking steps, for the "Step x of y" header.
export const STORAGE_STEPS = ["SchoolSelection", "ItemsSelection", "PickupDeliveryInfo", "ImageUpload", "ReferralStep", "ReviewPay"];
export const stepOf = (name) => STORAGE_STEPS.indexOf(name) + 1;
export const STORAGE_TOTAL_STEPS = STORAGE_STEPS.length;

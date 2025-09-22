export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const [day, month, year] = dateStr.includes("/") ? dateStr.split("/") : [null, null, null];
  return day && month && year ? `${day}-${month}-${year}` : dateStr;
};

export const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split(/[-/]/);
  return new Date(year, month - 1, day);
};

export const canEditDeliveryLocation = (deliveryDate) => {
  if (!deliveryDate) return false;
  
  const deliveryDateObj = parseDate(deliveryDate);
  const currentDate = new Date();
  const weekBeforeDelivery = new Date(deliveryDateObj);
  weekBeforeDelivery.setDate(weekBeforeDelivery.getDate() - 7);
  
  return currentDate < weekBeforeDelivery;
};
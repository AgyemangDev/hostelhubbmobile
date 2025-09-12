export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getShortLocation = (address) => {
  const parts = address.split(', ');
  return parts.length >= 2 ? `${parts[0]}, ${parts[parts.length - 1]}` : address;
};
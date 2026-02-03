export const formatDate = (isoDate) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  return `${date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}, ${date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })}`;
};
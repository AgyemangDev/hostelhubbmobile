export const normalizeFirebaseImageUrl = (url) => {
  if (!url) return null;
  if (url.includes("%2F")) return url;

  try {
    const [base, query] = url.split("?");
    const objectPath = base.split("/o/")[1];
    if (!objectPath) return url;

    return `${base.split("/o/")[0]}/o/${encodeURIComponent(objectPath)}?${query}`;
  } catch {
    return url;
  }
};
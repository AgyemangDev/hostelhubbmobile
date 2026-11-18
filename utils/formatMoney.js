/** "GH₵ 1,250.00". Prices are always the full amount the student pays. */
export const money = (n, { decimals = 2 } = {}) =>
  `GH₵ ${Number(n || 0).toLocaleString("en-GH", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

export default money;

export const formatPrice = (price) => {
  const num = parseFloat(price);
  if (isNaN(num)) return '$0.00';
  return `$${num.toFixed(2)}`;
};

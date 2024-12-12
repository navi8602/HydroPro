export const calculateDaysRemaining = (endDate: string): number => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateRentalPrice = (
  months: number,
  basePrice: number
): { price: number; discount: number } => {
  const discounts = {
    3: 0,
    6: 0.1, // 10% discount
    12: 0.2 // 20% discount
  };

  const discount = discounts[months as keyof typeof discounts] || 0;
  const totalPrice = basePrice * months;
  const discountedPrice = totalPrice * (1 - discount);

  return {
    price: discountedPrice,
    discount: totalPrice - discountedPrice
  };
};
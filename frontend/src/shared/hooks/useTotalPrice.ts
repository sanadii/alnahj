/**
 * Hook to calculate total price from service details
 * @param serviceDetails Array of services with price field
 * @returns Total price as formatted string
 */
const useTotalPrice = (serviceDetails: Array<{ price: string | number }>) => {
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    serviceDetails.forEach((serviceItem) => {
      totalPrice += parseFloat(serviceItem.price as string) || 0;
    });
    return totalPrice.toFixed(2);
  };

  return calculateTotalPrice();
};

export default useTotalPrice;

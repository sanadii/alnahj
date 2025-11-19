/**
 * Hook to calculate total time duration from service details
 * @param serviceDetails Array of services with duration field (in minutes)
 * @returns Formatted time string (HH:MM)
 */
const useTotalTime = (serviceDetails: Array<{ duration: string | number }>) => {
  const calculateTotalTime = () => {
    let totalTimeDuration = 0;
    serviceDetails.forEach((serviceItem) => {
      totalTimeDuration += parseFloat(serviceItem.duration as string) || 0;
    });

    const hours = Math.floor(totalTimeDuration / 60);
    const minutes = totalTimeDuration % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return calculateTotalTime();
};

export default useTotalTime;

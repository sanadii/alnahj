/**
 * Shared calculation utilities
 *
 * Used for: Financial calculations, percentages, statistics, and metrics
 * Provides reusable calculation functions across client tabs and components
 */

// ======================== BASIC CALCULATIONS ========================

/**
 * Safely parses a value to a number
 * @param value - Value to parse (string, number, or null)
 * @param defaultValue - Default if parsing fails (default: 0)
 * @returns Parsed number
 *
 * @example
 * toNumber('123.45')
 * // Returns: 123.45
 *
 * toNumber('invalid', 10)
 * // Returns: 10
 */
export function toNumber(value: string | number | null | undefined, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Rounds a number to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 *
 * @example
 * round(123.456, 2)
 * // Returns: 123.46
 */
export function round(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Clamps a number between min and max
 * @param value - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 *
 * @example
 * clamp(150, 0, 100)
 * // Returns: 100
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ======================== PERCENTAGE CALCULATIONS ========================

/**
 * Calculates percentage
 * @param value - Partial value
 * @param total - Total value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Percentage (0-100)
 *
 * @example
 * percentage(25, 100)
 * // Returns: 25.00
 *
 * percentage(1, 3, 1)
 * // Returns: 33.3
 */
export function percentage(value: number, total: number, decimals: number = 2): number {
  if (total === 0) return 0;
  return round((value / total) * 100, decimals);
}

/**
 * Calculates value from percentage
 * @param percentage - Percentage value (0-100)
 * @param total - Total value
 * @returns Calculated value
 *
 * @example
 * fromPercentage(20, 500)
 * // Returns: 100
 */
export function fromPercentage(percentage: number, total: number): number {
  return (percentage / 100) * total;
}

/**
 * Calculates percentage change
 * @param oldValue - Original value
 * @param newValue - New value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Percentage change (can be negative)
 *
 * @example
 * percentageChange(100, 150)
 * // Returns: 50.00
 *
 * percentageChange(150, 100)
 * // Returns: -33.33
 */
export function percentageChange(oldValue: number, newValue: number, decimals: number = 2): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return round(((newValue - oldValue) / oldValue) * 100, decimals);
}

/**
 * Calculates growth rate
 * @param startValue - Starting value
 * @param endValue - Ending value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Growth rate as percentage
 *
 * @example
 * growthRate(1000, 1500)
 * // Returns: 50.00 (50% growth)
 */
export function growthRate(startValue: number, endValue: number, decimals: number = 2): number {
  return percentageChange(startValue, endValue, decimals);
}

// ======================== FINANCIAL CALCULATIONS ========================

/**
 * Calculates total from array of items with price
 * @param items - Array of items
 * @param priceGetter - Function to extract price
 * @returns Total amount
 *
 * @example
 * calculateTotal(services, (s) => parseFloat(s.price))
 * // Returns: 450.50
 */
export function calculateTotal<T>(items: T[], priceGetter: (item: T) => number): number {
  return items.reduce((total, item) => total + priceGetter(item), 0);
}

/**
 * Calculates subtotal (before tax and discount)
 * @param items - Array of items with price and quantity
 * @param priceGetter - Function to extract price
 * @param quantityGetter - Function to extract quantity (default: returns 1)
 * @returns Subtotal amount
 *
 * @example
 * calculateSubtotal(items, (i) => i.price, (i) => i.quantity)
 * // Returns: 1000.00
 */
export function calculateSubtotal<T>(items: T[], priceGetter: (item: T) => number, quantityGetter: (item: T) => number = () => 1): number {
  return items.reduce((total, item) => {
    return total + priceGetter(item) * quantityGetter(item);
  }, 0);
}

/**
 * Calculates discount amount
 * @param subtotal - Subtotal before discount
 * @param discountPercent - Discount percentage (0-100)
 * @returns Discount amount
 *
 * @example
 * calculateDiscount(1000, 15)
 * // Returns: 150.00
 */
export function calculateDiscount(subtotal: number, discountPercent: number): number {
  return fromPercentage(discountPercent, subtotal);
}

/**
 * Calculates tax amount
 * @param amount - Amount to calculate tax on
 * @param taxPercent - Tax percentage (0-100)
 * @returns Tax amount
 *
 * @example
 * calculateTax(1000, 10)
 * // Returns: 100.00
 */
export function calculateTax(amount: number, taxPercent: number): number {
  return fromPercentage(taxPercent, amount);
}

/**
 * Calculates final total (with discount and tax)
 * @param subtotal - Subtotal amount
 * @param discountPercent - Discount percentage (default: 0)
 * @param taxPercent - Tax percentage (default: 0)
 * @returns Final total
 *
 * @example
 * calculateFinalTotal(1000, 10, 5)
 * // Returns: 945.00 (1000 - 100 discount + 45 tax)
 */
export function calculateFinalTotal(subtotal: number, discountPercent: number = 0, taxPercent: number = 0): number {
  const afterDiscount = subtotal - calculateDiscount(subtotal, discountPercent);
  const tax = calculateTax(afterDiscount, taxPercent);
  return round(afterDiscount + tax, 2);
}

/**
 * Calculates amount after discount
 * @param amount - Original amount
 * @param discountPercent - Discount percentage
 * @returns Amount after discount
 *
 * @example
 * applyDiscount(100, 20)
 * // Returns: 80.00
 */
export function applyDiscount(amount: number, discountPercent: number): number {
  return amount - calculateDiscount(amount, discountPercent);
}

/**
 * Calculates amount with tax included
 * @param amount - Amount before tax
 * @param taxPercent - Tax percentage
 * @returns Amount with tax
 *
 * @example
 * applyTax(100, 10)
 * // Returns: 110.00
 */
export function applyTax(amount: number, taxPercent: number): number {
  return amount + calculateTax(amount, taxPercent);
}

// ======================== STATISTICAL CALCULATIONS ========================

/**
 * Calculates average (mean)
 * @param values - Array of numbers
 * @returns Average value
 *
 * @example
 * average([10, 20, 30])
 * // Returns: 20
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculates median (middle value)
 * @param values - Array of numbers
 * @returns Median value
 *
 * @example
 * median([1, 2, 3, 4, 5])
 * // Returns: 3
 *
 * median([1, 2, 3, 4])
 * // Returns: 2.5
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}

/**
 * Calculates mode (most frequent value)
 * @param values - Array of numbers
 * @returns Mode value (or first if multiple modes)
 *
 * @example
 * mode([1, 2, 2, 3, 3, 3, 4])
 * // Returns: 3
 */
export function mode(values: number[]): number | null {
  if (values.length === 0) return null;

  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  let modeValue = values[0];

  values.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value];
      modeValue = value;
    }
  });

  return modeValue;
}

/**
 * Calculates standard deviation
 * @param values - Array of numbers
 * @returns Standard deviation
 *
 * @example
 * standardDeviation([10, 12, 23, 23, 16, 23, 21, 16])
 * // Returns: ~4.9
 */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;

  const avg = average(values);
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = average(squareDiffs);

  return Math.sqrt(avgSquareDiff);
}

/**
 * Calculates variance
 * @param values - Array of numbers
 * @returns Variance
 *
 * @example
 * variance([10, 12, 23, 23, 16, 23, 21, 16])
 * // Returns: ~24.0
 */
export function variance(values: number[]): number {
  if (values.length === 0) return 0;

  const avg = average(values);
  const squareDiffs = values.map((value) => Math.pow(value - avg, 2));

  return average(squareDiffs);
}

// ======================== RATIO & CONVERSION ========================

/**
 * Calculates ratio between two values
 * @param value1 - First value
 * @param value2 - Second value
 * @returns Ratio as string (e.g., "3:1")
 *
 * @example
 * ratio(6, 2)
 * // Returns: "3:1"
 *
 * ratio(100, 50)
 * // Returns: "2:1"
 */
export function ratio(value1: number, value2: number): string {
  if (value2 === 0) return `${value1}:0`;

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(value1, value2);

  return `${value1 / divisor}:${value2 / divisor}`;
}

/**
 * Converts hours to minutes
 * @param hours - Hours value
 * @returns Minutes
 *
 * @example
 * hoursToMinutes(2.5)
 * // Returns: 150
 */
export function hoursToMinutes(hours: number): number {
  return hours * 60;
}

/**
 * Converts minutes to hours
 * @param minutes - Minutes value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Hours
 *
 * @example
 * minutesToHours(150)
 * // Returns: 2.5
 */
export function minutesToHours(minutes: number, decimals: number = 2): number {
  return round(minutes / 60, decimals);
}

/**
 * Calculates duration in hours from start and end times
 * @param startTime - Start time (ISO string or Date)
 * @param endTime - End time (ISO string or Date)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Duration in hours
 *
 * @example
 * calculateDurationHours('2024-01-01T10:00:00Z', '2024-01-01T14:30:00Z')
 * // Returns: 4.5
 */
export function calculateDurationHours(startTime: string | Date, endTime: string | Date, decimals: number = 2): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const milliseconds = end - start;

  return round(milliseconds / (1000 * 60 * 60), decimals);
}

/**
 * Calculates duration in minutes from start and end times
 * @param startTime - Start time (ISO string or Date)
 * @param endTime - End time (ISO string or Date)
 * @returns Duration in minutes
 *
 * @example
 * calculateDurationMinutes('2024-01-01T10:00:00Z', '2024-01-01T10:30:00Z')
 * // Returns: 30
 */
export function calculateDurationMinutes(startTime: string | Date, endTime: string | Date): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const milliseconds = end - start;

  return Math.round(milliseconds / (1000 * 60));
}

// ======================== BUSINESS METRICS ========================

/**
 * Calculates average order value (AOV)
 * @param totalRevenue - Total revenue
 * @param orderCount - Number of orders
 * @param decimals - Number of decimal places (default: 2)
 * @returns Average order value
 *
 * @example
 * averageOrderValue(5000, 50)
 * // Returns: 100.00
 */
export function averageOrderValue(totalRevenue: number, orderCount: number, decimals: number = 2): number {
  if (orderCount === 0) return 0;
  return round(totalRevenue / orderCount, decimals);
}

/**
 * Calculates customer lifetime value (CLV)
 * @param averageOrderValue - Average order value
 * @param purchaseFrequency - Purchases per year
 * @param customerLifespan - Customer lifespan in years
 * @param decimals - Number of decimal places (default: 2)
 * @returns Customer lifetime value
 *
 * @example
 * customerLifetimeValue(100, 12, 5)
 * // Returns: 6000.00
 */
export function customerLifetimeValue(
  averageOrderValue: number,
  purchaseFrequency: number,
  customerLifespan: number,
  decimals: number = 2
): number {
  return round(averageOrderValue * purchaseFrequency * customerLifespan, decimals);
}

/**
 * Calculates conversion rate
 * @param conversions - Number of conversions
 * @param totalVisitors - Total visitors
 * @param decimals - Number of decimal places (default: 2)
 * @returns Conversion rate as percentage
 *
 * @example
 * conversionRate(25, 1000)
 * // Returns: 2.5 (2.5%)
 */
export function conversionRate(conversions: number, totalVisitors: number, decimals: number = 2): number {
  return percentage(conversions, totalVisitors, decimals);
}

/**
 * Calculates retention rate
 * @param returningCustomers - Number of returning customers
 * @param totalCustomers - Total customers
 * @param decimals - Number of decimal places (default: 2)
 * @returns Retention rate as percentage
 *
 * @example
 * retentionRate(450, 500)
 * // Returns: 90.00 (90%)
 */
export function retentionRate(returningCustomers: number, totalCustomers: number, decimals: number = 2): number {
  return percentage(returningCustomers, totalCustomers, decimals);
}

/**
 * Calculates churn rate
 * @param lostCustomers - Number of lost customers
 * @param totalCustomers - Total customers at start
 * @param decimals - Number of decimal places (default: 2)
 * @returns Churn rate as percentage
 *
 * @example
 * churnRate(50, 500)
 * // Returns: 10.00 (10%)
 */
export function churnRate(lostCustomers: number, totalCustomers: number, decimals: number = 2): number {
  return percentage(lostCustomers, totalCustomers, decimals);
}

/**
 * Calculates profit margin
 * @param revenue - Total revenue
 * @param cost - Total cost
 * @param decimals - Number of decimal places (default: 2)
 * @returns Profit margin as percentage
 *
 * @example
 * profitMargin(1000, 600)
 * // Returns: 40.00 (40% margin)
 */
export function profitMargin(revenue: number, cost: number, decimals: number = 2): number {
  if (revenue === 0) return 0;
  return percentage(revenue - cost, revenue, decimals);
}

/**
 * Calculates return on investment (ROI)
 * @param gain - Gain from investment
 * @param cost - Cost of investment
 * @param decimals - Number of decimal places (default: 2)
 * @returns ROI as percentage
 *
 * @example
 * returnOnInvestment(1500, 1000)
 * // Returns: 50.00 (50% ROI)
 */
export function returnOnInvestment(gain: number, cost: number, decimals: number = 2): number {
  if (cost === 0) return 0;
  return percentage(gain - cost, cost, decimals);
}

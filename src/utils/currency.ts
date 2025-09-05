/**
 * Currency utility functions for Ghana Cedis (GHS)
 */

export const CURRENCY_SYMBOL = "GH₵";
export const CURRENCY_CODE = "GHS";

/**
 * Format a number as Ghana Cedis currency
 * @param amount - The amount to format
 * @param includeSymbol - Whether to include the currency symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  includeSymbol: boolean = true,
): string {
  if (amount === null || amount === undefined || amount === "") {
    return includeSymbol ? `${CURRENCY_SYMBOL}0.00` : "0.00";
  }

  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return includeSymbol ? `${CURRENCY_SYMBOL}0.00` : "0.00";
  }

  const formatted = numericAmount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return includeSymbol ? `${CURRENCY_SYMBOL}${formatted}` : formatted;
}

/**
 * Format a number as Ghana Cedis currency without decimal places
 * @param amount - The amount to format
 * @param includeSymbol - Whether to include the currency symbol (default: true)
 * @returns Formatted currency string without decimals
 */
export function formatCurrencyWhole(
  amount: number | string | null | undefined,
  includeSymbol: boolean = true,
): string {
  if (amount === null || amount === undefined || amount === "") {
    return includeSymbol ? `${CURRENCY_SYMBOL}0` : "0";
  }

  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return includeSymbol ? `${CURRENCY_SYMBOL}0` : "0";
  }

  const formatted = Math.round(numericAmount).toLocaleString("en-GH");

  return includeSymbol ? `${CURRENCY_SYMBOL}${formatted}` : formatted;
}

/**
 * Parse a currency string to a number
 * @param currencyString - The currency string to parse
 * @returns Parsed number or 0 if invalid
 */
export function parseCurrency(currencyString: string): number {
  if (!currencyString) return 0;

  // Remove currency symbols and spaces
  const cleaned = currencyString.replace(/[GH₵$,\s]/g, "");
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format currency for display in tables or compact spaces
 * @param amount - The amount to format
 * @returns Compact formatted currency string
 */
export function formatCurrencyCompact(
  amount: number | string | null | undefined,
): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount || "0") : amount || 0;

  if (numericAmount >= 1000000) {
    return `${CURRENCY_SYMBOL}${(numericAmount / 1000000).toFixed(1)}M`;
  } else if (numericAmount >= 1000) {
    return `${CURRENCY_SYMBOL}${(numericAmount / 1000).toFixed(1)}K`;
  } else {
    return formatCurrencyWhole(numericAmount);
  }
}

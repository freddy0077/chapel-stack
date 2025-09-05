/**
 * Utility functions for formatting data in the application
 */

/**
 * Format currency amount with proper currency symbol and locale
 * @param amount - Amount in cents (smallest currency unit)
 * @param currency - Currency code (e.g., 'USD', 'NGN', 'EUR')
 * @param locale - Locale for formatting (defaults to 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US",
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

/**
 * Format date to a readable string
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", options);
};

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (Math.abs(diffInHours) < 1) return "Just now";
  if (Math.abs(diffInHours) < 24) {
    return diffInHours > 0
      ? `${diffInHours}h ago`
      : `in ${Math.abs(diffInHours)}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (Math.abs(diffInDays) < 7) {
    return diffInDays > 0
      ? `${diffInDays}d ago`
      : `in ${Math.abs(diffInDays)}d`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (Math.abs(diffInWeeks) < 4) {
    return diffInWeeks > 0
      ? `${diffInWeeks}w ago`
      : `in ${Math.abs(diffInWeeks)}w`;
  }

  return formatDate(targetDate);
};

/**
 * Format subscription interval for display
 * @param interval - Subscription interval (e.g., 'MONTHLY', 'YEARLY')
 * @returns Formatted interval string
 */
export const formatSubscriptionInterval = (interval: string): string => {
  switch (interval?.toUpperCase()) {
    case "MONTHLY":
      return "month";
    case "YEARLY":
    case "ANNUAL":
      return "year";
    case "WEEKLY":
      return "week";
    case "DAILY":
      return "day";
    default:
      return interval?.toLowerCase() || "period";
  }
};

/**
 * Format subscription status for display
 * @param status - Subscription status
 * @returns Formatted status string
 */
export const formatSubscriptionStatus = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "Active";
    case "TRIALING":
      return "Trial";
    case "PAST_DUE":
      return "Past Due";
    case "CANCELLED":
      return "Cancelled";
    case "INCOMPLETE":
      return "Incomplete";
    case "INCOMPLETE_EXPIRED":
      return "Expired";
    case "UNPAID":
      return "Unpaid";
    default:
      return (
        status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() ||
        "Unknown"
      );
  }
};

/**
 * Format organization status for display
 * @param status - Organization status
 * @returns Formatted status string
 */
export const formatOrganizationStatus = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "Active";
    case "SUSPENDED":
      return "Suspended";
    case "CANCELLED":
      return "Cancelled";
    case "PENDING":
      return "Pending";
    default:
      return (
        status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() ||
        "Unknown"
      );
  }
};

/**
 * Format file size in bytes to human readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Format phone number for display
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone; // Return original if can't format
};

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};

/**
 * Format percentage for display
 * @param value - Decimal value (e.g., 0.25 for 25%)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

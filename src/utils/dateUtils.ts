// Date utility functions for the Death Register system

export const formatDate = (date: Date | string): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date: Date | string): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateForInput = (date: Date | string): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toISOString().split("T")[0];
};

export const formatTimeForInput = (date: Date | string): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toTimeString().slice(0, 5);
};

export const getRelativeTime = (date: Date | string): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
};

export const calculateAge = (
  birthDate: Date | string,
  deathDate?: Date | string,
): number => {
  if (!birthDate) return 0;

  const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
  const death = deathDate
    ? typeof deathDate === "string"
      ? new Date(deathDate)
      : deathDate
    : new Date();

  if (isNaN(birth.getTime()) || isNaN(death.getTime())) return 0;

  let age = death.getFullYear() - birth.getFullYear();
  const monthDiff = death.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const getYearsAgo = (date: Date | string): number => {
  if (!date) return 0;

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return 0;

  const now = new Date();
  return now.getFullYear() - dateObj.getFullYear();
};

export const isValidDate = (date: any): boolean => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  return !isNaN(dateObj.getTime());
};

export const formatDateRange = (
  startDate: Date | string,
  endDate?: Date | string,
): string => {
  if (!startDate) return "";

  const start = formatDate(startDate);

  if (!endDate) return start;

  const end = formatDate(endDate);

  if (start === end) return start;

  return `${start} - ${end}`;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[monthIndex] || "";
};

export const getDayName = (dayIndex: number): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[dayIndex] || "";
};

export const getMemorialAnniversary = (
  deathDate: Date | string,
): { date: Date; yearsAgo: number } => {
  if (!deathDate) return { date: new Date(), yearsAgo: 0 };

  const death = typeof deathDate === "string" ? new Date(deathDate) : deathDate;

  if (isNaN(death.getTime())) return { date: new Date(), yearsAgo: 0 };

  const currentYear = new Date().getFullYear();
  const anniversaryDate = new Date(
    currentYear,
    death.getMonth(),
    death.getDate(),
  );

  return {
    date: anniversaryDate,
    yearsAgo: currentYear - death.getFullYear(),
  };
};

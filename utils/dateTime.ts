type DateInput = Date | string | number;

interface FormatOptions {
  includeSeconds?: boolean;
  format12h?: boolean;
  includeWeekday?: boolean;
}

// Constants
const MONTHS = [
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
] as const;

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

// Core utility function
const parseDate = (date: DateInput): Date | null => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
};

// Base formatting functions
const formatDatePart = (date: Date, includeWeekday = false): string => {
  const weekday = includeWeekday ? `${WEEKDAYS[date.getDay()]}, ` : "";
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${weekday}${month} ${day}, ${year}`;
};

const formatDatePart2 = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
  return `${year}-${month}-${day}`;
};

const formatMonthName = (date: Date): string => {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

const formatTimePart = (date: Date, options: FormatOptions = {}): string => {
  const { includeSeconds = false, format12h = false } = options;

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = includeSeconds
    ? `:${date.getSeconds().toString().padStart(2, "0")}`
    : "";

  if (format12h) {
    const hour12 = hours % 12 || 12;
    const period = hours >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes}${seconds} ${period}`;
  }

  const hour24 = hours.toString().padStart(2, "0");
  return `${hour24}:${minutes}${seconds}`;
};

// Public API functions
export const formatDateWithShortMonth = (date: DateInput): string => {
  const d = parseDate(date);
  if (!d) return "Invalid Date";

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  let formatted = d.toLocaleDateString("en-US", options);

  return formatted;
};

export const formatDateOnly = (date: DateInput): string => {
  const d = parseDate(date);
  return d ? formatDatePart(d) : "Invalid Date";
};

export const formatDateWithWeekday = (date: DateInput): string => {
  const d = parseDate(date);
  return d ? formatDatePart(d, true) : "Invalid Date";
};

export const formatTime24h = (date: DateInput): string => {
  const d = parseDate(date);
  return d ? formatTimePart(d) : "Invalid Time";
};

export const formatTime12h = (date: DateInput): string => {
  const d = parseDate(date);
  return d ? formatTimePart(d, { format12h: true }) : "Invalid Time";
};

export const formatTime24hWithSeconds = (date: DateInput): string => {
  const d = parseDate(date);
  return d ? formatTimePart(d, { includeSeconds: true }) : "Invalid Time";
};

export const formatTime12hWithSeconds = (date: DateInput): string => {
  const d = parseDate(date);
  return d
    ? formatTimePart(d, { includeSeconds: true, format12h: true })
    : "Invalid Time";
};

export const formatDateAndTime = (date: DateInput): string => {
  const d = parseDate(date);
  return d
    ? `${formatDatePart(d)} ${formatTimePart(d, { format12h: true })}`
    : "Invalid Date";
};

export const formatDayAndShortWeekday = (dateInput: DateInput): string => {
  const date = parseDate(dateInput);
  if (!date) return "Invalid Date";

  const day = date.getDate();
  const shortWeekday = WEEKDAYS[date.getDay()].slice(0, 3);
  return `${day} ${shortWeekday}`;
};

export const formatDateAndTimeWithSeconds = (date: DateInput): string => {
  const d = parseDate(date);
  return d
    ? `${formatDatePart(d)} ${formatTimePart(d, {
        includeSeconds: true,
        format12h: true,
      })}`
    : "Invalid Date";
};

export const formatDateNumbers = (date: DateInput): string => {
  const d = parseDate(date);
  return d ? `${formatDatePart2(d)}` : "Invalid Date";
};

export const formatDateNameOnly = (date: DateInput): string => {
  const d = parseDate(date);
  return d ? `${formatMonthName(d)}` : "Invalid Date";
};

export const formatDateAndTimeWithWeekday = (date: DateInput): string => {
  const d = parseDate(date);
  return d
    ? `${formatDatePart(d, true)} ${formatTimePart(d, { format12h: true })}`
    : "Invalid Date";
};

export const formatDateAndTimeWithWeekdayAndSeconds = (
  date: DateInput
): string => {
  const d = parseDate(date);
  return d
    ? `${formatDatePart(d, true)} ${formatTimePart(d, {
        includeSeconds: true,
        format12h: true,
      })}`
    : "Invalid Date";
};

// Flexible formatter function
export const formatDateTime = (
  date: DateInput,
  options: {
    dateOnly?: boolean;
    timeOnly?: boolean;
    includeSeconds?: boolean;
    format12h?: boolean;
    includeWeekday?: boolean;
  } = {}
): string => {
  const d = parseDate(date);
  if (!d) return "Invalid Date";

  const {
    dateOnly = false,
    timeOnly = false,
    includeSeconds = false,
    format12h = true,
    includeWeekday = false,
  } = options;

  if (dateOnly) return formatDatePart(d, includeWeekday);
  if (timeOnly) return formatTimePart(d, { includeSeconds, format12h });

  return `${formatDatePart(d, includeWeekday)} ${formatTimePart(d, {
    includeSeconds,
    format12h,
  })}`;
};
export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  // Check if it's the same day
  const isToday = date.toDateString() === now.toDateString();

  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // Just now (less than 1 minute)
  if (diffMinutes < 1) {
    return "Just now";
  }

  // For today, show detailed time breakdown
  if (isToday) {
    // 1-60 minutes
    if (diffMinutes >= 1 && diffMinutes <= 60) {
      return diffMinutes === 1 ? "1min" : `${diffMinutes}min`;
    }

    // More than 60 minutes - show hours
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours >= 1) {
      return diffHours === 1 ? "1h" : `${diffHours}h`;
    }
  }

  // Yesterday
  if (isYesterday) {
    return "Yesterday";
  }

  // Check if it's this week (within the last 7 days, excluding today and yesterday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);

  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  if (dateOnly >= startOfWeek && !isToday && !isYesterday) {
    // Show full weekday name (e.g., "Monday", "Tuesday")
    return date.toLocaleDateString([], { weekday: "long" });
  }

  // Check if it's more than a year ago
  const diffYears = now.getFullYear() - date.getFullYear();
  if (diffYears > 0) {
    // More than a year ago - show full date: 2023 Aug, 20 10:10 AM
    const year = date.getFullYear();
    const monthShort = date.toLocaleDateString([], { month: "short" });
    const day = date.getDate();
    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${year} ${monthShort}, ${day} ${time}`;
  }

  // Not this week and not more than a year
  const monthShort = date.toLocaleDateString([], { month: "short" });
  const day = date.getDate();
  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${monthShort} ${day} ${time}`;
};

// src/utils/time.ts
import { format, toZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Jakarta";

export function formatWIB(raw: string, fmt = "dd MMM yyyy HH:mm 'WIB'") {
  try {
    const date = new Date(raw);
    if (isNaN(date.getTime())) {
      console.warn("Invalid parsed date:", raw);
      return "Invalid Date";
    }

    const zoned = toZonedTime(date, TIMEZONE);
    return format(zoned, fmt, { timeZone: TIMEZONE });
  } catch (error) {
    console.error("formatWIB error:", error);
    return "Invalid Date";
  }
}

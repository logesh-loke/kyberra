// src/utils/dateUtils.js
import moment from "moment-timezone";

/**
 * Get user's browser timezone (e.g. "Asia/Kolkata", "America/New_York")
 * Fallback: Asia/Kolkata (IST)
 */
export const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
  } catch (e) {
    return "Asia/Kolkata";
  }
};

/**
 * Format email timestamp in a Gmail-like way.
 *
 * Rules:
 *  - If within last 24 hours → show time only (e.g. "3:08 PM")
 *  - If same year (but >= 24 hours ago) → "8,Nov"
 *  - If previous year → "8,Nov 2024"
 *
 * @param {string} isoString - ISO datetime string (e.g. "2025-11-19T15:08:51.000Z")
 * @param {object} options
 * @param {string} [options.timezone] - IANA timezone (e.g. "Asia/Kolkata"). Default: user tz or IST.
 * @returns {string}
 */
export const formatMailTimestamp = (
  isoString,
  { timezone } = {}
) => {
  if (!isoString) return "";

  const tz = timezone || getUserTimezone();

  // Parse the date in the desired timezone
  const messageTime = moment.tz(isoString, tz);
  const now = moment.tz(tz);

  const diffInHours = now.diff(messageTime, "hours");
  const sameYear = now.year() === messageTime.year();

  // 1) Within 24 hours → time only
  if (diffInHours < 24) {
    // Example: "3:08 PM"
    return messageTime.format("h:mm A");
  }

  // 2) Same year → "8,Nov"
  if (sameYear) {
    return messageTime.format("D,MMM"); // e.g. "8,Nov"
  }

  // 3) Previous years → "8,Nov 2024"
  return messageTime.format("D,MMM YYYY");
};

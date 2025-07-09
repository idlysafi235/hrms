// src/utils/dateUtils.js

export function parseUTCToLocalDate(utcDateString) {
    if (!utcDateString) return null;
    const date = new Date(utcDateString);
    if (isNaN(date)) return null;
    return date;
  }
  

  export function formatLocalDateTime(date, options) {
    if (!date) return '';

    return date.toLocaleString(undefined, options);
  }
  
import { formatDistanceToNow, parseISO } from "date-fns";

export const convertTotalHoursToSeconds = (totalHours) => {
  const validHours = Number(totalHours);
  if (isNaN(validHours) || validHours < 0) return 0;
  return Math.floor(validHours * 3600);
};

export const secondsToDuration = (seconds) => {
  const validSeconds = Number(seconds);
  if (isNaN(validSeconds) || validSeconds < 0) return { hours: 0, mins: 0 };

  return {
    hours: Math.floor(validSeconds / 3600),
    mins: Math.floor((validSeconds % 3600) / 60),
    secs: validSeconds % 60,
  };
};

export const formatTotalHours = (decimalHours) => {
  const seconds = convertTotalHoursToSeconds(decimalHours);
  const { hours, mins } = secondsToDuration(seconds);
  return `${hours}h:${mins.toString().padStart(2, "0")}m`;
};

export function timeAgo(dateString) {
  if (!dateString) return "";
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

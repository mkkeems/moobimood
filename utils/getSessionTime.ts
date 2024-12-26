import { addDays, addHours, addMinutes } from "date-fns";

// expTime looks like "15m", "7h", "30d" etc
export const getExpiresAt = (expTime: string): Date => {
  const timeUnit = expTime.slice(-1);
  const timeValue = Number.parseInt(expTime.slice(0, -1), 10);

  switch (timeUnit) {
    case "m":
      return addMinutes(new Date(), timeValue);
    case "h":
      return addHours(new Date(), timeValue);
    case "d":
      return addDays(new Date(), timeValue);
    default:
      throw new Error("Invalid expiration time format. Use 'm', 'h', or 'd'.");
  }
};

export const getMaxAge = (expTime: string): number => {
  const timeUnit = expTime.slice(-1);
  const timeValue = Number.parseInt(expTime.slice(0, -1), 10);

  switch (timeUnit) {
    case "m":
      return timeValue * 60;
    case "h":
      return timeValue * 60 * 60;
    case "d":
      return timeValue * 60 * 60 * 24;
    default:
      throw new Error("Invalid expiration time format. Use 'm', 'h', or 'd'.");
  }
};

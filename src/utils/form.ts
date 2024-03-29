import type { Maybe } from "@trpc/server";
import { format } from "date-fns";
import { z } from "zod";

function isValidDate(date: Date) {
  return !isNaN(date.getTime());
}

/**
 * Create a date YYYY-MM-DD date string that is typecasted as a `Date`.
 * Hack when using `defaultValues` in `react-hook-form`
 * This is because `react-hook-form` doesn't support `defaultValue` of type `Date` even if the types say so
 */
export function dateToInputDate(date?: Maybe<Date>) {
  if (!date || !isValidDate(date)) {
    return undefined;
  }
  return format(date, "yyyy-MM-dd") as unknown as Date;
}

export function dateToInputDateTime(date?: Maybe<Date>) {
  if (!date || !isValidDate(date)) {
    return undefined;
  }
  return format(date, "yyyy-MM-dd'T'HH:mm") as unknown as Date;
}

export const phoneSchema = z
  .string()
  .regex(
    /^(\+61)4\d{8}$/,
    "Not a valid AU mobile number, please use +614 format and remove spaces"
  );

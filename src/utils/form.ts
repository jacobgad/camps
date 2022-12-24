import type { Maybe } from "@trpc/server";

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
  return date.toJSON().slice(0, 10) as unknown as Date;
}

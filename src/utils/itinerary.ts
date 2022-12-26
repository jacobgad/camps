import type { ItineraryItem, ItineraryOption } from "@prisma/client";
import { startOfDay } from "date-fns";

type Itinerary = (ItineraryItem & {
  options: ItineraryOption[];
})[];
type GroupedItinerary = { [key: string]: Itinerary };

export function groupItinerary(items: Itinerary): GroupedItinerary {
  const groupedItinerary: GroupedItinerary = {};
  items.forEach((item) => {
    const key = startOfDay(item.date).toISOString();
    const array = groupedItinerary[key];
    array ? array.push(item) : (groupedItinerary[key] = [item]);
  });
  return groupedItinerary;
}

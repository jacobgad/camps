import type { ItineraryItem, ItineraryOption } from "@prisma/client";
import {
  format,
  isSameDay,
  isToday,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { groupBy } from "utils/itinerary";
import {
  CalendarDaysIcon,
  InformationCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Card from "@ui/cards/Card";

type Props = {
  itineraryItems: (ItineraryItem & {
    options: ItineraryOption[];
  })[];
};

export default function Itinerary({ itineraryItems }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const groupedItinerary = useMemo(() => {
    return groupBy(itineraryItems, (item) =>
      startOfDay(item.date).toISOString()
    );
  }, [itineraryItems]);

  const dates = useMemo(() => {
    return [
      ...new Set(Object.keys(groupedItinerary).map((date) => new Date(date))),
    ];
  }, [groupedItinerary]);

  useEffect(() => {
    if (dates.length < 2) return;
    if (
      !isWithinInterval(selectedDate, {
        start: dates.at(0) as Date,
        end: dates.at(-1) as Date,
      })
    ) {
      setSelectedDate(dates.at(0) as Date);
    }
  }, [dates, selectedDate]);

  const itinerary = groupedItinerary[selectedDate.toISOString()] ?? [];

  return (
    <>
      <div className="flex justify-center gap-6">
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => setSelectedDate(date)}
            className={`flex h-14 w-14 flex-col items-center justify-center rounded-lg shadow transition
            ${
              isSameDay(selectedDate, date)
                ? "bg-indigo-500 text-white"
                : "bg-white"
            } ${isToday(date) && "ring"}
            `}
          >
            <span className="text-lg font-bold">{format(date, "d")}</span>
            <span className="text-sm">{format(date, "E")}</span>
          </button>
        ))}
      </div>

      <Card className="mt-4 flex gap-3 bg-white py-5 px-6">
        <div className="flex-grow">
          <h2 className="flex items-center gap-2 pb-4 text-base font-medium text-gray-900">
            <CalendarDaysIcon className="h-6 w-6 text-gray-900" />
            {format(new Date(selectedDate), "d LLLL yyyy")}
          </h2>
          <ul className="mt-3 flex flex-col gap-4">
            {itinerary.map((item, idx) => (
              <li key={item.id} className={`${idx > 0 && "border-t pt-4"}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {format(item.date, "h:mm a")}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {item.options.at(0)?.name ?? item.name}
                </p>
                <div className="mt-2 space-y-1 text-sm font-normal text-gray-500">
                  {(item.options.at(0)?.description ?? item.description) && (
                    <p>
                      <InformationCircleIcon className="mr-1 inline h-4" />
                      {item.options.at(0)?.description ?? item.description}
                    </p>
                  )}
                  {item.location && (
                    <p className="flex items-center gap-1">
                      <MapPinIcon className="h-4" />
                      {item.options.at(0)?.location ?? item.location}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </>
  );
}

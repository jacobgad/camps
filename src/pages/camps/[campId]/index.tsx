import type { GetServerSideProps, NextPage } from "next";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { isAuthed } from "utils/auth";
import { groupItinerary } from "utils/itinerary";
import { trpc } from "utils/trpc";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import Card from "@ui/cards/Card";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const { data } = trpc.member.get.useQuery({ campId });

  const groupedItinerary = useMemo(
    () => groupItinerary(data?.camp.itineraryItems ?? []),
    [data?.camp.itineraryItems]
  );

  return (
    <main className="flex flex-col bg-indigo-600 px-4 py-8 text-indigo-50">
      <div className="mb-6">
        <h1>{data?.camp.name}</h1>
        <p>{data?.camp.organiser}</p>
      </div>

      {Object.entries(groupedItinerary).map(([day, itinerary]) => (
        <Card key={day} className="mt-4 flex gap-3 px-6">
          <CalendarDaysIcon className="h-6 text-indigo-600" />

          <div className="flex-grow">
            <h2 className="text-base font-medium text-indigo-600">
              {format(new Date(day), "d LLLL yyyy")}
            </h2>
            <ul className="mt-3">
              {itinerary.map((item, idx) => (
                <li key={item.id} className={`py-4 ${idx > 0 && "border-t"}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {format(item.date, "h:mm a")}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-sm font-normal text-gray-500">
                    <span>{item.description}</span>
                    {item.description && " | "}
                    <span>{item.location}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ))}
    </main>
  );
};

export default Page;

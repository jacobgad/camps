import type { GetServerSideProps, NextPage } from "next";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "server/trpc/router/_app";
import { PlusIcon } from "@heroicons/react/20/solid";
import Button from "@ui/Button";
import { format, startOfDay } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";
import { useMemo } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

type Itinerary = inferRouterOutputs<AppRouter>["itinerary"]["getAll"];
type GroupedItinerary = { [key: string]: Itinerary };

function groupItinerary(items: Itinerary): GroupedItinerary {
  const groupedItinerary: GroupedItinerary = {};
  items.forEach((item) => {
    const key = startOfDay(item.date).toISOString();
    const array = groupedItinerary[key];
    array ? array.push(item) : (groupedItinerary[key] = [item]);
  });
  return groupedItinerary;
}

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.id as string;
  const { data } = trpc.itinerary.getAll.useQuery({ id: campId });

  const groupedItinerary = useMemo(() => groupItinerary(data ?? []), [data]);

  return (
    <main className="flex flex-col px-4 py-8">
      <h1>Itinerary</h1>
      <Link href={`/camps/${campId}/admin/itinerary/new`} className="mt-6">
        <Button
          text="Add new session"
          Icon={PlusIcon}
          fullWidth
          className="justify-center"
        />
      </Link>

      {Object.entries(groupedItinerary).map(([day, itinerary]) => (
        <div key={day} className="mt-4 flex gap-3 rounded px-7 py-4 shadow">
          <CalendarDaysIcon className="h-6 text-indigo-600" />

          <div className="flex-grow">
            <h2 className="text-base font-medium text-indigo-600">
              {format(new Date(day), "d LLLL yyyy")}
            </h2>
            <ul className="mt-3">
              {itinerary.map((item, idx) => (
                <li key={item.id} className={`py-4 ${idx > 0 && "border-t"}`}>
                  <Link href={`/camps/${campId}/admin/itinerary/${item.id}`}>
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
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </main>
  );
};

export default Page;

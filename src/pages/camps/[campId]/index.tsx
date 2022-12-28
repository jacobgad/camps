import type { GetServerSideProps, NextPage } from "next";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { isAuthed } from "utils/auth";
import { groupItinerary } from "utils/itinerary";
import { trpc } from "utils/trpc";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import Card from "@ui/cards/Card";
import Layout from "components/layout/Layout";

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
    <Layout variant='dark'>
      <div className="mb-6">
        <h1 className="text-2xl text-gray-100">{data?.camp.name}</h1>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          {data?.camp.organiser}
        </p>
      </div>

      {Object.entries(groupedItinerary).map(([day, itinerary]) => (
        <Card key={day} variant="dark" className="mt-4 flex gap-3">
          <CalendarDaysIcon className="h-6 text-gray-900" />

          <div className="flex-grow">
            <h2 className="text-base font-medium text-gray-900">
              {format(new Date(day), "d LLLL yyyy")}
            </h2>
            <ul className="mt-3 flex flex-col gap-4">
              {itinerary.map((item, idx) => (
                <li key={item.id} className={`${idx > 0 && "border-t pt-4"}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {format(item.date, "h:mm a")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
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
    </Layout>
  );
};

export default Page;

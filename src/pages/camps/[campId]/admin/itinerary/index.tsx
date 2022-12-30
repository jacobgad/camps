import type { GetServerSideProps, NextPage } from "next";
import { PlusIcon } from "@heroicons/react/20/solid";
import Button from "@ui/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";
import { useMemo } from "react";
import { groupBy } from "utils/itinerary";
import { format, startOfDay } from "date-fns";
import ItemCard from "@ui/cards/ItemCard";
import { toast } from "react-hot-toast";
import Layout from "components/layout/Layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const { data } = trpc.itinerary.getAll.useQuery(
    { campId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  const groupedItinerary = useMemo(
    () => groupBy(data ?? [], (item) => startOfDay(item.date).toISOString()),
    [data]
  );

  return (
    <Layout>
      <h1>Itinerary</h1>
      <Link href={`/camps/${campId}/admin/itinerary/new`} className="my-6">
        <Button
          text="Add new session"
          Icon={PlusIcon}
          fullWidth
          className="justify-center"
        />
      </Link>

      {Object.entries(groupedItinerary).map(([day, itinerary], idx) => (
        <div key={day} className={`${idx > 0 && "mt-8 border-t pt-8"}`}>
          <h2 className="mb-2 text-base font-bold">
            {format(new Date(day), "dd MMM yyyy")}
          </h2>
          <ul className="flex flex-col gap-4">
            {itinerary.map((item) => (
              <li key={item.id}>
                <p className="mb-2 text-sm font-semibold tracking-wider text-gray-500">
                  {format(item.date, "h:mm aa")}
                </p>
                <Link href={`/camps/${campId}/admin/itinerary/${item.id}`}>
                  {item.options.length === 0 ? (
                    <ItemCard
                      label={item.name}
                      description="Single-track session"
                    />
                  ) : (
                    <>
                      {item.options.map((option, idx) => (
                        <div key={option.id} className={`${idx > 0 && "mt-2"}`}>
                          <ItemCard
                            label={option.name}
                            description={`Multi-track session | Capacity ${option.members.length}/${option.capacity}`}
                          />
                        </div>
                      ))}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Layout>
  );
};

export default Page;

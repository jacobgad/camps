import CreateItineraryItemForm from "components/itinerary/CreateItineraryItemForm";
import { format } from "date-fns";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = trpc.itinerary.get.useQuery({ id });

  return (
    <main className="flex min-h-screen flex-col p-4">
      <h1>ADMIN</h1>
      <h2>Timetable</h2>
      <CreateItineraryItemForm campId={id} />

      <ul className="mt-4 grid gap-2">
        {data?.map((item) => (
          <li key={item.id}>
            <p>{format(item.date, "h:mm a")}</p>
            <p>{item.title}</p>
            <p className="text-sm">{item.description}</p>
            <ul>
              {item.options.map((option) => (
                <li key={option.id}>
                  <p>{option.title}</p>
                  <p>{option.description}</p>
                </li>
              ))}
              <Link
                href={`/camps/${id}/admin/itinerary/${item.id}`}
                className="border bg-white px-2"
              >
                Add Options
              </Link>
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Page;

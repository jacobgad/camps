import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";
import Layout from "components/layout/Layout";
import Itinerary from "components/Dashboard/Itinerary";
import { toast } from "react-hot-toast";
import Card from "@ui/cards/Card";
import { KeyIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const { data } = trpc.member.get.useQuery(
    { campId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  return (
    <Layout variant="dark">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-100">{data?.camp.name}</h1>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          {data?.camp.organiser}
        </p>
        <p className="mt-4 text-gray-400">Welcome {data?.user.name}</p>
      </div>

      <div className="mb-4 space-y-4">
        <Card className="flex items-center justify-between bg-white">
          <span className="flex items-center gap-2 ">
            <KeyIcon className="h-8" />
            {data?.room.name ?? "Room not assigned"}
          </span>
          {/* <Link href="rooms/edit" className="text font-medium text-indigo-600">
            Edit
          </Link> */}
        </Card>

        <Card className="flex items-center justify-between bg-white">
          <span className="flex items-center gap-2 ">
            <UserGroupIcon className="h-8" />
            {data?.team ?? "Team not found"}
          </span>
          <div
            className="h-8 w-8 rounded-full"
            style={{ backgroundColor: data?.team }}
          />
        </Card>
      </div>

      <Itinerary itineraryItems={data?.camp.itineraryItems ?? []} />
    </Layout>
  );
};

export default Page;

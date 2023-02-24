import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";
import Layout from "components/layout/Layout";
import Itinerary from "components/Dashboard/Itinerary";
import { toast } from "react-hot-toast";
import RoomCard from "components/Dashboard/RoomCard";
import TeamCard from "components/Dashboard/TeamCard";
import TeamScoreBoard from "components/Dashboard/TeamScoreBoard";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const { data, isLoading } = trpc.member.get.useQuery(
    { campId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  return (
    <Layout variant="dark">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-100">
          {data?.camp.name}
          {isLoading && "Loading..."}
        </h1>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          {data?.camp.organiser}
        </p>
        <p className="mt-4 text-gray-400">
          {data?.user && `Welcome ${data.user.name ?? data.user.email}`}
        </p>
      </div>

      <div className="mb-4 space-y-4">
        {data?.room && <RoomCard room={data.room} />}
        {data?.team && <TeamCard team={data.team} />}
        <TeamScoreBoard />
      </div>

      {data?.camp.itineraryItems && (
        <Itinerary itineraryItems={data.camp.itineraryItems} />
      )}
    </Layout>
  );
};

export default Page;

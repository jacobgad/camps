import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";
import Layout from "components/layout/Layout";
import Itinerary from "components/Dashboard/Itinerary";
import { toast } from "react-hot-toast";

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
      </div>

      <Itinerary itineraryItems={data?.camp.itineraryItems ?? []} />
    </Layout>
  );
};

export default Page;

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
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const [tabIdx, setTabIdx] = useState(0);

  const { data, isLoading } = trpc.member.get.useQuery(
    { campId },
    {
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === "BAD_REQUEST") {
          router.push(`/camps/${campId}/register`);
        }
      },
    }
  );

  const teams = trpc.team.getAll.useQuery(
    { campId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  return (
    <Layout variant="dark">
      <div className="mb-4">
        <h1 className="min-h-8 text-2xl text-gray-100">
          {data?.camp.name}
          {isLoading && "Loading..."}
        </h1>
        <p className="mt-1 min-h-4 text-xs font-medium uppercase tracking-wide text-gray-400">
          {data?.camp.organiser}
        </p>
        <p className="mt-4 min-h-4 text-gray-400">
          {data?.user && `Welcome ${data.user.name ?? data.user.email}`}
        </p>
      </div>

      <div className="mb-6 flex gap-1 overflow-hidden rounded bg-gray-100 p-1">
        {["My Info", "My Itinerary"].map((label, idx) => (
          <button
            key={idx}
            onClick={() => setTabIdx(idx)}
            className={`transition, flex-1 rounded py-2 shadow ${
              tabIdx === idx ? "bg-indigo-700 text-white" : "bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {tabIdx === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mb-4 space-y-4"
          >
            {data?.room && <RoomCard room={data.room} />}
            {data?.team && <TeamCard team={data.team} />}
            {teams?.data && <TeamScoreBoard teams={teams.data} />}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {tabIdx === 1 && data?.camp.itineraryItems && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Itinerary itineraryItems={data.camp.itineraryItems} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Page;

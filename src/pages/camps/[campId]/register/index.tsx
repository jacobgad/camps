import type { GetServerSideProps, NextPage } from "next";
import Layout from "components/layout/Layout";
import PersonalInformationStep from "components/register/PersonalInformationStep";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";
import RoomAssignmentStep from "components/register/RoomAssignmentStep";
import ItineraryAssignmentStep from "components/register/ItineraryAssignmentStep";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const [stepIdx, setStepIdx] = useState(0);

  const camp = trpc.camp.get.useQuery(
    { id: campId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  return (
    <Layout>
      <header className="-mx-4 -mt-8 mb-8 bg-indigo-600 px-4 py-8 text-indigo-50">
        <h1 className="min-h-8 text-2xl font-extrabold tracking-tight">
          {camp.data?.name}
        </h1>
        <p className="mt-1 min-h-4 text-xs uppercase tracking-wide">
          {camp.data?.organiser}
        </p>
      </header>

      <div className="flex flex-grow flex-col">
        {stepIdx === 0 && (
          <PersonalInformationStep onComplete={() => setStepIdx(1)} />
        )}

        {stepIdx === 1 && (
          <RoomAssignmentStep
            campId={campId}
            onBack={() => stepIdx > 0 && setStepIdx(stepIdx - 1)}
            onNext={() => stepIdx < 2 && setStepIdx(stepIdx + 1)}
          />
        )}

        {stepIdx === 2 && (
          <ItineraryAssignmentStep
            campId={campId}
            onBack={() => stepIdx > 0 && setStepIdx(stepIdx - 1)}
            onNext={() => router.push(`/camps/${campId}`)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Page;

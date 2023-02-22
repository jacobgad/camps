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

const stepInfo = [
  {
    title: "Personal information",
    description:
      "Your information is only accessible to the event organisers, and will not be shared publicly.",
  },
  {
    title: "Your room",
    description:
      "Select which room you would like to stay in for the duration of the camp",
  },
  {
    title: "Your itinerary",
    description:
      "Select the sessions you wish to attend below. We will put together a personalised itinerary for you.",
  },
];

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
      <header className="-mx-4 -mt-8 bg-indigo-600 px-4 py-8 text-indigo-50">
        <h1 className="h-8 text-2xl font-extrabold tracking-tight">
          {camp.data?.name}
        </h1>
        <p className="mt-1 h-4 text-xs uppercase tracking-wide">
          {camp.data?.organiser}
        </p>
      </header>
      <h2 className="mt-8 text-lg font-medium text-gray-900">
        {stepInfo[stepIdx]?.title}
      </h2>
      <p className="mt-1 mb-6 text-sm font-normal text-gray-500">
        {stepInfo[stepIdx]?.description}
      </p>

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

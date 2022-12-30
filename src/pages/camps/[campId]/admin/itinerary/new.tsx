import type { GetServerSideProps, NextPage } from "next";
import type { ItineraryType } from "components/itinerary/ItineraryTypeForm";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";
import { toast } from "react-hot-toast";
import ItineraryItemForm from "components/itinerary/ItineraryTypeForm";
import SingleTrackItineraryForm from "components/itinerary/SingleTrackItineraryForm";
import Layout from "components/layout/Layout";
import MultiTrackItineraryForm from "components/itinerary/MultiTrackItineraryForm";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const [itineraryType, setItineraryType] =
    useState<ItineraryType>("singleTrack");

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.itinerary.create.useMutation({
    onSuccess: () => {
      utils.itinerary.getAll.invalidate();
      router.push(`/camps/${campId}/admin/itinerary`);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Layout>
      <h1 className="mb-6">Itinerary</h1>
      <ItineraryItemForm value={itineraryType} onChange={setItineraryType} />

      {itineraryType === "singleTrack" && (
        <SingleTrackItineraryForm
          defaultValues={{ campId }}
          buttonProps={{ text: "Create itinerary item", isLoading }}
          onSubmit={mutate}
        />
      )}

      {itineraryType === "multiTrack" && (
        <MultiTrackItineraryForm
          defaultValues={{
            campId,
            options: [
              { name: "", capacity: 0 },
              { name: "", capacity: 0 },
            ],
          }}
          buttonProps={{ text: "Create itinerary item", isLoading }}
          onSubmit={mutate}
        />
      )}
    </Layout>
  );
};

export default Page;

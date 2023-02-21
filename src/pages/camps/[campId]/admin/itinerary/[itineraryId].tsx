import type { GetServerSideProps, NextPage } from "next";
import type { ItineraryType } from "components/itinerary/ItineraryTypeForm";
import { useRouter } from "next/router";
import { isAuthed } from "utils/auth";
import { trpc } from "utils/trpc";
import { toast } from "react-hot-toast";
import SingleTrackItineraryForm from "components/itinerary/SingleTrackItineraryForm";
import { useMemo } from "react";
import Layout from "components/layout/Layout";
import MultiTrackItineraryForm from "components/itinerary/MultiTrackItineraryForm";
import UserCard from "@ui/cards/UserCard";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await isAuthed(context);
  if (redirect) return redirect;
  return { props: {} };
};

const Page: NextPage = () => {
  const router = useRouter();
  const campId = router.query.campId as string;
  const itineraryId = Number(router.query.itineraryId as string);

  const { data } = trpc.itinerary.get.useQuery(
    { id: itineraryId },
    {
      onError: (error) => toast.error(error.message),
    }
  );

  const itineraryType = useMemo<undefined | ItineraryType>(() => {
    if (!data?.options) return undefined;
    return data.options.length ? "multiTrack" : "singleTrack";
  }, [data?.options]);

  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.itinerary.update.useMutation({
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      utils.itinerary.getAll.invalidate();
      router.push(`/camps/${campId}/admin/itinerary`);
    },
  });

  return (
    <Layout>
      <h1 className="mb-6">Itinerary</h1>

      {data && itineraryType === "singleTrack" && (
        <SingleTrackItineraryForm
          defaultValues={data}
          buttonProps={{ text: "Save changes", isLoading }}
          onSubmit={(formData) => mutate({ ...formData, id: data.id })}
        />
      )}

      {data && itineraryType === "multiTrack" && (
        <>
          <MultiTrackItineraryForm
            defaultValues={data}
            buttonProps={{ text: "Save changes", isLoading }}
            onSubmit={(formData) => mutate({ ...formData, id: data.id })}
          />

          <div className="mt-10">
            {data.options.map((option) => (
              <div key={option.id}>
                <p className="mt-8 text-lg font-medium">{option.name}</p>
                <ul className="mt-4">
                  {option.members.map((member, idx) => (
                    <li key={member.id} className={`${idx > 0 && "mt-2"}`}>
                      <UserCard
                        text={member.user.name ?? member.user.email}
                        actionText="Reallocate"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Page;
